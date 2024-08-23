import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generatePost(input) {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const response = await model.generateText(input);
  return response;
}
