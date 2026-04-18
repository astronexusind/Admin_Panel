export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="glass-panel flex items-center gap-3 px-6 py-4">
        <div className="h-3 w-3 animate-pulse rounded-full bg-primary" />
        <span className="text-sm text-slate-300">Loading AstroNexus control room...</span>
      </div>
    </div>
  );
}
