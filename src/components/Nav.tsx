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
    <header className="site-nav">
      <div className="container site-nav-inner">
        <Link href="/" className="site-logo">
          <img src="/molicon.svg" alt="Иконка Молитвенной поддержки" className="site-logo-icon" />
          <span>Молитвенная поддержка</span>
        </Link>

        <nav className="site-nav-links">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className="site-nav-link">
              {i.label}
            </Link>
          ))}
        </nav>

        <Link href="/request" className="ui-btn ui-btn-ghost site-nav-cta">Попросить молитву</Link>
      </div>

      <div className="container mobile-cta-wrap">
        <Link href="/request" className="ui-btn ui-btn-primary mobile-cta">Попросить молитву</Link>
      </div>
    </header>
  );
}
