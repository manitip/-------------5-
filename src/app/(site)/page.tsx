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
    <div className="home-stack">
      <FadeIn>
        <section className="hero-grid">
          <div>
            <h1 className="hero-title">Можно попросить молитву — спокойно, бережно и без лишних вопросов.</h1>
            <p className="hero-subtitle">
              Опишите ситуацию так, как можете. Можно анонимно. Если захотите — оставьте email,
              чтобы получить подтверждение.
            </p>

            <div className="hero-buttons">
              <Button href="/request">Попросить молитву</Button>
              <Button href="/how-it-works" variant="ghost">Как это работает</Button>
              <Button href="/contacts" variant="ghost">Контакты</Button>
            </div>

            <div className="feature-grid">
              <Card className="feature-card">
                <div className="feature-title">Можно анонимно</div>
                <div className="feature-text">без имени и контактов</div>
              </Card>
              <Card className="feature-card">
                <div className="feature-title">Ничего не публикуем</div>
                <div className="feature-text">история остаётся приватной</div>
              </Card>
              <Card className="feature-card">
                <div className="feature-title">Минимум полей</div>
                <div className="feature-text">только то, что нужно</div>
              </Card>
            </div>
          </div>

          <div>
            <Card className="hero-info-card">
              <div className="feature-title">Коротко</div>
              <p className="feature-text">
                Мы принимаем запросы и молимся. Иногда отправляем подтверждение, если вы оставили контакт.
                Мы не обещаем “чудес по расписанию” — но бережно поддерживаем и остаёмся рядом.
              </p>
              <div className="hero-warning">Если вы в опасности или вам нужна срочная помощь — обратитесь в местные экстренные службы.</div>
            </Card>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section>
          <h2 className="section-title">О чём можно попросить</h2>
          <div className="topic-grid">
            {topics.map((t) => (
              <Card key={t.title} className="topic-card">
                <div className="feature-title">{t.title}</div>
                <div className="feature-text">{t.text}</div>
              </Card>
            ))}
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
