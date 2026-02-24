import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";
import PrayerForm from "@/components/PrayerForm";

export const metadata = {
  title: "Попросить молитву",
  description: "Форма запроса молитвенной поддержки. Можно анонимно.",
};

export default function RequestPage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">Попросить молитву</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#A7B3C2] md:text-base">
            Можно написать анонимно. Мы бережно относимся к вашей истории и не публикуем личные данные.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <Card className="p-5 md:p-7">
          <PrayerForm />
        </Card>
      </FadeIn>

      <FadeIn>
        <Card className="p-5">
          <div className="text-sm font-semibold">Приватность</div>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[#A7B3C2]">
            <li>Не добавляйте чужие персональные данные (телефоны, адреса, документы).</li>
            <li>Не пишите угрозы и призывы к насилию — такие сообщения блокируются.</li>
            <li>Срок хранения заявок ограничен и настраивается (по умолчанию).</li>
          </ul>
        </Card>
      </FadeIn>
    </div>
  );
}
