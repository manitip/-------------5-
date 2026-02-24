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
  const cls = cn("ui-btn", variant === "primary" ? "ui-btn-primary" : "ui-btn-ghost", className);

  if (href) return <Link className={cls} href={href}>{children}</Link>;
  return <button className={cls} {...props}>{children}</button>;
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("ui-card", className)}>
      {children}
    </div>
  );
}
