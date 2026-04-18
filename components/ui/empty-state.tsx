import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="border-dashed border-white/10">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="max-w-lg text-sm text-slate-400">{description}</p>
        </div>
        {action ?? <Button variant="secondary">Refresh</Button>}
      </CardContent>
    </Card>
  );
}
