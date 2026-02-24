import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div>© {new Date().getFullYear()} Молитвенная поддержка</div>
        <div className="site-footer-links">
          <Link href="/privacy">Политика</Link>
          <Link href="/contacts">Контакты</Link>
          <Link href="/admin">Админка</Link>
        </div>
      </div>
    </footer>
  );
}
