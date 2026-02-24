import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

export function signSession(payload: { email: string }) {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function readSession() {
  const secret = process.env.JWT_SECRET!;
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, secret) as { email: string; iat: number; exp: number };
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

export async function verifyAdmin(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const hash = process.env.ADMIN_PASSWORD_HASH || "";
  if (!adminEmail || !hash) return false;
  if (email !== adminEmail) return false;
  return bcrypt.compare(password, hash);
}
