import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="orb left-[-120px] top-[80px] h-64 w-64 bg-primary/20" />
      <div className="orb bottom-[120px] right-[-80px] h-72 w-72 bg-accent/10" />
      <Sidebar />
      <div className="lg:pl-[300px]">
        <Topbar />
        <main className="content-container pb-10 pt-6">{children}</main>
      </div>
    </div>
  );
}
