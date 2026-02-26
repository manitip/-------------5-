import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { ensurePrayerSchema, prisma } from "@/lib/db";
import { catMap, formatDate, statusLabel, urgencyLabel } from "@/lib/admin";

export default async function RequestPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  if (!(await readSession())) redirect("/admin/login");
  await ensurePrayerSchema();

  const { id } = await params;
  const sp = await searchParams;

  const request = await prisma.prayerRequest.findUnique({ where: { id } });
  if (!request || request.deletedAt) notFound();

  const messages = await prisma.prayerMessage.findMany({ where: { prayerRequestId: id }, orderBy: { createdAt: "asc" }, take: 300 });

  return (
    <div className="space-y-4">
      <Link href="/admin" className="text-sm text-cyan-200 hover:text-cyan-100">← К списку</Link>
      <div className="admin-request-layout">
        <section className="admin-request-card space-y-3">
          <h1 className="admin-title text-2xl">Заявка {request.id.slice(0, 8)}</h1>
          <div className="text-sm text-[#a8b7cb]">{formatDate(request.createdAt)}</div>
          <div>Категория: {catMap[request.category] || request.category}</div>
          <div>Срочность: {urgencyLabel[request.urgency] || request.urgency}</div>
          <div>Статус: <span className={`admin-status-chip admin-status-chip-${request.status}`}>{statusLabel[request.status] || request.status}</span></div>
          <div className="admin-request-details">
            <div>👤 {request.name || "Не указано"}</div>
            <div>📧 {request.email || "Не указано"}</div>
            <div>📞 {request.phone || "Не указано"}</div>
            <div>📍 {request.city === "izhevsk" ? "Ижевск" : "Другой"}</div>
            {request.address ? <div>🏠 {request.address}</div> : null}
            <div>🙏 {request.forWhom === "other" ? "За другого" : "За себя"}</div>
            <div>🔐 Тех. ipHash: {request.ipHash || "—"}</div>
          </div>
          <div className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/20 p-3">{request.message}</div>

          <div className="admin-actions-wrap">
            <form action="/admin/actions/status" method="post"><input type="hidden" name="id" value={request.id} /><input type="hidden" name="status" value="new" /><button className="admin-mini-btn">Новый</button></form>
            <form action="/admin/actions/status" method="post"><input type="hidden" name="id" value={request.id} /><input type="hidden" name="status" value="praying" /><button className="admin-mini-btn">В молитве</button></form>
            <form action="/admin/actions/status" method="post"><input type="hidden" name="id" value={request.id} /><input type="hidden" name="status" value="done" /><button className="admin-mini-btn">Завершено</button></form>
            <form action="/admin/actions/delete" method="post"><input type="hidden" name="id" value={request.id} /><button className="admin-mini-btn admin-mini-btn-danger">Удалить</button></form>
          </div>
          {sp?.ok ? <div className="text-emerald-300 text-sm">Письмо отправлено.</div> : null}
          {sp?.error ? <div className="text-red-300 text-sm">{sp.error}</div> : null}
        </section>

        <section id="thread" className="admin-request-card space-y-3">
          <h2 className="text-xl font-semibold">Переписка</h2>
          <div className="space-y-2">
            {messages.length === 0 ? <div className="text-sm text-[#a8b7cb]">Пока нет сообщений.</div> : null}
            {messages.map((m: any) => (
              <article key={m.id} className={`rounded-xl border p-3 ${m.direction === "outgoing" ? "border-cyan-400/30 bg-cyan-950/20" : "border-emerald-400/30 bg-emerald-950/20"}`}>
                <div className="text-xs text-[#a8b7cb]">{formatDate(m.createdAt)} · {m.direction === "outgoing" ? "Админ → Пользователь" : "Пользователь → Админ"}</div>
                <div className="text-sm">{m.subject}</div>
                <div className="whitespace-pre-wrap text-sm mt-1">{m.text}</div>
                <div className="text-xs text-[#a8b7cb] mt-1">Статус: {m.status}{m.error ? ` · ${m.error}` : ""}</div>
              </article>
            ))}
          </div>

          {request.email ? (
            <form action="/admin/actions/send-email" method="post" className="space-y-2">
              <input type="hidden" name="id" value={request.id} />
              <input className="admin-input w-full" name="subject" defaultValue={`Ответ по заявке ${request.id.slice(0, 8)}`} required minLength={3} maxLength={180} />
              <textarea className="admin-input w-full min-h-40" name="text" required minLength={10} maxLength={6000} placeholder="Введите ответ..." />
              <button type="submit" className="ui-btn ui-btn-primary">Отправить</button>
            </form>
          ) : (
            <div className="rounded-xl border border-yellow-400/30 bg-yellow-950/20 p-3 text-sm text-yellow-100">Пользователь не оставил e-mail. Отправка ответа недоступна.</div>
          )}
        </section>
      </div>
    </div>
  );
}
