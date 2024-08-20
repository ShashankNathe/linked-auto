import { verify } from "jsonwebtoken";
import { connectToDatabase } from "./mongodb";

export async function getUser(token) {
  if (!token) return null;

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne({ email: decoded.email, project: "LinkedAuto" }, { projection: { password: 0 } });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
