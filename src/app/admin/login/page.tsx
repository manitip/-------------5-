import { Card } from "@/components/Ui";

export const metadata = { title: "Вход в админку" };

type AdminLoginProps = {
  searchParams?: Promise<{ error?: string; email?: string }>;
};

export default async function AdminLogin({ searchParams }: AdminLoginProps) {
  const params = (await searchParams) || {};
  const hasError = params.error === "invalid_credentials";

  return (
    <div className="mx-auto grid min-h-[calc(100vh-11rem)] place-items-center px-3 py-6">
      <Card className="relative w-full max-w-[280px] overflow-hidden p-4 sm:max-w-[300px]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-400/15 blur-2xl" />

        <div className="relative mb-3 space-y-1">
          <h1 className="text-lg font-semibold leading-tight">Вход в админку</h1>
          <p className="text-xs text-[#A7B3C2]">Логин и пароль администратора</p>
        </div>

        <form action="/api/admin/login" method="post" className="grid gap-2.5">
          {hasError ? (
            <p className="rounded-lg border border-rose-400/20 bg-rose-500/10 p-2.5 text-xs text-rose-200">
              Неверный логин или пароль.
            </p>
          ) : null}

          <label className="grid gap-1 text-xs">
            <span className="text-[#A7B3C2]">Логин</span>
            <input
              name="email"
              defaultValue={params.email || ""}
              className="rounded-lg border border-white/10 bg-[#0E1724] px-3 py-2 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,.04)]"
              required
            />
          </label>

          <label className="grid gap-1 text-xs">
            <span className="text-[#A7B3C2]">Пароль</span>
            <input
              name="password"
              type="password"
              className="rounded-lg border border-white/10 bg-[#0E1724] px-3 py-2 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,.04)]"
              required
            />
          </label>

          <button className="mt-1 rounded-lg bg-gradient-to-r from-[#19C37D] to-[#22D3EE] px-3 py-2 text-sm font-semibold text-[#0B0F14] transition hover:brightness-110">
            Войти
          </button>
        </form>
      </Card>
    </div>
  );
}
