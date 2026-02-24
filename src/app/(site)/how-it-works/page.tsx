import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";

export const metadata = { title: "Как это работает" };

export default function HowItWorks() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-semibold md:text-3xl">Как это работает</h1>
      </FadeIn>

      <FadeIn>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "1", t: "Вы отправляете запрос", d: "Можно анонимно, минимум полей." },
            { n: "2", t: "Команда молится", d: "Мы бережно относимся к вашей истории." },
            { n: "3", t: "Подтверждение — по желанию", d: "Если оставили email, можем подтвердить получение." },
          ].map((s) => (
            <Card key={s.n} className="p-5">
              <div className="text-sm text-[#A7B3C2]">Шаг {s.n}</div>
              <div className="mt-1 text-base font-semibold">{s.t}</div>
              <div className="mt-2 text-sm text-[#A7B3C2]">{s.d}</div>
            </Card>
          ))}
        </div>
      </FadeIn>

      <FadeIn>
        <Card className="p-5">
          <div className="text-sm font-semibold">О сроках</div>
          <p className="mt-2 text-sm leading-relaxed text-[#A7B3C2]">
            Мы стараемся реагировать быстро, но не даём обещаний “точного результата”.
            Если вы оставили контакт — подтверждение может прийти автоматически.
          </p>
        </Card>
      </FadeIn>
    </div>
  );
}
