import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";

export const metadata = { title: "Как это работает" };

export default function HowItWorks() {
  return (
    <div className="how-works-page">
      <FadeIn>
        <h1 className="how-works-title">Как это работает</h1>
      </FadeIn>

      <FadeIn>
        <div className="how-works-grid">
          {[
            { n: "1", t: "Вы отправляете запрос", d: "Можно анонимно, минимум полей." },
            { n: "2", t: "Команда молится", d: "Мы бережно относимся к вашей истории." },
            { n: "3", t: "Подтверждение — по желанию", d: "Если оставили email, можем подтвердить получение." },
          ].map((s) => (
            <Card key={s.n} className="how-works-card">
              <div className="how-works-step">Шаг {s.n}</div>
              <div className="how-works-card-title">{s.t}</div>
              <div className="how-works-card-text">{s.d}</div>
            </Card>
          ))}
        </div>
      </FadeIn>

      <FadeIn>
        <Card className="how-works-note">
          <div className="how-works-note-title">О сроках</div>
          <p className="how-works-note-text">
            Мы стараемся реагировать быстро, но не даём обещаний “точного результата”.
            Если вы оставили контакт — подтверждение может прийти автоматически.
          </p>
        </Card>
      </FadeIn>
    </div>
  );
}
