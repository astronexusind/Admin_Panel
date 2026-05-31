import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <Sidebar />
      <div className="relative z-10 lg:pl-[300px]">
        <Topbar />
        <main className="content-container pb-10 pt-6">{children}</main>
      </div>
    </div>
  );
}
