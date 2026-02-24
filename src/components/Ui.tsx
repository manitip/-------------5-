import Link from "next/link";
import { cn } from "@/components/cn";

export function Button({
  href,
  children,
  variant = "primary",
  className,
  ...props
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-medium transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]/70 disabled:opacity-60 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-gradient-to-r from-[#19C37D] to-[#22D3EE] text-[#0B0F14] shadow-lg shadow-[#22D3EE]/10 hover:brightness-110 active:brightness-95"
      : "bg-white/0 text-[#E6EEF7] ring-1 ring-white/10 hover:bg-white/5";
  const cls = cn(base, styles, className);

  if (href) return <Link className={cls} href={href}>{children}</Link>;
  return <button className={cls} {...props}>{children}</button>;
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-[#111827]/70 ring-1 ring-white/10 shadow-xl shadow-black/20", className)}>
      {children}
    </div>
  );
}
