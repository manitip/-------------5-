import "./globals.css";
import type { Metadata } from "next";
import GlowBg from "@/components/GlowBg";

export const metadata: Metadata = {
  title: "Молитвенная поддержка",
  description: "Тёплый и простой способ попросить молитву — можно анонимно.",
  openGraph: {
    title: "Молитвенная поддержка",
    description: "Можно написать анонимно. Мы бережно относимся к вашей истории.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <GlowBg />
        {children}
      </body>
    </html>
  );
}
