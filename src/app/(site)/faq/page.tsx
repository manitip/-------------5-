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
    <div className="faq-page">
      <FadeIn>
        <section className="faq-hero">
          <p className="section-kicker">Полезно знать</p>
          <h1 className="faq-title">FAQ</h1>
          <p className="faq-subtitle">
            Короткие ответы на самые частые вопросы перед отправкой просьбы о молитве.
          </p>
        </section>
      </FadeIn>

      <div className="faq-grid">
        {faq.map((item, idx) => (
          <FadeIn key={item.q}>
            <Card className="faq-card">
              <div className="faq-card-top">
                <span className="faq-badge">{String(idx + 1).padStart(2, "0")}</span>
                <h2 className="faq-card-title">{item.q}</h2>
              </div>
              <p className="faq-card-text">{item.a}</p>
            </Card>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
