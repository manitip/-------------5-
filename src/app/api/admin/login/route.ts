import { NextResponse } from "next/server";
import { verifyAdmin, signSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");

  const ok = await verifyAdmin(email, password);
  if (!ok) return NextResponse.redirect(new URL("/admin/login", req.url), { status: 303 });

  const token = signSession({ email });
  await setSessionCookie(token);

  return NextResponse.redirect(new URL("/admin", req.url), { status: 303 });
}
