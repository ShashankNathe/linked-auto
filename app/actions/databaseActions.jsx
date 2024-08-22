"use server";
import { connectToDatabase } from "@/lib/mongodb";

export const saveSchedule = async (formData) => {
  // const { db } = await connectToDatabase();
  console.log(formData);
  console.log(formData.get("email"));
  console.log(formData.get("password"));
  // const response = await db.collection("schedule").insertOne(formdata);
  return { success: true };
};
