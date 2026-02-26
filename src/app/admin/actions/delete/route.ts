import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { ensurePrayerSchema, prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!(await readSession())) return NextResponse.redirect(new URL("/admin/login", req.url));
  await ensurePrayerSchema();

  const form = await req.formData();
  const id = String(form.get("id") || "");
  if (id) await prisma.prayerRequest.update({ where: { id }, data: { deletedAt: new Date() } });

  return NextResponse.redirect(new URL("/admin", req.url));
}
