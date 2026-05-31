"use client";

import menu from "@/config/menu.json";
import {
  BadgePercent,
  FileText,
  Layers3,
  LayoutDashboard,
  MessageSquare,
  Package,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Users,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

const iconMap = {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Layers3,
  FileText,
  BadgePercent,
  MessageSquare,
  Sparkles,
  ShieldCheck
};

export function Sidebar() {
  const pathname = usePathname();
  const mobileSidebarOpen = useUIStore((state) => state.mobileSidebarOpen);
  const setMobileSidebarOpen = useUIStore((state) => state.setMobileSidebarOpen);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-background/70 backdrop-blur-sm lg:hidden",
          mobileSidebarOpen ? "block" : "hidden"
        )}
        onClick={() => setMobileSidebarOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-border bg-card/95 px-4 py-5 transition-transform duration-300 lg:translate-x-0",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <img src="/logo.png" alt="AstroNexus" className="h-10 w-10 rounded-md object-cover" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">AstroNexus</p>
              <p className="text-xs text-slate-400">Admin workspace</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-5 px-2">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Navigation</p>
        </div>

        <nav className="mt-2 flex-1 space-y-1 overflow-y-auto pr-1">
          {menu.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] ?? LayoutDashboard;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors duration-200",
                  active
                      ? "border-primary/30 bg-primary/10"
                      : "border-transparent bg-transparent hover:border-border hover:bg-white/5"
                )}
              >
                <div
                  className={cn(
                      "rounded-lg p-2",
                      active ? "bg-primary/15 text-primary" : "bg-white/5 text-slate-400 group-hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <p className={cn("flex-1 text-sm font-medium", active ? "text-white" : "text-slate-200")}>{item.label}</p>
              </Link>
            );
          })}
        </nav>

      </aside>
    </>
  );
}
