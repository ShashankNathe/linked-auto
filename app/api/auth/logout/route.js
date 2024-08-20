import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  cookieStore.set("token", "", { path: "/", maxAge: 0 }); // Properly setting cookie to delete it

  const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
  response.cookies.set("token", "", { path: "/", maxAge: 0 }); // Ensuring it's set on the response as well

  return response;
}
