import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";
import PrayerForm from "@/components/PrayerForm";
import { siteText } from "@/content/siteText";

const requestText = siteText.pages.request;

export const metadata = {
  title: requestText.title,
  description: requestText.metadataDescription,
};

export default function RequestPage() {
  return (
    <div className="request-page">
      <FadeIn>
        <div className="request-hero">
          <h1 className="request-title">{requestText.title}</h1>
          <p className="request-subtitle">{requestText.subtitle}</p>
        </div>
      </FadeIn>

      <FadeIn>
        <Card className="request-form-card">
          <PrayerForm />
        </Card>
      </FadeIn>

      <FadeIn>
        <Card className="request-privacy-card">
          <div className="request-privacy-title">{requestText.privacyTitle}</div>
          <ul className="request-privacy-list">
            {requestText.privacyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </FadeIn>
    </div>
  );
}
