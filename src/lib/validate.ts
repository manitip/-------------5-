import { z } from "zod";

export const PrayerSchema = z.object({
  category: z.enum(["health","family","work","anxiety","loss","addiction","other"]),
  urgency: z.enum(["usual","urgent"]).optional().default("usual"),
  forWhom: z.enum(["self","other"]).optional().default("self"),
  city: z.enum(["izhevsk", "other"]).optional().default("izhevsk"),
  meetingFormat: z.enum(["home_visit", "self_visit", "online"]).nullable().optional(),
  address: z.string().max(250).optional().or(z.literal("")),
  message: z.string().min(300).max(1500),
  name: z.string().max(80).optional().or(z.literal("")),
  email: z.string().email().max(120).optional().or(z.literal("")),
  phone: z.string().min(6).max(40),
  anonymous: z.boolean().optional().default(false),
  consent: z.boolean().refine(v => v === true, "Нужно согласие с политикой"),
  // антиспам
  hp: z.string().optional().default(""),
  captchaToken: z.string().optional().default(""),
}).superRefine((v, ctx) => {
  if (v.city === "izhevsk" && !v.meetingFormat) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["meetingFormat"],
      message: "Выберите формат встречи для г. Ижевск",
    });
  }

  if (v.city === "izhevsk" && v.meetingFormat === "home_visit" && (!v.address || v.address.trim().length < 10)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["address"],
      message: "Укажите полный адрес",
    });
  }
});

export type PrayerInput = z.infer<typeof PrayerSchema>;
