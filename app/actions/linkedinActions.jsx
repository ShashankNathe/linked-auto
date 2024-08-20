"use server";

import { connectToDatabase } from "@/lib/mongodb";

export const generateAccessToken = async (code, user) => {
  const { db } = await connectToDatabase();
  let response = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
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
  let data = await response.json();
  data.user_id = user._id;
  data.createdAt = new Date();
  await db.collection("user_properties").insertOne(data);
  return data;
};

const getAccessToken = async (user) => {
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
