"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getStoredToken } from "@/lib/storage";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = getStoredToken();
    router.replace(token ? "/dashboard" : "/login");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="glass-panel flex items-center gap-4 px-6 py-4">
        <Image src="/logo.png" alt="AstroNexus logo" width={44} height={44} className="h-11 w-11" priority />
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 animate-pulse rounded-full bg-primary" />
          <span className="text-sm font-medium text-slate-200">Routing to AstroNexus workspace...</span>
        </div>
      </div>
    </main>
  );
}
