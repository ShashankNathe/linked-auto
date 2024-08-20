import { hash } from "bcryptjs";
import { connectToDatabase } from "../../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  const existingUser = await db.collection("users").findOne({ email: email, project: "LinkedAuto" });

  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10);

  await db.collection("users").insertOne({
    email,
    password: hashedPassword,
    project: "LinkedAuto",
  });

  return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
}
