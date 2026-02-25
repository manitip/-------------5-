import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";
import { siteText } from "@/content/siteText";

const privacyText = siteText.pages.privacy;

export const metadata = { title: privacyText.title };

export default function Privacy() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-semibold md:text-3xl">{privacyText.title}</h1>
      </FadeIn>

      <FadeIn>
        <Card className="p-5 md:p-7">
          <div className="space-y-4 text-sm leading-relaxed text-[#A7B3C2]">
            <p>{privacyText.intro}</p>

            {privacyText.sections.map((section) => (
              <div key={section.title} className="space-y-2">
                <div className="text-[#E6EEF7] font-semibold">{section.title}</div>
                <ul className="list-disc pl-5 space-y-1">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="space-y-2">
              <div className="text-[#E6EEF7] font-semibold">{privacyText.storageTitle}</div>
              <p>{privacyText.storageText}</p>
            </div>

            <div className="space-y-2">
              <div className="text-[#E6EEF7] font-semibold">{privacyText.importantTitle}</div>
              <p>{privacyText.importantText}</p>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
