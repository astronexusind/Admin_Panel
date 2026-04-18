import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function StatCard({
  label,
  value,
  helper,
  trend,
  currency
}: {
  label: string;
  value: number;
  helper: string;
  trend?: number;
  currency?: boolean;
}) {
  const positive = (trend ?? 0) >= 0;

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm text-slate-400">{label}</p>
            <h3 className="text-3xl font-semibold text-white">
              {currency ? formatCurrency(value) : formatNumber(value)}
            </h3>
          </div>
          {typeof trend === "number" ? (
            <div
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                positive ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
              }`}
            >
              {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {Math.abs(trend).toFixed(1)}%
            </div>
          ) : null}
        </div>
        <p className="text-sm text-slate-400">{helper}</p>
      </CardContent>
    </Card>
  );
}
