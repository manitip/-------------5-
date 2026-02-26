import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { ensurePrayerSchema, prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!(await readSession())) return NextResponse.redirect(new URL("/admin/login", req.url));
  await ensurePrayerSchema();

  const form = await req.formData();
  const id = String(form.get("id") || "");
  const status = String(form.get("status") || "");
  if (!id || !["new", "praying", "done"].includes(status)) return NextResponse.redirect(new URL("/admin", req.url));

  await prisma.prayerRequest.update({ where: { id }, data: { status } });
  const back = req.headers.get("referer") || "/admin";
  return NextResponse.redirect(new URL(back, req.url));
}
