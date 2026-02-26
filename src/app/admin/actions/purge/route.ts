import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { ensurePrayerSchema, prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!(await readSession())) return NextResponse.redirect(new URL("/admin/login", req.url));
  await ensurePrayerSchema();

  const form = await req.formData();
  const days = Number(form.get("days") || process.env.RETENTION_DAYS || 90);
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  await prisma.prayerRequest.updateMany({ where: { createdAt: { lt: cutoff }, deletedAt: null }, data: { deletedAt: new Date() } });

  return NextResponse.redirect(new URL("/admin", req.url));
}
