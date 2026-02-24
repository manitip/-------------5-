import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";

export const metadata = { title: "FAQ" };

const faq = [
  { q: "Можно ли анонимно?", a: "Да. Включите “Анонимно” — имя и email не понадобятся." },
  { q: "Можно ли без контактов?", a: "Да. Контакт нужен только если вы хотите подтверждение или ответ." },
  { q: "Что нельзя писать?", a: "Угрозы, призывы к насилию, незаконную тематику и чужие персональные данные." },
  { q: "Сколько ждать ответа?", a: "Ответ может не предусматриваться. Если вы оставили email — подтверждение возможно." },
];

export default function FAQ() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-semibold md:text-3xl">FAQ</h1>
      </FadeIn>

      <div className="grid gap-4">
        {faq.map((x) => (
          <FadeIn key={x.q}>
            <Card className="p-5">
              <div className="text-base font-semibold">{x.q}</div>
              <div className="mt-2 text-sm text-[#A7B3C2]">{x.a}</div>
            </Card>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
