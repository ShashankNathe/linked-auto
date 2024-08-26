"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";

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

    const localDateTimeString = formData.get("scheduleDate"); // e.g., "2024-08-26T15:56"
    const localDate = new Date(localDateTimeString);
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

    const postObj = {
      email: payload.email,
      content: formData.get("postContent"),
      status: "scheduled",
      scheduleDate: utcDate,
      created_at: new Date(),
    };
    let type = formData.get("type");
    if (type) {
      postObj["type"] = type;
    }
    const { db } = await connectToDatabase();
    const response = await db.collection("schedule").insertOne(postObj);
    revalidatePath("/dashboard");
    return {
      success: true,
      acknowledged: response.acknowledged,
      insertedId: response.insertedId.toString(),
    };
  } catch {
    return { success: false };
  }
};

// get csheduled posts

export const getScheduledPosts = async () => {
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
    const { db } = await connectToDatabase();
    const response = await db.collection("schedule").find({ email: payload.email }).toArray();

    return {
      success: true,
      data: response,
    };
  } catch {
    return { success: false };
  }
};

export const deletePost = async (id) => {
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
    const { db } = await connectToDatabase();
    await db.collection("schedule").deleteOne({ _id: ObjectId.createFromHexString(id) });
    revalidatePath("/dashboard");
    return {
      success: true,
    };
  } catch {
    return { success: false };
  }
};

// update function

export const updatePost = async (id, formData) => {
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
    const localDateTimeString = formData.get("scheduleDate"); // e.g., "2024-08-26T15:56"
    const localDate = new Date(localDateTimeString);
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);

    const postObj = {
      content: formData.get("postContent"),
      scheduleDate: utcDate,
      status: formData.get("status"),
    };
    const { db } = await connectToDatabase();
    const response = await db.collection("schedule").updateOne({ _id: ObjectId.createFromHexString(id) }, { $set: postObj });
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/post/${id}`);
    return {
      success: true,
      acknowledged: response.acknowledged,
      modifiedCount: response.modifiedCount,
    };
  } catch {
    return { success: false };
  }
};
