"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";

import { useAuthStore } from "@/store/auth-store";
import { useThemeStore } from "@/store/theme-store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const syncFromStorage = useAuthStore((state) => state.syncFromStorage);
  const syncThemeFromStorage = useThemeStore((state) => state.syncFromStorage);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    syncFromStorage();
    syncThemeFromStorage();

    const handleStorage = () => {
      syncFromStorage();
      syncThemeFromStorage();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [syncFromStorage, syncThemeFromStorage]);

  return (
    <>
      {children}
      <Toaster
        closeButton
        richColors
        position="top-right"
        theme={theme === "light" ? "light" : "dark"}
        toastOptions={{
          classNames: {
            toast: "!border !border-white/10 !bg-card !text-foreground",
            description: theme === "light" ? "!text-slate-600" : "!text-slate-400",
            actionButton: "!bg-primary !text-white",
            cancelButton: theme === "light" ? "!bg-slate-100 !text-slate-700" : "!bg-white/10 !text-slate-100"
          }
        }}
      />
    </>
  );
}
