import { NextResponse } from "next/server";

export async function GET(req) {
  const response = NextResponse.redirect(new URL("/auth/login", req.url));

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  return response;
}
