import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";
import { siteText } from "@/content/siteText";

const howItWorksText = siteText.pages.howItWorks;

export const metadata = { title: howItWorksText.title };

export default function HowItWorks() {
  return (
    <div className="how-works-page">
      <FadeIn>
        <h1 className="how-works-title">{howItWorksText.title}</h1>
      </FadeIn>

      <FadeIn>
        <div className="how-works-grid">
          {howItWorksText.steps.map((s) => (
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
          <div className="how-works-note-title">{howItWorksText.noteTitle}</div>
          <p className="how-works-note-text">{howItWorksText.noteText}</p>
        </Card>
      </FadeIn>
    </div>
  );
}
