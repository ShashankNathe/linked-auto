"use server";
import { connectToDatabase } from "@/lib/mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function generatePost(formData) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token || !token.value) {
    return { success: false };
  }

  const { payload } = await jwtVerify(token.value, new TextEncoder().encode(process.env.JWT_SECRET));
  if (!payload.email) {
    return { success: false };
  }
  const maxWords = formData.get("maxWords");
  const tone = formData.get("tone");
  const postFormat = formData.get("postFormat");
  const userPrompt = formData.get("prompt");

  const finalPrompt = `Generate a linkedin post of ${maxWords} words in ${tone} tone. The post should be in ${postFormat} format. ${userPrompt}`;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(finalPrompt);
  const response = result.response;
  const text = response.text();
  const postObj = {
    email: payload.email,
    maxWords,
    tone,
    postFormat,
    userPrompt,
    aiResponse: text,
    created_at: new Date(),
  };
  const { db } = await connectToDatabase();
  const dbRes = await db.collection("linkedin_gemini_requests").insertOne(postObj);

  return text;
}
