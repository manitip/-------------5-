import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/auth";

function csvEscape(v: any) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

export async function GET() {
  if (!(await readSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await prisma.prayerRequest.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 2000,
    select: { id:true, createdAt:true, category:true, urgency:true, status:true, forWhom:true, name:true, email:true, phone:true, city:true, meetingFormat:true, address:true, message:true },
  });

  const header = ["id","createdAt","category","urgency","status","forWhom","name","email","phone","city","meetingFormat","address","message"];
  const lines = [header.join(",")];

  for (const r of rows) {
    lines.push([
      r.id,
      r.createdAt.toISOString(),
      r.category,
      r.urgency,
      r.status,
      r.forWhom,
      r.name ?? "",
      r.email ?? "",
      r.phone ?? "",
      r.city ?? "",
      r.meetingFormat ?? "",
      r.address ?? "",
      r.message ?? "",
    ].map(csvEscape).join(","));
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="requests.csv"`,
    },
  });
}
