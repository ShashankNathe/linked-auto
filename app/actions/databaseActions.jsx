"use server";
import { connectToDatabase } from "@/lib/mongodb";

const saveSchedule = async (formdata) => {
  const { db } = await connectToDatabase();
  const response = await db.collection("schedule").insertOne(formdata);
  return response;
};
