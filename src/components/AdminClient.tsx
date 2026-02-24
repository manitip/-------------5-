"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Button } from "@/components/Ui";

type Req = {
  id: string;
  createdAt: string;
  category: string;
  urgency: string;
  status: string;
  forWhom: string;
  name?: string | null;
  email?: string | null;
  phone: string;
  city: string;
  meetingFormat?: string | null;
  address?: string | null;
  message: string;
};

const catMap: Record<string, string> = {
  health: "Здоровье",
  family: "Семья",
  work: "Работа",
  anxiety: "Тревога",
  loss: "Утрата",
  addiction: "Зависимости",
  other: "Другое",
};

export default function AdminClient() {
  const [items, setItems] = useState<Req[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "new" | "praying" | "done">("all");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const url = new URL("/api/admin/requests", location.origin);
      if (q) url.searchParams.set("q", q);
      if (status !== "all") url.searchParams.set("status", status);
      const res = await fetch(url.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Ошибка загрузки");
      setItems(data.items || []);
    } catch (e: any) {
      setErr(e?.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const counters = useMemo(() => {
    const c = { new: 0, praying: 0, done: 0 };
    for (const i of items) (c as any)[i.status] = ((c as any)[i.status] || 0) + 1;
    return c;
  }, [items]);

  async function updateStatus(id: string, next: string) {
    await fetch("/api/admin/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Удалить запрос?")) return;
    await fetch("/api/admin/requests", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  async function purge() {
    const days = prompt("Удалить старше (дней):", "90");
    if (!days) return;
    await fetch("/api/admin/purge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days: Number(days) }),
    });
    await load();
  }

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">Панель управления</p>
            <h1 className="mt-1 text-2xl font-semibold md:text-3xl">Админка</h1>
            <div className="mt-2 text-sm text-[#A7B3C2]">
              Новые: {counters.new} · В молитве: {counters.praying} · Завершено: {counters.done}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button href="/api/admin/export" variant="ghost">
              Экспорт CSV
            </Button>
            <Button onClick={purge} variant="ghost">
              Очистка по сроку
            </Button>
            <form action="/api/admin/logout" method="post">
              <button className="rounded-xl bg-white/0 px-4 py-2 text-sm ring-1 ring-white/10 transition hover:bg-white/5">
                Выйти
              </button>
            </form>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск по тексту/имени/email/телефону"
            className="rounded-xl border border-white/10 bg-[#0E1724] p-3 text-sm"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="rounded-xl border border-white/10 bg-[#0E1724] p-3 text-sm"
          >
            <option value="all">Все статусы</option>
            <option value="new">Новый</option>
            <option value="praying">В молитве</option>
            <option value="done">Завершено</option>
          </select>
          <Button onClick={load}>Применить</Button>
        </div>

        {err && (
          <div className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200 ring-1 ring-red-400/20">{err}</div>
        )}
        {loading && <div className="mt-4 text-sm text-[#A7B3C2]">Загрузка...</div>}

        <div className="mt-5 grid gap-4">
          {!loading && items.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[.02] p-4 text-sm text-[#A7B3C2]">
              Пока нет запросов по выбранным фильтрам.
            </div>
          )}

          {items.map((r) => (
            <Card key={r.id} className="border border-white/10 bg-gradient-to-b from-[#152033] to-[#0F1728] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-[#A7B3C2]">
                  <span className="font-medium text-[#E6EEF7]">{new Date(r.createdAt).toLocaleString("ru-RU")}</span>
                  {" · "}Категория: {catMap[r.category] || r.category}
                  {" · "}Срочность: {r.urgency === "urgent" ? "Срочно" : "Обычно"}
                  {" · "}Статус: <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-cyan-100">{r.status}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateStatus(r.id, "new")}
                    className="rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 transition hover:bg-white/5"
                  >
                    Новый
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "praying")}
                    className="rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 transition hover:bg-white/5"
                  >
                    В молитве
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "done")}
                    className="rounded-xl px-3 py-2 text-xs ring-1 ring-white/10 transition hover:bg-white/5"
                  >
                    Завершено
                  </button>
                  <button
                    onClick={() => remove(r.id)}
                    className="rounded-xl px-3 py-2 text-xs text-red-200 ring-1 ring-red-400/20 transition hover:bg-red-500/10"
                  >
                    Удалить
                  </button>
                </div>
              </div>

              <div className="mt-3 whitespace-pre-wrap rounded-xl border border-white/5 bg-black/10 p-3 text-sm leading-relaxed text-[#E6EEF7]">
                {r.message}
              </div>

              <div className="mt-3 text-xs text-[#A7B3C2]">
                {r.email ? (
                  <>
                    Email: <span className="text-[#E6EEF7]">{r.email}</span> ·{" "}
                  </>
                ) : null}
                {r.name ? (
                  <>
                    Имя: <span className="text-[#E6EEF7]">{r.name}</span> ·{" "}
                  </>
                ) : null}
                Телефон: <span className="text-[#E6EEF7]">{r.phone}</span> · Город:{" "}
                <span className="text-[#E6EEF7]">{r.city === "izhevsk" ? "г. Ижевск" : "Другой"}</span>
                {r.city === "izhevsk" && r.meetingFormat ? (
                  <>
                    {" "}· Формат:{" "}
                    <span className="text-[#E6EEF7]">
                      {r.meetingFormat === "home_visit"
                        ? "Нужно прийти"
                        : r.meetingFormat === "self_visit"
                          ? "Самостоятельно"
                          : "Онлайн"}
                    </span>
                  </>
                ) : null}
                {r.address ? (
                  <>
                    {" "}· Адрес: <span className="text-[#E6EEF7]">{r.address}</span>
                  </>
                ) : null}
                {" "}· {r.forWhom === "other" ? "За другого" : "За себя"}
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
