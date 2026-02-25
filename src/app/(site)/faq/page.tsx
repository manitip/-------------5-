import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";
import { siteText } from "@/content/siteText";

const faqText = siteText.pages.faq;

export const metadata = { title: faqText.title };

export default function FAQ() {
  return (
    <div className="faq-page">
      <FadeIn>
        <section className="faq-hero">
          <p className="section-kicker">{faqText.kicker}</p>
          <h1 className="faq-title">{faqText.title}</h1>
          <p className="faq-subtitle">{faqText.subtitle}</p>
        </section>
      </FadeIn>

      <div className="faq-grid">
        {faqText.items.map((item, idx) => (
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
