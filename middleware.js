import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = req.cookies.get("token");
  const path = req.nextUrl.pathname;
  if (!token && path !== "/auth/login" && path !== "/auth/register" && path !== "/") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  if (token && (path === "/auth/login" || path === "/auth/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (token || path === "/") {
    return NextResponse.next();
  }

  // return NextResponse.redirect(new URL("/auth/login", req.url));
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/schedule/:path*", "/auth/:path*"],
};
