import { Badge } from "@/components/ui/badge";

export function PageHeader({
  title,
  description,
  badge,
  actions
}: {
  title: string;
  description: string;
  badge?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        {badge ? <Badge variant="primary">{badge}</Badge> : null}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
          <p className="max-w-2xl text-sm text-slate-400 sm:text-base">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
