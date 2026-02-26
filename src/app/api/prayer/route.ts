import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PrayerSchema } from "@/lib/validate";
import { ensurePrayerSchema, prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rateLimit";
import { confirmUser, notifyTeamMinimal } from "@/lib/mail";

function ipFrom(req: NextRequest) {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "0.0.0.0"
  );
}

function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

async function verifyCaptcha(token: string) {
  const turn = process.env.TURNSTILE_SECRET || "";
  const hcap = process.env.HCAPTCHA_SECRET || "";
  if (!turn && !hcap) return true;
  if (!token) return false;

  // Turnstile
  if (turn) {
    const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: turn, response: token }),
    });
    const data = await resp.json().catch(() => ({}));
    return Boolean(data?.success);
  }

  // hCaptcha
  const resp = await fetch("https://hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret: hcap, response: token }),
  });
  const data = await resp.json().catch(() => ({}));
  return Boolean(data?.success);
}

export async function POST(req: NextRequest) {
  await ensurePrayerSchema();
  const ip = ipFrom(req);
  const limit = Number(process.env.RATE_LIMIT_PER_MIN || 3);
  const rl = rateLimit(`prayer:${ip}`, limit);

  if (!rl.ok) {
    return NextResponse.json(
      { error: "Слишком часто. Попробуйте чуть позже." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = PrayerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Проверьте поля формы." }, { status: 400 });
  }

  const data = parsed.data;

  // honeypot: если заполнено — бот
  if (data.hp && data.hp.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // captcha (опционально)
  const capOk = await verifyCaptcha(data.captchaToken || "");
  if (!capOk) {
    return NextResponse.json({ error: "Подтвердите, что вы не робот." }, { status: 400 });
  }

  // анонимность: принудительно чистим контактные поля
  const name = data.anonymous ? null : (data.name?.trim() || null);
  const email = data.anonymous ? null : (data.email?.trim() || null);
  const city = data.city;
  const meetingFormat = city === "izhevsk" ? (data.meetingFormat ?? null) : null;
  const address = city === "izhevsk" && meetingFormat === "home_visit" ? (data.address?.trim() || null) : null;

  const created = await prisma.prayerRequest.create({
    data: {
      category: data.category,
      urgency: data.urgency,
      forWhom: data.forWhom,
      message: data.message.trim(),
      name,
      email,
      phone: data.phone.trim(),
      city,
      meetingFormat,
      address,
      ipHash: sha256(ip),
    },
    select: { id: true, createdAt: true, category: true, urgency: true, email: true },
  });

  // Уведомление команде (минимум деталей в теме)
  try {
    await notifyTeamMinimal({
      id: created.id,
      category: created.category,
      urgency: created.urgency,
      createdAt: created.createdAt.toISOString(),
    });
  } catch {}

  // Подтверждение пользователю (если оставил email)
  if (created.email) {
    try { await confirmUser(created.email); } catch {}
  }

  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}
