import { Card } from "@/components/Ui";

export const metadata = { title: "Вход в админку" };

export default function AdminLogin() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Вход в админку</h1>

      <Card className="p-6">
        <form action="/api/admin/login" method="post" className="grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="text-[#A7B3C2]">Email</span>
            <input name="email" className="rounded-xl bg-white/0 p-3 ring-1 ring-white/10" required />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-[#A7B3C2]">Пароль</span>
            <input name="password" type="password" className="rounded-xl bg-white/0 p-3 ring-1 ring-white/10" required />
          </label>

          <button className="rounded-xl bg-gradient-to-r from-[#19C37D] to-[#22D3EE] px-5 py-3 font-semibold text-[#0B0F14]">
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
