"use client";

import { LogOut, Menu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { logoutAdmin } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/response-utils";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";

export function Topbar() {
  const router = useRouter();
  const admin = useAuthStore((state) => state.admin);
  const clearSession = useAuthStore((state) => state.clearSession);
  const toggleMobileSidebar = useUIStore((state) => state.toggleMobileSidebar);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Backend logout failed, clearing local session."));
    } finally {
      clearSession();
      router.replace("/login");
    }
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-background/60 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-2xl lg:hidden" onClick={toggleMobileSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="AstroNexus" width={40} height={40} className="h-10 w-10 rounded-md object-cover" />
          <div className="hidden sm:block">
            <p className="text-sm text-slate-500">AstroNexus Admin</p>
            <h2 className="text-lg font-semibold text-white">Workspace overview</h2>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeSwitcher compact />
        <div className="hidden items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-3 py-2 md:flex">
          <Avatar name={admin?.name} />
          <div>
            <p className="text-sm font-medium text-white">{admin?.name ?? "Astro Admin"}</p>
            <p className="text-xs text-slate-500">{admin?.email ?? "admin@astronexus.ai"}</p>
          </div>
        </div>
        <Button variant="danger-outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
