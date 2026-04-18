import { cn } from "@/lib/utils";

const badgeClasses = {
  primary: "bg-primary/15 text-primary ring-primary/20",
  accent: "bg-accent/15 text-accent ring-accent/20",
  success: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
  danger: "bg-rose-500/15 text-rose-300 ring-rose-400/20",
  neutral: "bg-white/5 text-slate-300 ring-white/10"
} as const;

export function Badge({
  children,
  variant = "neutral",
  className
}: {
  children: React.ReactNode;
  variant?: keyof typeof badgeClasses;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1",
        badgeClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
