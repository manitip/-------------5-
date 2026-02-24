import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";

export const metadata = { title: "О нас" };

const values = [
  {
    title: "Без давления",
    text: "Мы не спорим и не навязываем взглядов — только спокойная поддержка и уважение к вашему пути.",
  },
  {
    title: "Конфиденциально",
    text: "Истории не публикуются. Всё, чем вы делитесь, остаётся в рамках обращения и бережного отношения.",
  },
  {
    title: "Человечно",
    text: "Наша цель — быть рядом, когда трудно: с теплом, вниманием и молитвой о вашем состоянии.",
  },
];

export default function About() {
  return (
    <div className="about-page">
      <FadeIn>
        <section className="about-hero">
          <p className="section-kicker">Кто мы</p>
          <h1 className="about-title">О нас / Кто молится</h1>
          <p className="about-subtitle">
            Мы — небольшая команда людей, которые готовы поддержать молитвой. Мы не давим,
            не спорим и не используем вашу историю для публикаций. Наша цель — быть рядом,
            когда трудно.
          </p>
        </section>
      </FadeIn>

      <FadeIn>
        <Card className="about-note-card">
          <p className="about-note-title">Наш формат поддержки</p>
          <p className="about-note-text">
            Вы можете написать в свободной форме: коротко или подробно. Мы стараемся отвечать
            бережно и без лишних слов, сохраняя уважение к вашему состоянию и границам.
          </p>
        </Card>
      </FadeIn>

      <div className="about-values-grid">
        {values.map((item) => (
          <FadeIn key={item.title}>
            <Card className="about-value-card">
              <h2 className="about-value-title">{item.title}</h2>
              <p className="about-value-text">{item.text}</p>
            </Card>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
