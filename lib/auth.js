import { verify } from "jsonwebtoken";

export function auth(req) {
  const token = req.cookies.get("token");

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Unauthorized");
  }
}
