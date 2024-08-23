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
    const linkedinUrl = `https://api.linkedin.com/rest/posts?author=${encodeURIComponent(user_property.linkedin_urn)}&q=author&count=10&sortBy=LAST_MODIFIED`;

    try {
      const response = await fetch(linkedinUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "LinkedIn-Version": "202408", // Adjust based on API versioning requirements
        },
      });

      //   if (!response.ok) {
      //     // throw new Error(`HTTP error! status: ${response.status}`);
      //     return NextResponse.json({ message: "LinkedIn API error" }, { status: 500 });
      //   }

      const data = await response.json();
      console.log("Posts retrieved:", data);
      return data;
    } catch (error) {
      console.error("Error retrieving posts:", error);
      //   throw error; // Re-throw to handle it elsewhere if needed
      return NextResponse.json({ message: "Error retrieving posts" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error retrieving posts:", error);
    // throw error; // Re-throw to handle it elsewhere if needed
    return NextResponse.json({ message: "Error retrieving posts" }, { status: 500 });
  }
}
