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
  const [phone, setPhone] = useState<string>("");
  const [city, setCity] = useState<string>("izhevsk");
  const [meetingFormat, setMeetingFormat] = useState<"home_visit" | "self_visit" | "online">("home_visit");
  const [address, setAddress] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);

  // honeypot
  const [hp, setHp] = useState<string>("");

  const count = message.length;
  const okLen = count >= 300 && count <= 1500;
  const phoneOk = phone.trim().length >= 6;
  const addressNeeded = city === "izhevsk" && meetingFormat === "home_visit";
  const addressOk = !addressNeeded || address.trim().length >= 10;

  const disabled = useMemo(() => {
    if (status === "sending") return true;
    if (!consent) return true;
    if (!okLen) return true;
    if (!phoneOk) return true;
    if (!addressOk) return true;
    return false;
  }, [status, consent, okLen, phoneOk, addressOk]);

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
          phone,
          city,
          meetingFormat: city === "izhevsk" ? meetingFormat : null,
          address: addressNeeded ? address : "",
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
      <div className="prayer-success">
        <div className="prayer-success-title">Запрос отправлен</div>
        <p className="prayer-success-text">
          Спасибо, что написали. Мы получили ваш запрос и будем молиться.
          Если вы оставили email — можно получить подтверждение.
        </p>
        <div className="prayer-success-actions">
          <Button onClick={() => location.reload()}>Отправить ещё один запрос</Button>
          <Button href="/" variant="ghost">На главную</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="prayer-form">
      <div className="prayer-grid-two">
        <label className="prayer-field">
          <span className="prayer-label">Тема / категория</span>
          <select
            className="prayer-input"
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

        <label className="prayer-field">
          <span className="prayer-label">Срочность</span>
          <select
            className="prayer-input"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as any)}
            aria-label="Срочность"
          >
            <option value="usual">Обычно</option>
            <option value="urgent">Срочно</option>
          </select>
        </label>
      </div>

      <div className="prayer-grid-two">
        <label className="prayer-field">
          <span className="prayer-label">За себя или за другого</span>
          <div className="prayer-switch-row">
            <button
              type="button"
              onClick={() => setForWhom("self")}
              className={`prayer-choice-btn ${
                forWhom === "self" ? "prayer-choice-btn-active" : ""
              }`}
            >
              За себя
            </button>
            <button
              type="button"
              onClick={() => setForWhom("other")}
              className={`prayer-choice-btn ${
                forWhom === "other" ? "prayer-choice-btn-active" : ""
              }`}
            >
              За другого
            </button>
          </div>
        </label>

        <label className="prayer-check-row prayer-check-soft">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="prayer-checkbox"
          />
          <span className="prayer-label">Анонимно (скрыть имя и email)</span>
        </label>
      </div>

      {!anonymous && (
        <div className="prayer-grid-two">
          <label className="prayer-field">
            <span className="prayer-label">Имя (необязательно)</span>
            <input
              className="prayer-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Анна"
              aria-label="Имя"
            />
          </label>

          <label className="prayer-field">
            <span className="prayer-label">Email для подтверждения (необязательно)</span>
            <input
              type="email"
              className="prayer-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              aria-label="Email"
            />
          </label>
        </div>
      )}

      <div className="prayer-grid-two">
        <label className="prayer-field">
          <span className="prayer-label">Телефон (обязательно)</span>
          <input
            className="prayer-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (___) ___-__-__"
            aria-label="Телефон"
            required
          />
        </label>

        <label className="prayer-field">
          <span className="prayer-label">Место проживания</span>
          <select
            className="prayer-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="Место проживания"
          >
            <option value="izhevsk">г. Ижевск</option>
            <option value="other">Другой город</option>
          </select>
        </label>
      </div>

      {city === "izhevsk" && (
        <div className="prayer-grid-two">
          <label className="prayer-field">
            <span className="prayer-label">Как вам удобно</span>
            <select
              className="prayer-input"
              value={meetingFormat}
              onChange={(e) => setMeetingFormat(e.target.value as "home_visit" | "self_visit" | "online")}
              aria-label="Вариант молитвы"
            >
              <option value="home_visit">Нужно прийти ко мне</option>
              <option value="self_visit">Я приду на молитву сам(а)</option>
              <option value="online">Онлайн без личного контакта</option>
            </select>
          </label>

          {meetingFormat === "home_visit" ? (
            <label className="prayer-field">
              <span className="prayer-label">Полный адрес (обязательно)</span>
              <input
                className="prayer-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Город, улица, дом, квартира, подъезд"
                aria-label="Полный адрес"
                required
              />
            </label>
          ) : (
            <div />
          )}
        </div>
      )}

      <label className="prayer-field">
        <span className="prayer-message-label-row">
          <span className="prayer-label">Текст ситуации (обязательно)</span>
          <span className={`prayer-counter ${okLen ? "" : "prayer-counter-invalid"}`}>
            {count}/1500 (мин. 300)
          </span>
        </span>
        <textarea
          className="prayer-input prayer-textarea"
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

      <label className="prayer-check-row prayer-check-soft">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="prayer-checkbox prayer-checkbox-consent"
          aria-label="Согласие с политикой"
        />
        <span className="prayer-label">
          Я согласен(на) с{" "}
          <a className="prayer-link" href="/privacy">
            политикой конфиденциальности
          </a>
          .
        </span>
      </label>

      {status === "error" && (
        <div className="prayer-error">{err}</div>
      )}

      <div className="prayer-actions">
        <Button type="submit" disabled={disabled}>
          {status === "sending" ? "Отправка..." : "Отправить"}
        </Button>
        <div className="prayer-note">Не обещаем результата, но обещаем бережное отношение.</div>
      </div>
    </form>
  );
}
