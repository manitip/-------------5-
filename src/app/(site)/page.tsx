import FadeIn from "@/components/FadeIn";
import { Button, Card } from "@/components/Ui";
import { siteText } from "@/content/siteText";

const homeText = siteText.pages.home;

export default function HomePage() {
  return (
    <div className="home-stack">
      <FadeIn>
        <section className="hero-grid">
          <div>
            <h1 className="hero-title">{homeText.heroTitle}</h1>
            <p className="hero-subtitle">{homeText.heroSubtitle}</p>

            <div className="hero-buttons">
              <Button href="/request">{homeText.heroButtons.request}</Button>
              <Button href="/how-it-works" variant="ghost">{homeText.heroButtons.howItWorks}</Button>
              <Button href="/contacts" variant="ghost">{homeText.heroButtons.contacts}</Button>
            </div>

            <div className="feature-grid">
              {homeText.features.map((feature) => (
                <Card key={feature.title} className="feature-card">
                  <div className="feature-title">{feature.title}</div>
                  <div className="feature-text">{feature.text}</div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Card className="hero-info-card">
              <div className="feature-title">{homeText.shortTitle}</div>
              <p className="feature-text">{homeText.shortText}</p>
              <div className="hero-warning">{homeText.warning}</div>
            </Card>
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <section>
          <h2 className="section-title">{homeText.topicsTitle}</h2>
          <div className="topic-grid">
            {homeText.topics.map((t) => (
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
