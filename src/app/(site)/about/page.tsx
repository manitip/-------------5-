import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";

export const metadata = { title: "О нас" };

export default function About() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-semibold md:text-3xl">О нас / Кто молится</h1>
      </FadeIn>

      <FadeIn>
        <Card className="p-5 md:p-7">
          <p className="text-sm leading-relaxed text-[#A7B3C2] md:text-base">
            Мы — небольшая команда людей, которые готовы поддержать молитвой.
            Мы не давим, не спорим и не используем вашу историю для публикаций.
            Наша цель — быть рядом, когда трудно.
          </p>

          <div className="mt-4 rounded-xl bg-white/5 p-4 text-sm text-[#A7B3C2] ring-1 ring-white/10">
            Здесь можно заменить текст на ваш: кто вы, ценности, формат поддержки — спокойно и без агитации.
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
