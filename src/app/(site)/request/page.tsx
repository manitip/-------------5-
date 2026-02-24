import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";
import PrayerForm from "@/components/PrayerForm";

export const metadata = {
  title: "Попросить молитву",
  description: "Форма запроса молитвенной поддержки. Можно анонимно.",
};

export default function RequestPage() {
  return (
    <div className="request-page">
      <FadeIn>
        <div className="request-hero">
          <h1 className="request-title">Попросить молитву</h1>
          <p className="request-subtitle">
            Можно написать анонимно. Мы бережно относимся к вашей истории и не публикуем личные данные.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <Card className="request-form-card">
          <PrayerForm />
        </Card>
      </FadeIn>

      <FadeIn>
        <Card className="request-privacy-card">
          <div className="request-privacy-title">Приватность</div>
          <ul className="request-privacy-list">
            <li>Не добавляйте чужие персональные данные (телефоны, адреса, документы).</li>
            <li>Не пишите угрозы и призывы к насилию — такие сообщения блокируются.</li>
            <li>Срок хранения заявок ограничен и настраивается (по умолчанию).</li>
          </ul>
        </Card>
      </FadeIn>
    </div>
  );
}
