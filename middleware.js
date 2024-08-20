import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
  const token = req.cookies.get("token");
  const path = req.nextUrl.pathname;

  // Check if the token exists and is a string
  if (typeof token === "string" && token.trim() !== "") {
    try {
      // Verify the token using your secret key
      jwt.verify(token, process.env.JWT_SECRET);

      // Redirect authenticated users away from auth pages
      if (path === "/auth/login" || path === "/auth/register") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (err) {
      // Token is invalid or expired
      console.log("Token expired or invalid:", err.message);

      // Clear the invalid or expired token and redirect to login
      const response = NextResponse.redirect(new URL("/auth/login", req.url));
      response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0, // Expire the cookie immediately
        path: "/",
      });
      return response;
    }
  } else if (!token && path !== "/auth/login" && path !== "/auth/register" && path !== "/") {
    // Redirect to login if the user is not authenticated and is trying to access a protected page
    console.log("Redirecting to login");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/schedule/:path*", "/auth/:path*"],
};
