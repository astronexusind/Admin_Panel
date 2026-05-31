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
    <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        {badge ? <Badge variant="primary">{badge}</Badge> : null}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
