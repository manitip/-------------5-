import { Card } from "@/components/Ui";

export const metadata = { title: "Вход в админку" };

type AdminLoginProps = {
  searchParams?: Promise<{ error?: string; email?: string }>;
};

export default async function AdminLogin({ searchParams }: AdminLoginProps) {
  const params = (await searchParams) || {};
  const hasError = params.error === "invalid_credentials";

  return (
    <div className="mx-auto max-w-md">
      <Card className="relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-2xl" />

        <div className="relative mb-6 space-y-2">
          <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
            Защищенный доступ
          </div>
          <h1 className="text-2xl font-semibold">Вход в админку</h1>
          <p className="text-sm text-[#A7B3C2]">Управление заявками и статусами молитвенных нужд.</p>
        </div>

        <form action="/api/admin/login" method="post" className="grid gap-4">
          {hasError ? (
            <p className="rounded-xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-200">
              Не удалось войти. Проверьте email/пароль и попробуйте снова.
            </p>
          ) : null}

          <label className="grid gap-2 text-sm">
            <span className="text-[#A7B3C2]">Email</span>
            <input
              name="email"
              defaultValue={params.email || ""}
              className="rounded-xl border border-white/10 bg-[#0E1724] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]"
              required
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-[#A7B3C2]">Пароль</span>
            <input
              name="password"
              type="password"
              className="rounded-xl border border-white/10 bg-[#0E1724] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]"
              required
            />
          </label>

          <button className="rounded-xl bg-gradient-to-r from-[#19C37D] to-[#22D3EE] px-5 py-3 font-semibold text-[#0B0F14] shadow-[0_12px_30px_rgba(34,211,238,.2)] transition hover:brightness-110">
            Войти
          </button>

          <p className="text-xs text-[#A7B3C2]">
            Если вход не проходит — проверьте ADMIN_EMAIL и ADMIN_PASSWORD/ADMIN_PASSWORD_HASH в .env
          </p>
        </form>
      </Card>
    </div>
  );
}
