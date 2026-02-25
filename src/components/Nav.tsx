import Link from "next/link";
import { siteText } from "@/content/siteText";

export default function Nav() {
  return (
    <header className="site-nav">
      <div className="container site-nav-inner">
        <Link href="/" className="site-logo">
          <img src="/molicon.svg" alt={siteText.brand.logoAlt} className="site-logo-icon" />
          <span>{siteText.brand.name}</span>
        </Link>

        <nav className="site-nav-links">
          {siteText.nav.items.map((i) => (
            <Link key={i.href} href={i.href} className="site-nav-link">
              {i.label}
            </Link>
          ))}
        </nav>

        <Link href="/request" className="ui-btn ui-btn-ghost site-nav-cta">{siteText.nav.requestCta}</Link>
      </div>

      <div className="mobile-cta-wrap">
        <Link href="/request" className="ui-btn ui-btn-primary mobile-cta">{siteText.nav.requestCta}</Link>
      </div>
    </header>
  );
}
