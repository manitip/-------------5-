import crypto from "crypto";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";

function env(name: string, fallback = "") {
  return process.env[name] || fallback;
}

function required(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function mailer() {
  return nodemailer.createTransport({
    host: required("SMTP_HOST"),
    port: Number(required("SMTP_PORT") || 587),
    secure: false,
    auth: { user: required("SMTP_USER"), pass: required("SMTP_PASS") },
  });
}

function requestLink(id: string) {
  const appUrl = env("APP_URL", "http://localhost:3000").replace(/\/$/, "");
  return `${appUrl}/admin/requests/${id}`;
}

export async function notifyTeamMinimal(data: { id: string; category: string; urgency: string; createdAt: string; preview?: string }) {
  const to = required("TEAM_NOTIFY_EMAIL");
  const from = required("MAIL_FROM");
  const includePreview = env("ADMIN_EMAIL_INCLUDE_PREVIEW", "0") === "1";
  const t = mailer();

  const subject = `Новая заявка на молитву: ${data.category} / ${data.urgency}`;
  const text = [
    "Поступила новая заявка.",
    `ID: ${data.id}`,
    `Категория: ${data.category}`,
    `Срочность: ${data.urgency}`,
    `Дата: ${data.createdAt}`,
    `Открыть: ${requestLink(data.id)}`,
    includePreview && data.preview ? `Превью: ${data.preview}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.55;color:#e5edf7;background:#0b1320;padding:18px;border-radius:12px;">
      <h2 style="margin-top:0">Новая заявка на молитву</h2>
      <p><b>ID:</b> ${data.id}</p>
      <p><b>Категория:</b> ${data.category}<br/><b>Срочность:</b> ${data.urgency}</p>
      <p><a href="${requestLink(data.id)}">Открыть в админке</a></p>
    </div>
  `;

  await t.sendMail({ from, to, subject, text, html });
}

export async function confirmUser(input: { email: string; requestId: string }) {
  const from = required("MAIL_FROM");
  const t = mailer();
  const subject = "Мы получили ваш запрос о молитве";
  const text =
    `Здравствуйте.\n\n` +
    `Мы получили ваш запрос о молитве. Спасибо за доверие.\n` +
    `ID заявки: ${input.requestId.slice(0, 8)}\n\n` +
    `Если вы оставили контакт — он используется только для ответа и поддержки.\n` +
    `Мира вам.`;

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.55;color:#e5edf7;background:#0b1320;padding:18px;border-radius:12px;">
      <h2 style="margin-top:0">Мы получили ваш запрос о молитве</h2>
      <p>Спасибо за доверие. Мы внимательно относимся к каждому обращению.</p>
      <p><b>ID заявки:</b> ${input.requestId.slice(0, 8)}</p>
      <p style="opacity:.9">Ваши контакты используются только для ответа и поддержки.</p>
    </div>
  `;

  await t.sendMail({ from, to: input.email, subject, text, html });
}

async function getOrCreateAlias(prayerRequestId: string) {
  const current = await prisma.prayerReplyAlias.findFirst({ where: { prayerRequestId, isActive: true } });
  if (current) return current;

  return prisma.prayerReplyAlias.create({
    data: {
      prayerRequestId,
      token: crypto.randomBytes(24).toString("hex"),
      isActive: true,
    },
  });
}

function messageId(prayerRequestId: string) {
  const host = env("INBOUND_ALLOWED_DOMAIN") || env("MAIL_REPLY_DOMAIN") || "localhost";
  return `<prayer-${prayerRequestId}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}@${host}>`;
}

export async function sendManualReply(input: { prayerRequestId: string; toEmail: string; subject: string; text: string }) {
  const from = required("MAIL_FROM");
  const t = mailer();

  const alias = await getOrCreateAlias(input.prayerRequestId);
  const replyDomain = env("MAIL_REPLY_DOMAIN") || env("INBOUND_ALLOWED_DOMAIN");
  const replyTo = replyDomain ? `reply+${input.prayerRequestId}.${alias.token}@${replyDomain}` : undefined;

  const previous = await prisma.prayerMessage.findMany({
    where: { prayerRequestId: input.prayerRequestId },
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  const currentMessageId = messageId(input.prayerRequestId);
  const inReplyTo = previous[0]?.providerMessageId || previous[0]?.inReplyTo || null;
  const refs = [previous[0]?.references, inReplyTo].filter(Boolean).join(" ") || null;

  try {
    await t.sendMail({
      from,
      to: input.toEmail,
      subject: input.subject,
      text: input.text,
      html: `<div style="font-family:Inter,Arial,sans-serif;line-height:1.6;white-space:pre-wrap">${input.text.replace(/</g, "&lt;")}</div>`,
      replyTo,
      messageId: currentMessageId,
      inReplyTo: inReplyTo || undefined,
      references: refs || undefined,
    });

    await prisma.prayerRequest.update({ where: { id: input.prayerRequestId }, data: { status: "praying" } });
    await prisma.prayerMessage.create({
      data: {
        prayerRequestId: input.prayerRequestId,
        direction: "outgoing",
        fromEmail: from,
        toEmail: input.toEmail,
        subject: input.subject,
        text: input.text,
        status: "sent",
        inReplyTo,
        references: refs,
        providerMessageId: currentMessageId,
      },
    });
    return { ok: true };
  } catch (error: any) {
    await prisma.prayerMessage.create({
      data: {
        prayerRequestId: input.prayerRequestId,
        direction: "outgoing",
        fromEmail: from,
        toEmail: input.toEmail,
        subject: input.subject,
        text: input.text,
        status: "failed",
        inReplyTo,
        references: refs,
        providerMessageId: currentMessageId,
        error: String(error?.message || "send failed").slice(0, 500),
      },
    });
    return { ok: false, error: "Письмо не отправлено" };
  }
}
