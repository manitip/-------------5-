import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B0F14]/60">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-10 text-sm text-[#A7B3C2] md:flex-row md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} Молитвенная поддержка</div>
        <div className="flex gap-4">
          <Link className="hover:text-[#E6EEF7]" href="/privacy">Политика</Link>
          <Link className="hover:text-[#E6EEF7]" href="/contacts">Контакты</Link>
          <Link className="hover:text-[#E6EEF7]" href="/admin">Админка</Link>
        </div>
      </div>
    </footer>
  );
}
