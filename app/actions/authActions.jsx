"use server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function logout() {
  const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
  // response.cookies.set("token", "", { path: "/", maxAge: 0 });
  // cookies().delete("token");
  return response;
}
