import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import AdminClient from "@/components/AdminClient";

export const metadata = { title: "Админка" };

export default async function AdminPage() {
  const sess = await readSession();
  if (!sess) redirect("/admin/login");
  return <AdminClient />;
}
