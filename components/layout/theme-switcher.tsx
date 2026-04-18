"use client";

import { Check, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getThemeMeta, themeOptions } from "@/lib/theme";
import { useThemeStore } from "@/store/theme-store";

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const cycleTheme = useThemeStore((state) => state.cycleTheme);
  const activeTheme = getThemeMeta(theme);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <Button
        variant="outline"
        className={cn("rounded-2xl", compact ? "px-3" : "px-4")}
        onClick={() => setOpen((current) => !current)}
        onDoubleClick={cycleTheme}
        title="Theme controls"
      >
        <Palette className="h-4 w-4" />
        <span className={cn("hidden md:inline", compact && "md:hidden")}>{activeTheme.label}</span>
      </Button>

      {open ? (
        <div className="absolute right-0 z-50 mt-3 w-[320px] rounded-[28px] border border-white/10 bg-card/95 p-3 shadow-card backdrop-blur-xl">
          <div className="px-3 pb-3">
            <p className="text-sm font-semibold text-white">Theme mode</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Select Dark or Light mode for the full admin panel.
            </p>
          </div>
          <div className="space-y-2">
            {themeOptions.map((option) => {
              const active = option.id === theme;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setTheme(option.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-3xl border px-3 py-3 text-left transition",
                    active
                      ? "border-primary/30 bg-primary/10"
                      : "border-transparent bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.05]"
                  )}
                >
                  <div className={cn("h-10 w-10 rounded-2xl bg-gradient-to-br", option.previewClassName)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{option.label}</p>
                    <p className="text-xs leading-5 text-slate-500">{option.description}</p>
                  </div>
                  {active ? <Check className="h-4 w-4 text-primary" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
