"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { jwtVerify } from "jose";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

export const generateAccessToken = async (code, user) => {
  const { db } = await connectToDatabase();

  let tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.BASEURL + "/dashboard/profile",
      client_id: process.env.LINKEDIN_CLIENT_ID || "",
      client_secret: process.env.LINKEDIN_CLIENT_SECRET || "",
    }),
  });

  let tokenData = await tokenResponse.json();

  let profileResponse = await fetch("https://api.linkedin.com/v2/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  let profileData = await profileResponse.json();
  const linkedinURN = `urn:li:person:${profileData.id}`;

  const dataToSave = {
    user_id: user._id,
    access_token: tokenData.access_token,
    expires_in: tokenData.expires_in,
    linkedin_urn: linkedinURN,
    createdAt: new Date(),
  };

  await db.collection("user_properties").insertOne(dataToSave);

  return dataToSave;
};

export const getAccessToken = async (user) => {
  const { db } = await connectToDatabase();
  const userProperties = await db.collection("user_properties").find({ user_id: user._id }).sort({ createdAt: -1 }).limit(1).toArray();
  if (!userProperties || !userProperties[0]) return null;
  const access_token = userProperties[0]?.access_token;

  const expiresInSeconds = userProperties[0]?.expires_in;
  if (!expiresInSeconds) return null;
  const expiresInMilliseconds = expiresInSeconds * 1000;
  const expirationTime = new Date(userProperties[0]?.created_at).getTime() + expiresInMilliseconds;
  if (expirationTime < new Date().getTime()) {
    let response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: userProperties[0]?.refresh_token,
        client_id: process.env.LINKEDIN_CLIENT_ID || "",
        client_secret: process.env.LINKEDIN_CLIENT_SECRET || "",
      }),
    });
    let data = await response.json();
    data.user_id = user._id;
    data.updatedAt = new Date();
    await db.collection("user_properties").updateOne({ _id: userProperties[0]._id }, { $set: data });
    return data.access_token;
  } else {
    return access_token;
  }
};

export const getProfileData = async (user) => {
  const accessToken = await getAccessToken(user);
  if (!accessToken) return null;
  let liUrl = "https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,vanityName,localizedHeadline,profilePicture(displayImage~:playableStreams))";
  const response = await fetch(liUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const profileData = await response.json();
  return profileData;
};

// get linkedin post stats

export const getPostStats = async (id) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");
    if (!token || !token.value) {
      return null;
    }
    const { payload } = await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET));
    if (!payload.email) {
      return null;
    }
    const { db } = await connectToDatabase();
    const post = await db.collection("schedule").findOne({ _id: ObjectId.createFromHexString(id) });
    const user = await db.collection("users").findOne({ email: payload.email });
    const post_id = post.post_id;
    if (!post_id) return { post: post };
    const accessToken = await getAccessToken(user);
    if (!accessToken) return { post: post };
    let liUrl = `https://api.linkedin.com/v2/socialActions/${post_id}`;
    const response = await fetch(liUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const postStats = await response.json();
    const data = {
      post: JSON.parse(JSON.stringify(post)),
    };
    if (postStats.commentsSummary) {
      data.comments = postStats.commentsSummary.totalFirstLevelComments;
    }
    if (postStats.likesSummary) {
      data.likes = postStats.likesSummary.totalLikes;
    }
    return data;
  } catch {
    return null;
  }
};
