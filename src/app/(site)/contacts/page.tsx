import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";

export const metadata = { title: "Контакты" };

export default function Contacts() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-semibold md:text-3xl">Контакты</h1>
      </FadeIn>

      <FadeIn>
        <Card className="p-5 md:p-7">
          <div className="space-y-3 text-sm text-[#A7B3C2]">
            <div>
              <span className="text-[#E6EEF7] font-medium">Email:</span> team@example.com
            </div>
            <div>
              <span className="text-[#E6EEF7] font-medium">Обычно отвечаем:</span> в течение 1–2 дней
            </div>
            <div className="pt-2">
              <a className="text-[#E6EEF7] underline decoration-white/30 hover:decoration-white" href="/privacy">
                Политика конфиденциальности
              </a>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
