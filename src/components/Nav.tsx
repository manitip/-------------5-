import Link from "next/link";

const items = [
  { href: "/", label: "Главная" },
  { href: "/request", label: "Попросить молитву" },
  { href: "/how-it-works", label: "Как это работает" },
  { href: "/about", label: "О нас" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacts", label: "Контакты" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B0F14]/70 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="h-2 w-2 rounded-full" style={{ background: "#19C37D" }} />
          <span>Молитвенная поддержка</span>
        </Link>

        <nav className="hidden gap-5 text-sm text-[#A7B3C2] md:flex">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className="hover:text-[#E6EEF7]">
              {i.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/request"
          className="hidden rounded-xl bg-white/0 px-4 py-2 text-sm font-medium text-[#E6EEF7] ring-1 ring-white/10 hover:bg-white/5 md:inline-flex"
        >
          Попросить молитву
        </Link>
      </div>

      {/* липкая CTA на мобилке */}
      <div className="fixed bottom-4 left-0 right-0 z-30 mx-auto w-full max-w-[1200px] px-4 md:hidden">
        <Link
          href="/request"
          className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#19C37D] to-[#22D3EE] px-5 py-4 text-base font-semibold text-[#0B0F14] shadow-2xl shadow-black/30"
        >
          Попросить молитву
        </Link>
      </div>
    </header>
  );
}
