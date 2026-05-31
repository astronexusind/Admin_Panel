"use client";

import { MoonStar, SunMedium } from "lucide-react";

import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/theme-store";

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const isLight = theme === "light";
  const toggleTheme = () => {
    setTheme(isLight ? "dark" : "light");
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
      onClick={toggleTheme}
      title={`Current theme: ${isLight ? "Light" : "Dark"}`}
      className={cn(
        "group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-left transition-all",
        "hover:border-white/20 hover:bg-white/10 active:scale-[0.98]",
        compact ? "min-w-[100px]" : "min-w-[128px]"
      )}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-300 transition group-hover:text-white">
        {isLight ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium uppercase tracking-[0.24em] text-slate-500">Theme</span>
        <span className="block text-sm font-semibold text-white">{isLight ? "Light" : "Dark"}</span>
      </span>
      <span
        className={cn(
          "relative flex h-7 w-12 items-center rounded-full border p-1 transition-colors",
          isLight ? "border-amber-400/30 bg-amber-400/20" : "border-slate-700 bg-slate-900/80"
        )}
        aria-hidden="true"
      >
        <span
          className={cn(
            "h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            isLight ? "translate-x-5" : "translate-x-0"
          )}
        />
      </span>
    </button>
  );
}
