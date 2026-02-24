import Link from "next/link";

export const metadata = {
  title: "Админка",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-[#0B0F14]/70 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3">
          <Link href="/" className="text-sm text-[#A7B3C2] hover:text-[#E6EEF7]">
            ← На сайт
          </Link>
          <div className="text-sm font-semibold">Админ-панель</div>
          <div className="w-16" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-8">
        {children}
      </main>
    </div>
  );
}
