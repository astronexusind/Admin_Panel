"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hydrated, pathname, router, token]);

  if (!hydrated || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass-panel flex items-center gap-3 px-6 py-4">
          <div className="h-3 w-3 animate-pulse rounded-full bg-primary" />
          <span className="text-sm text-slate-300">Securing the admin constellation...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
