import nodemailer from "nodemailer";

function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function mailer() {
  return nodemailer.createTransport({
    host: env("SMTP_HOST"),
    port: Number(env("SMTP_PORT") || 587),
    secure: false,
    auth: { user: env("SMTP_USER"), pass: env("SMTP_PASS") },
  });
}

export async function notifyTeamMinimal(data: { id: string; category: string; urgency: string; createdAt: string }) {
  const to = env("TEAM_NOTIFY_EMAIL");
  const from = env("MAIL_FROM");
  const t = mailer();

  await t.sendMail({
    from,
    to,
    subject: "Новый запрос (есть в админке)",
    text:
      `Поступил новый запрос.\n` +
      `ID: ${data.id}\nКатегория: ${data.category}\nСрочность: ${data.urgency}\nДата: ${data.createdAt}\n\n` +
      `Откройте админку, чтобы посмотреть детали.`,
  });
}

export async function confirmUser(email: string) {
  const from = env("MAIL_FROM");
  const t = mailer();
  await t.sendMail({
    from,
    to: email,
    subject: "Запрос получен",
    text:
      "Мы получили ваш запрос. Спасибо, что написали.\n" +
      "Если вы оставили контакт — он используется только для подтверждения и возможного ответа.\n" +
      "Берегите себя.",
  });
}
