import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/auth";

function guard() {
  const s = readSession();
  return Boolean(s);
}

export async function GET(req: NextRequest) {
  if (!guard()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = (searchParams.get("q") || "").trim();

  const where: any = { deletedAt: null };
  if (status) where.status = status;

  if (q) {
    where.OR = [
      { message: { contains: q } },
      { name: { contains: q } },
      { email: { contains: q } },
      { phone: { contains: q } },
      { address: { contains: q } },
    ];
  }

  const items = await prisma.prayerRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      createdAt: true,
      category: true,
      urgency: true,
      status: true,
      forWhom: true,
      name: true,
      email: true,
      phone: true,
      city: true,
      meetingFormat: true,
      address: true,
      message: true,
    },
  });

  return NextResponse.json({ items });
}

export async function PATCH(req: NextRequest) {
  if (!guard()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const id = body?.id as string;
  const status = body?.status as string;

  if (!id || !["new", "praying", "done"].includes(status)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  await prisma.prayerRequest.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!guard()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const id = body?.id as string;
  if (!id) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  await prisma.prayerRequest.update({ where: { id }, data: { deletedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
