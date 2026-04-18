import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SummaryTone = "primary" | "accent" | "success" | "danger" | "neutral";

const toneClasses: Record<SummaryTone, string> = {
  primary: "from-primary/18 to-primary/5 text-primary",
  accent: "from-accent/18 to-accent/5 text-accent",
  success: "from-emerald-500/18 to-emerald-500/5 text-emerald-300",
  danger: "from-rose-500/18 to-rose-500/5 text-rose-300",
  neutral: "from-white/10 to-white/5 text-slate-300"
};

export type SummaryCardItem = {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  tone?: SummaryTone;
};

export function SummaryCards({ items, showHelper = true }: { items: SummaryCardItem[]; showHelper?: boolean }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.label} className="overflow-hidden">
            <CardContent className="p-0">
              <div className={cn("h-1 w-full bg-gradient-to-r", toneClasses[item.tone ?? "neutral"])} />
              <div className="flex items-start justify-between gap-4 p-5">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                  {showHelper ? <p className="text-sm leading-6 text-slate-400">{item.helper}</p> : null}
                </div>
                <div
                  className={cn(
                    "rounded-2xl border border-white/10 bg-gradient-to-br p-3",
                    toneClasses[item.tone ?? "neutral"]
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
