import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export function Avatar({
  name,
  src,
  className
}: {
  name?: string | null;
  src?: string | null;
  className?: string;
}) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <div
      className={cn(
        "flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-white",
        className
      )}
      aria-label={name ? `${name} avatar` : "User avatar"}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name ?? "avatar"} className="h-full w-full object-cover" />
      ) : initials ? (
        <span className="text-sm font-medium">{initials}</span>
      ) : (
        <UserRound className="h-4 w-4" />
      )}
    </div>
  );
}
