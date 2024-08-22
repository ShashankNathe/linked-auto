import { getAccessToken } from "@/app/actions/linkedinActions";
import { connectToDatabase } from "@/lib/mongodb";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = req.cookies.get("token");
    if (!token || !token.value) {
      return NextResponse.json({ message: "Missing token" }, { status: 400 });
    }
    const { payload } = await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET));
    if (!payload.email) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email: payload.email, project: "LinkedAuto" }, { projection: { password: 0 } });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const user_property = await db.collection("user_properties").findOne({ user_id: user._id });
    if (!user_property) {
      return NextResponse.json({ message: "User property not found" }, { status: 404 });
    }

    const accessToken = await getAccessToken(user);
    if (!accessToken) {
      return NextResponse.json({ message: "Access token not found" }, { status: 404 });
    }
    const response = await db
      .collection("schedule")
      .find({ email: payload.email, scheduleDate: { $lte: new Date() }, status: { $nin: ["published", "paused", "failed"] } })
      .toArray();
    const linkedinUrl = "https://api.linkedin.com/v2/posts";
    let liRes = [];

    if (response && response.length > 0) {
      liRes = await Promise.all(
        response.map(async (element) => {
          try {
            const res = await fetch(linkedinUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Restli-Protocol-Version": "2.0.0",
                "LinkedIn-Version": "202408",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                author: user_property.linkedin_urn,
                commentary: element.content,
                visibility: "PUBLIC",
                distribution: {
                  feedDistribution: "MAIN_FEED",
                  targetEntities: [],
                  thirdPartyDistributionChannels: [],
                },
                lifecycleState: "PUBLISHED",
                isReshareDisabledByAuthor: false,
              }),
            });
            if (res.status === 201) {
              const postId = res.headers.get("x-restli-id");
              await db.collection("schedule").updateOne({ _id: element._id }, { $set: { status: "published", post_id: postId, published_at: new Date() } });
              return { message: "Post created successfully", postId: postId };
            } else {
              const text = await res.text();
              await db.collection("schedule").updateOne({ _id: element._id }, { $set: { status: "failed", error: text, published_at: new Date() } });
              return { message: text || "Unexpected response", status: res.status };
            }
          } catch (error) {
            await db.collection("schedule").updateOne({ _id: element._id }, { $set: { status: "failed", error: error.message, published_at: new Date() } });
            return { error: error.message };
          }
        })
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: response,
        linkedinResponse: liRes,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
