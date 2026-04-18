import { BrainCircuit, Sparkles, TriangleAlert } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Insight } from "@/lib/types";

const toneStyles = {
  primary: {
    container: "border-primary/20 bg-primary/10",
    icon: "text-primary"
  },
  accent: {
    container: "border-accent/20 bg-accent/10",
    icon: "text-accent"
  },
  danger: {
    container: "border-rose-400/20 bg-rose-500/10",
    icon: "text-rose-300"
  }
} as const;

const iconMap = {
  primary: Sparkles,
  accent: BrainCircuit,
  danger: TriangleAlert
} as const;

export function AIInsightsPanel({ insights }: { insights: Insight[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights Panel</CardTitle>
        <CardDescription>Operational signals blended from inventory, orders, and promotion data.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-3">
        {insights.map((insight) => {
          const Icon = iconMap[insight.tone];
          const styles = toneStyles[insight.tone];

          return (
            <div key={insight.title} className={`rounded-3xl border p-5 ${styles.container}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">{insight.title}</p>
                  <p className="text-2xl font-semibold text-white">{insight.value}</p>
                </div>
                <div className={`rounded-2xl bg-black/20 p-3 ${styles.icon}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{insight.description}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
