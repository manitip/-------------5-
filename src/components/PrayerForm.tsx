"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/Ui";

type Status = "idle" | "sending" | "sent" | "error";

type Option<T extends string> = {
  v: T;
  label: string;
};

const categories = [
  { v: "health", label: "Здоровье" },
  { v: "family", label: "Семья" },
  { v: "work", label: "Работа" },
  { v: "anxiety", label: "Тревога" },
  { v: "loss", label: "Утрата" },
  { v: "addiction", label: "Зависимости" },
  { v: "other", label: "Другое" },
] as const;

const urgencyOptions = [
  { v: "usual", label: "Обычно" },
  { v: "urgent", label: "Срочно" },
] as const;

const cityOptions = [
  { v: "izhevsk", label: "г. Ижевск" },
  { v: "other", label: "Другой город" },
] as const;

const meetingOptions = [
  { v: "home_visit", label: "Нужно прийти ко мне" },
  { v: "self_visit", label: "Я приду на молитву сам(а)" },
  { v: "online", label: "Онлайн без личного контакта" },
] as const;

function FancySelect<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (next: T) => void;
  options: readonly Option<T>[];
  ariaLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find((item) => item.v === value) ?? options[0];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`prayer-select ${open ? "prayer-select-open" : ""}`}>
      <button
        type="button"
        className="prayer-select-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className="prayer-select-value">{selected.label}</span>
        <span className="prayer-select-chevron" aria-hidden="true">⌄</span>
      </button>

      <div className="prayer-select-panel" role="listbox" aria-label={ariaLabel}>
        {options.map((option) => (
          <button
            key={option.v}
            type="button"
            role="option"
            aria-selected={option.v === value}
            className={`prayer-select-option ${option.v === value ? "prayer-select-option-active" : ""}`}
            onClick={() => {
              onChange(option.v);
              setOpen(false);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

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
  const [city, setCity] = useState<"izhevsk" | "other">("izhevsk");
  const [meetingFormat, setMeetingFormat] = useState<"home_visit" | "self_visit" | "online">("home_visit");
  const [address, setAddress] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [consent, setConsent] = useState<boolean>(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);

  const [hp, setHp] = useState<string>("");

  const count = message.length;
  const okLen = count >= 300 && count <= 1500;
  const phoneDigits = phone.replace(/\D/g, "");
  const phoneOk = phoneDigits.length === 11;
  const addressNeeded = city === "izhevsk" && meetingFormat === "home_visit";
  const addressOk = !addressNeeded || address.trim().length >= 10;
  const requiredInvalid = {
    phone: !phoneOk,
    address: addressNeeded && !addressOk,
    message: !okLen,
    consent: !consent,
  };
  const hasRequiredInvalid = Object.values(requiredInvalid).some(Boolean);

  const disabled = useMemo(() => {
    if (status === "sending") return true;
    return false;
  }, [status]);

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    const normalized = digits.startsWith("8") ? `7${digits.slice(1)}` : digits;

    if (!normalized) return "";

    const d = normalized;
    let out = "+7";
    if (d.length > 1) out += ` ${d.slice(1, 4)}`;
    if (d.length > 4) out += `-${d.slice(4, 7)}`;
    if (d.length > 7) out += `-${d.slice(7, 9)}`;
    if (d.length > 9) out += `-${d.slice(9, 11)}`;
    return out;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (hasRequiredInvalid) {
      setStatus("error");
      setErr("Заполните обязательные поля.");
      return;
    }

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
          captchaToken: "",
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
          <FancySelect
            value={category}
            onChange={setCategory}
            options={categories}
            ariaLabel="Категория"
          />
        </label>

        <label className="prayer-field">
          <span className="prayer-label">Срочность</span>
          <FancySelect
            value={urgency}
            onChange={setUrgency}
            options={urgencyOptions}
            ariaLabel="Срочность"
          />
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
            className={`prayer-input ${attemptedSubmit && requiredInvalid.phone ? "prayer-input-invalid" : ""}`}
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="+7 900-123-45-67"
            aria-label="Телефон"
            required
          />
        </label>

        <label className="prayer-field">
          <span className="prayer-label">Место проживания</span>
          <FancySelect
            value={city}
            onChange={setCity}
            options={cityOptions}
            ariaLabel="Место проживания"
          />
        </label>
      </div>

      {city === "izhevsk" && (
        <div className="prayer-grid-two">
          <label className="prayer-field">
            <span className="prayer-label">Как вам удобно</span>
            <FancySelect
              value={meetingFormat}
              onChange={setMeetingFormat}
              options={meetingOptions}
              ariaLabel="Вариант молитвы"
            />
          </label>

          {meetingFormat === "home_visit" ? (
            <label className="prayer-field">
              <span className="prayer-label">Полный адрес (обязательно)</span>
              <input
                className={`prayer-input ${attemptedSubmit && requiredInvalid.address ? "prayer-input-invalid" : ""}`}
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
          className={`prayer-input prayer-textarea ${attemptedSubmit && requiredInvalid.message ? "prayer-input-invalid" : ""}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Можно кратко. Напишите так, как получается."
          aria-label="Текст ситуации"
        />
      </label>

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
          className={`prayer-checkbox prayer-checkbox-consent ${attemptedSubmit && requiredInvalid.consent ? "prayer-checkbox-invalid" : ""}`}
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
