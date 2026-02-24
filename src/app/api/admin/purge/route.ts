import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!readSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const days = Number(body?.days || process.env.RETENTION_DAYS || 90);
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const res = await prisma.prayerRequest.updateMany({
    where: { createdAt: { lt: cutoff }, deletedAt: null },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json({ ok: true, purged: res.count, days });
}
