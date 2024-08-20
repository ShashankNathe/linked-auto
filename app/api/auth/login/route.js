import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { connectToDatabase } from "../../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  const user = await db.collection("users").findOne({ email: email, project: "LinkedAuto" });

  if (!user || !(await compare(password, user.password))) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }

  const token = sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
  response.cookies.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 7 * 30, path: "/" });

  return response;
}
