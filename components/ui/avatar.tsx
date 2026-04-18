import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export function Avatar({
  name,
  className
}: {
  name?: string | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white",
        className
      )}
      aria-label={name ? `${name} avatar` : "User avatar"}
    >
      <UserRound className="h-4 w-4" />
    </div>
  );
}
