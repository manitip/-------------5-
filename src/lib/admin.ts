export const statusOptions = ["all", "new", "praying", "done"] as const;

export const statusLabel: Record<string, string> = {
  new: "Новый",
  praying: "В молитве",
  done: "Завершено",
};

export const catMap: Record<string, string> = {
  health: "Здоровье",
  family: "Семья",
  work: "Работа",
  anxiety: "Тревога",
  loss: "Утрата",
  addiction: "Зависимости",
  other: "Другое",
};

export const urgencyLabel: Record<string, string> = {
  urgent: "Срочно",
  usual: "Обычно",
  normal: "Обычно",
};

export function formatDate(input: Date | string) {
  const d = input instanceof Date ? input : new Date(input);
  return d.toLocaleString("ru-RU");
}
