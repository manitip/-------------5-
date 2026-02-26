import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";
import { siteText } from "@/content/siteText";

const aboutText = siteText.pages.about;

export const metadata = { title: "О нас" };

export default function About() {
  const bibleQuote = "И всё, чего ни попросите в молитве с верою, получите (Матфея 21:22).";
  const hasBibleQuote = aboutText.subtitle.includes(bibleQuote);
  const [beforeQuote, afterQuote] = hasBibleQuote ? aboutText.subtitle.split(bibleQuote) : [aboutText.subtitle, ""];

  return (
    <div className="about-page">
      <FadeIn>
        <section className="about-hero">
          <p className="section-kicker">{aboutText.kicker}</p>
          <h1 className="about-title">{aboutText.title}</h1>
          <p className="about-subtitle">
            {beforeQuote}
            {hasBibleQuote ? <strong>{bibleQuote}</strong> : null}
            {afterQuote}
          </p>
        </section>
      </FadeIn>

      <FadeIn>
        <Card className="about-note-card">
          <p className="about-note-title">{aboutText.noteTitle}</p>
          <p className="about-note-text">{aboutText.noteText}</p>
        </Card>
      </FadeIn>

      <div className="about-values-grid">
        {aboutText.values.map((v) => (
          <FadeIn key={v.title}>
            <Card className="about-value-card">
              <h2 className="about-value-title">{v.title}</h2>
              <p className="about-value-text">{v.text}</p>
            </Card>
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <Card className="about-bottom-card">
          <h3 className="about-bottom-title">{aboutText.bottomTitle}</h3>
          <p className="about-bottom-text">{aboutText.bottomText}</p>
        </Card>
      </FadeIn>
    </div>
  );
}
