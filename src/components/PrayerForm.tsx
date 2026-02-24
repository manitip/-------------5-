"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Ui";

type Status = "idle" | "sending" | "sent" | "error";

const categories = [
  { v: "health", label: "Здоровье" },
  { v: "family", label: "Семья" },
  { v: "work", label: "Работа" },
  { v: "anxiety", label: "Тревога" },
  { v: "loss", label: "Утрата" },
  { v: "addiction", label: "Зависимости" },
  { v: "other", label: "Другое" },
] as const;

export default function PrayerForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<string>("");

  const [category, setCategory] = useState<(typeof categories)[number]["v"]>("health");
  const [urgency, setUrgency] = useState<"usual" | "urgent">("usual");
  const [forWhom, setForWhom] = useState<"self" | "other">("self");
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);

  // honeypot
  const [hp, setHp] = useState<string>("");

  const count = message.length;
  const okLen = count >= 300 && count <= 1500;

  const disabled = useMemo(() => {
    if (status === "sending") return true;
    if (!consent) return true;
    if (!okLen) return true;
    return false;
  }, [status, consent, okLen]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setStatus("sending");

    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          urgency,
          forWhom,
          message,
          name,
          email,
          anonymous,
          consent,
          hp,
          captchaToken: "", // сюда подставляется токен Turnstile/hCaptcha при подключении виджета
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Не удалось отправить. Попробуйте ещё раз.");

      setStatus("sent");
    } catch (e: any) {
      setStatus("error");
      setErr(e?.message || "Ошибка отправки");
    }
  }

  if (status === "sent") {
    return (
      <div className="space-y-4">
        <div className="text-lg font-semibold">Запрос отправлен</div>
        <p className="text-sm leading-relaxed text-[#A7B3C2]">
          Спасибо, что написали. Мы получили ваш запрос и будем молиться.
          Если вы оставили email — можно получить подтверждение.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => location.reload()}>Отправить ещё один запрос</Button>
          <Button href="/" variant="ghost">На главную</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="text-[#A7B3C2]">Тема / категория</span>
          <select
            className="rounded-xl bg-white/0 p-3 ring-1 ring-white/10 focus:ring-2 focus:ring-[#22D3EE]/60"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            aria-label="Категория"
          >
            {categories.map((c) => (
              <option key={c.v} value={c.v}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-[#A7B3C2]">Срочность</span>
          <select
            className="rounded-xl bg-white/0 p-3 ring-1 ring-white/10 focus:ring-2 focus:ring-[#22D3EE]/60"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as any)}
            aria-label="Срочность"
          >
            <option value="usual">Обычно</option>
            <option value="urgent">Срочно</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="text-[#A7B3C2]">За себя или за другого</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForWhom("self")}
              className={`flex-1 rounded-xl p-3 text-sm ring-1 ${
                forWhom === "self" ? "bg-white/10 ring-white/20" : "bg-white/0 ring-white/10 hover:bg-white/5"
              }`}
            >
              За себя
            </button>
            <button
              type="button"
              onClick={() => setForWhom("other")}
              className={`flex-1 rounded-xl p-3 text-sm ring-1 ${
                forWhom === "other" ? "bg-white/10 ring-white/20" : "bg-white/0 ring-white/10 hover:bg-white/5"
              }`}
            >
              За другого
            </button>
          </div>
        </label>

        <label className="flex items-center gap-3 rounded-xl bg-white/0 p-3 ring-1 ring-white/10">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="h-4 w-4 accent-[#22D3EE]"
          />
          <span className="text-sm text-[#A7B3C2]">Анонимно (скрыть имя и контакт)</span>
        </label>
      </div>

      {!anonymous && (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="text-[#A7B3C2]">Имя (необязательно)</span>
            <input
              className="rounded-xl bg-white/0 p-3 ring-1 ring-white/10 focus:ring-2 focus:ring-[#22D3EE]/60"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Анна"
              aria-label="Имя"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[#A7B3C2]">Email для подтверждения (необязательно)</span>
            <input
              className="rounded-xl bg-white/0 p-3 ring-1 ring-white/10 focus:ring-2 focus:ring-[#22D3EE]/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email"
            />
          </label>
        </div>
      )}

      <label className="grid gap-2 text-sm">
        <span className="flex items-center justify-between gap-3">
          <span className="text-[#A7B3C2]">Текст ситуации (обязательно)</span>
          <span className={`text-xs ${okLen ? "text-[#A7B3C2]" : "text-red-300"}`}>
            {count}/1500 (мин. 300)
          </span>
        </span>
        <textarea
          className="min-h-[170px] rounded-2xl bg-white/0 p-4 text-sm leading-relaxed ring-1 ring-white/10 focus:ring-2 focus:ring-[#22D3EE]/60"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Можно кратко. Напишите так, как получается."
          aria-label="Текст ситуации"
        />
      </label>

      {/* honeypot: скрыто */}
      <div className="hidden">
        <label>
          Не заполняйте это поле:
          <input value={hp} onChange={(e) => setHp(e.target.value)} />
        </label>
      </div>

      <label className="flex items-start gap-3 rounded-xl bg-white/0 p-3 ring-1 ring-white/10">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[#19C37D]"
          aria-label="Согласие с политикой"
        />
        <span className="text-sm text-[#A7B3C2]">
          Я согласен(на) с{" "}
          <a className="text-[#E6EEF7] underline decoration-white/30 hover:decoration-white" href="/privacy">
            политикой конфиденциальности
          </a>
          .
        </span>
      </label>

      {status === "error" && (
        <div className="rounded-xl bg-red-500/10 p-3 text-sm text-red-200 ring-1 ring-red-400/20">{err}</div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={disabled}>
          {status === "sending" ? "Отправка..." : "Отправить"}
        </Button>
        <div className="text-xs text-[#A7B3C2]">Не обещаем результата, но обещаем бережное отношение.</div>
      </div>
    </form>
  );
}
