"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const saveSchedule = async (formData) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token || !token.value) {
      return { success: false };
    }
    const { payload } = await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET));
    if (!payload.email) {
      return { success: false };
    }
    const postObj = {
      email: payload.email,
      content: formData.get("postContent"),
      scheduleDate: new Date(formData.get("scheduleDate")),
      created_at: new Date(),
    };
    const { db } = await connectToDatabase();
    const response = await db.collection("schedule").insertOne(postObj);
    return {
      success: true,
      acknowledged: response.acknowledged,
      insertedId: response.insertedId.toString(),
    };
  } catch {
    return { success: false };
  }
};
