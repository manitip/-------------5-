import FadeIn from "@/components/FadeIn";
import { Button, Card } from "@/components/Ui";

const topics = [
  { title: "Здоровье", text: "когда страшно и хочется поддержки" },
  { title: "Семья", text: "отношения, дети, близкие" },
  { title: "Тревога", text: "внутреннее напряжение, паника, бессонница" },
  { title: "Работа", text: "потеря, неопределённость, выгорание" },
  { title: "Утрата", text: "горе, прощание, тяжёлые новости" },
  { title: "Зависимости", text: "борьба, срывы, восстановление" },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <FadeIn>
        <section className="grid gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Можно попросить молитву — спокойно, бережно и без лишних вопросов.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#A7B3C2] md:text-lg">
              Опишите ситуацию так, как можете. Можно анонимно.
              Если захотите — оставьте email, чтобы получить подтверждение.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/request">Попросить молитву</Button>
              <Button href="/how-it-works" variant="ghost">Как это работает</Button>
              <Button href="/contacts" variant="ghost">Контакты</Button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <Card className="p-4">
                <div className="text-sm font-semibold">Можно анонимно</div>
                <div className="mt-1 text-sm text-[#A7B3C2]">без имени и контактов</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm font-semibold">Ничего не публикуем</div>
                <div className="mt-1 text-sm text-[#A7B3C2]">история остаётся приватной</div>
              </Card>
              <Card className="p-4">
                <div className="text-sm font-semibold">Минимум полей</div>
                <div className="mt-1 text-sm text-[#A7B3C2]">только то, что нужно</div>
              </Card>
            </div>
          </div>

          <div className="md:col-span-5">
            <Card className="p-6">
              <div className="text-sm font-semibold">Коротко</div>
              <p className="mt-2 text-sm leading-relaxed text-[#A7B3C2]">
                Мы принимаем запросы и молимся. Иногда отправляем подтверждение,
                если вы оставили контакт. Мы не обещаем “чудес по расписанию” —
                но бережно поддерживаем и остаёмся рядом.
              </p>
              <div className="mt-4 rounded-xl bg-white/5 p-4 text-sm text-[#A7B3C2] ring-1 ring-white/10">
                Если вы в опасности или вам нужна срочная помощь — обратитесь в местные экстренные службы.
              </div>
            </Card>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="space-y-4">
          <h2 className="text-xl font-semibold md:text-2xl">О чём можно попросить</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t) => (
              <Card key={t.title} className="p-5">
                <div className="text-base font-semibold">{t.title}</div>
                <div className="mt-2 text-sm text-[#A7B3C2]">{t.text}</div>
              </Card>
            ))}
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
