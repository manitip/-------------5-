import Link from "next/link";
import { siteText } from "@/content/siteText";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div>© {new Date().getFullYear()} {siteText.brand.name}</div>
        <div className="site-footer-links">
          <Link href="/privacy">{siteText.footer.policyLabel}</Link>
          <Link href="/contacts">{siteText.footer.contactsLabel}</Link>
          <Link href="/admin">{siteText.footer.adminLabel}</Link>
        </div>
      </div>
    </footer>
  );
}
