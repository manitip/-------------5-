import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";

export const metadata = { title: "Контакты" };

export default function Contacts() {
  return (
    <div className="contacts-page">
      <FadeIn>
        <section className="contacts-hero">
          <p className="section-kicker">Связаться с нами</p>
          <h1 className="contacts-title">Контакты</h1>
          <p className="contacts-subtitle">
            Если вам удобнее написать напрямую, используйте email ниже. Мы стараемся отвечать
            спокойно и по делу.
          </p>
        </section>
      </FadeIn>

      <FadeIn>
        <Card className="contacts-card">
          <div className="contacts-row">
            <span className="contacts-label">Email</span>
            <a className="contacts-link" href="mailto:team@example.com">team@example.com</a>
          </div>

          <div className="contacts-row">
            <span className="contacts-label">Обычно отвечаем</span>
            <span className="contacts-value">в течение 1–2 дней</span>
          </div>

          <div className="contacts-row contacts-row-last">
            <span className="contacts-label">Документы</span>
            <a className="contacts-link" href="/privacy">Политика конфиденциальности</a>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
