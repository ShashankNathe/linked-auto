import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      if (path === "/auth/login" || path === "/auth/register") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (err) {
      const response = NextResponse.redirect(new URL("/auth/login", req.url));
      response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
      });
      return response;
    }
  } else if (!token && path !== "/auth/login" && path !== "/auth/register" && path !== "/") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/schedule/:path*", "/auth/:path*"],
};
