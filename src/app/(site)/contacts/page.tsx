import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";
import { siteText } from "@/content/siteText";

const contactsText = siteText.pages.contacts;

export const metadata = { title: contactsText.title };

export default function Contacts() {
  return (
    <div className="contacts-page">
      <FadeIn>
        <section className="contacts-hero">
          <p className="section-kicker">{contactsText.kicker}</p>
          <h1 className="contacts-title">{contactsText.title}</h1>
          <p className="contacts-subtitle">{contactsText.subtitle}</p>
        </section>
      </FadeIn>

      <FadeIn>
        <Card className="contacts-card">
          <div className="contacts-row">
            <span className="contacts-label">{contactsText.emailLabel}</span>
            <a className="contacts-link" href={`mailto:${contactsText.email}`}>{contactsText.email}</a>
          </div>

          <div className="contacts-row">
            <span className="contacts-label">{contactsText.responseLabel}</span>
            <span className="contacts-value">{contactsText.responseValue}</span>
          </div>

          <div className="contacts-row contacts-row-last">
            <span className="contacts-label">{contactsText.documentsLabel}</span>
            <a className="contacts-link" href="/privacy">{contactsText.privacyLabel}</a>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
