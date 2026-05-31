"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PiePoint } from "@/lib/types";

const colors = ["#8B5CF6", "#F59E0B", "#10B981", "#38BDF8", "#F43F5E"];

export function OrderStatusChart({ data }: { data: PiePoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Constellation</CardTitle>
        <CardDescription>Status distribution across the current order pipeline.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2 items-center">
        <div className="h-[280px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="50%"
                outerRadius="80%"
                paddingAngle={2}
                labelLine={false}
                isAnimationActive={false}
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(2, 6, 23, 0.96)",
                  border: "1px solid rgba(148, 163, 184, 0.14)",
                  borderRadius: 18
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {data.map((entry, index) => (
            <div
              key={entry.name}
              className="flex items-center justify-between rounded-lg border border-white/6 bg-card/60 px-4 py-3"
              style={{ gap: 12 }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm text-slate-200">{entry.name}</span>
              </div>
              <span className="text-sm font-medium text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
