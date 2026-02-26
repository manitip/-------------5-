import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { ensurePrayerSchema, prisma } from "@/lib/db";
import { sendManualReply } from "@/lib/mail";

export async function POST(req: NextRequest) {
  if (!(await readSession())) return NextResponse.redirect(new URL("/admin/login", req.url));
  await ensurePrayerSchema();

  const form = await req.formData();
  const id = String(form.get("id") || "");
  const subject = String(form.get("subject") || "").trim();
  const text = String(form.get("text") || "").trim();

  if (!id || subject.length < 3 || subject.length > 180 || text.length < 10 || text.length > 6000) {
    return NextResponse.redirect(new URL(`/admin/requests/${id}?error=Некорректные+данные`, req.url));
  }

  const request = await prisma.prayerRequest.findUnique({ where: { id } });
  if (!request?.email) {
    return NextResponse.redirect(new URL(`/admin/requests/${id}?error=Email+не+указан`, req.url));
  }

  const result = await sendManualReply({ prayerRequestId: id, toEmail: request.email, subject, text });

  if (!result.ok) {
    return NextResponse.redirect(new URL(`/admin/requests/${id}?error=${encodeURIComponent(result.error || "Ошибка отправки")}`, req.url));
  }

  return NextResponse.redirect(new URL(`/admin/requests/${id}?ok=1`, req.url));
}
