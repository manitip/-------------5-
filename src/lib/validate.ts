import { z } from "zod";

export const PrayerSchema = z.object({
  category: z.enum(["health","family","work","anxiety","loss","addiction","other"]),
  urgency: z.enum(["usual","urgent"]).optional().default("usual"),
  forWhom: z.enum(["self","other"]).optional().default("self"),
  message: z.string().min(300).max(1500),
  name: z.string().max(80).optional().or(z.literal("")),
  email: z.string().email().max(120).optional().or(z.literal("")),
  anonymous: z.boolean().optional().default(false),
  consent: z.boolean().refine(v => v === true, "Нужно согласие с политикой"),
  // антиспам
  hp: z.string().optional().default(""),
  captchaToken: z.string().optional().default(""),
});

export type PrayerInput = z.infer<typeof PrayerSchema>;
