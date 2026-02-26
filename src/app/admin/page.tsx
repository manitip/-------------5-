import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { ensurePrayerSchema, prisma } from "@/lib/db";
import { catMap, formatDate, statusLabel, urgencyLabel } from "@/lib/admin";

export const metadata = { title: "Админка" };

const PAGE_SIZE = 50;

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sess = await readSession();
  if (!sess) redirect("/admin/login");

  await ensurePrayerSchema();

  const sp = await searchParams;
  const q = String(sp.q || "").trim();
  const status = String(sp.status || "all");
  const from = String(sp.from || "").trim();
  const to = String(sp.to || "").trim();
  const page = Math.max(1, Number(sp.page || 1) || 1);

  const where: any = { deletedAt: null };
  if (["new", "praying", "done"].includes(status)) where.status = status;
  if (q) {
    where.OR = [
      { message: { contains: q } },
      { name: { contains: q } },
      { email: { contains: q } },
      { phone: { contains: q } },
      { address: { contains: q } },
    ];
  }
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(`${from}T00:00:00.000Z`);
    if (to) where.createdAt.lte = new Date(`${to}T23:59:59.999Z`);
  }

  const [items, total, newCount, prayingCount, doneCount] = await Promise.all([
    prisma.prayerRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.prayerRequest.count({ where }),
    prisma.prayerRequest.count({ where: { deletedAt: null, status: "new" } }),
    prisma.prayerRequest.count({ where: { deletedAt: null, status: "praying" } }),
    prisma.prayerRequest.count({ where: { deletedAt: null, status: "done" } }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="admin-html space-y-5">
      <section className="admin-top-card">
        <div>
          <p className="admin-kicker">Панель управления</p>
          <h1 className="admin-title">Заявки на молитву</h1>
          <div className="admin-stats mt-3">
            <span className="admin-stat-item">Новые: <b>{newCount}</b></span>
            <span className="admin-stat-item">В молитве: <b>{prayingCount}</b></span>
            <span className="admin-stat-item">Завершено: <b>{doneCount}</b></span>
          </div>
        </div>
        <div className="admin-actions-wrap">
          <a className="ui-btn ui-btn-ghost" href="/api/admin/export">Экспорт CSV</a>
          <form action="/admin/actions/purge" method="post" className="inline-flex gap-2">
            <input className="admin-input max-w-24" type="number" min={1} name="days" defaultValue={90} />
            <button className="ui-btn ui-btn-ghost" type="submit">Очистить</button>
          </form>
          <form action="/api/admin/logout" method="post"><button className="ui-btn ui-btn-danger">Выйти</button></form>
        </div>
      </section>

      <section className="admin-grid">
        <aside className="admin-sidebar-card">
          <form method="get" className="space-y-3">
            <input className="admin-input w-full" name="q" placeholder="Поиск по тексту, email, телефону" defaultValue={q} />
            <select className="admin-input w-full" name="status" defaultValue={status}>
              <option value="all">Все статусы</option>
              <option value="new">Новые</option>
              <option value="praying">В молитве</option>
              <option value="done">Завершено</option>
            </select>
            <label className="admin-small-label">Дата от</label>
            <input className="admin-input w-full" type="date" name="from" defaultValue={from} />
            <label className="admin-small-label">Дата до</label>
            <input className="admin-input w-full" type="date" name="to" defaultValue={to} />
            <button className="ui-btn ui-btn-primary w-full" type="submit">Применить</button>
          </form>
        </aside>

        <div className="space-y-3">
          {items.map((r: any) => (
            <article key={r.id} className="admin-request-card">
              <div className="admin-request-head">
                <div>
                  <div className="text-sm text-[#9eb0c5]">{formatDate(r.createdAt)}</div>
                  <div className="text-sm">{catMap[r.category] || r.category} · {urgencyLabel[r.urgency] || r.urgency}</div>
                </div>
                <span className={`admin-status-chip admin-status-chip-${r.status}`}>{statusLabel[r.status] || r.status}</span>
              </div>
              <p className="admin-preview">{String(r.message).slice(0, 220)}{String(r.message).length > 220 ? "…" : ""}</p>
              <div className="admin-contact-line">
                {r.email ? <span>📧 {r.email}</span> : <span>📧 —</span>}
                <span>📞 {r.phone || "—"}</span>
              </div>
              <div className="admin-actions-wrap mt-3">
                <Link className="ui-btn ui-btn-ghost" href={`/admin/requests/${r.id}`}>Открыть</Link>
                <form action="/admin/actions/status" method="post"><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value="new" /><button className="admin-mini-btn" type="submit">Новый</button></form>
                <form action="/admin/actions/status" method="post"><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value="praying" /><button className="admin-mini-btn" type="submit">В молитве</button></form>
                <form action="/admin/actions/status" method="post"><input type="hidden" name="id" value={r.id} /><input type="hidden" name="status" value="done" /><button className="admin-mini-btn" type="submit">Завершено</button></form>
                <form action="/admin/actions/delete" method="post"><input type="hidden" name="id" value={r.id} /><button className="admin-mini-btn admin-mini-btn-danger" type="submit">Удалить</button></form>
              </div>
            </article>
          ))}

          <div className="admin-pagination">
            <span>Страница {page} / {pageCount}</span>
            <div className="flex gap-2">
              {page > 1 ? <a className="ui-btn ui-btn-ghost" href={`?q=${encodeURIComponent(q)}&status=${status}&from=${from}&to=${to}&page=${page - 1}`}>Назад</a> : null}
              {page < pageCount ? <a className="ui-btn ui-btn-ghost" href={`?q=${encodeURIComponent(q)}&status=${status}&from=${from}&to=${to}&page=${page + 1}`}>Вперёд</a> : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
