import FadeIn from "@/components/FadeIn";
import { Card } from "@/components/Ui";

export const metadata = { title: "Политика конфиденциальности" };

export default function Privacy() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-semibold md:text-3xl">Политика конфиденциальности</h1>
      </FadeIn>

      <FadeIn>
        <Card className="p-5 md:p-7">
          <div className="space-y-4 text-sm leading-relaxed text-[#A7B3C2]">
            <p>
              Мы собираем минимум данных, чтобы принять запрос и (при желании) подтвердить его получение.
            </p>

            <div className="space-y-2">
              <div className="text-[#E6EEF7] font-semibold">Что собираем</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>текст запроса, выбранную категорию и срочность;</li>
                <li>имя/email — только если вы их указали.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-[#E6EEF7] font-semibold">Зачем</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>чтобы команда могла прочитать запрос и молиться;</li>
                <li>email — для подтверждения и возможного ответа.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-[#E6EEF7] font-semibold">Срок хранения</div>
              <p>
                Ограничен и настраивается. Можно удалить по запросу (если есть контакт для идентификации).
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-[#E6EEF7] font-semibold">Важно</div>
              <p>
                Пожалуйста, не отправляйте чужие персональные данные и не пишите опасный контент
                (угрозы/призывы к насилию/незаконную тематику).
              </p>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );
}
