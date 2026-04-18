"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { loginAdmin } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/response-utils";
import { loginSchema, type LoginFormValues } from "@/lib/schemas";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.token);
  const [pending, setPending] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    if (hydrated && token) {
      router.replace("/dashboard");
    }
  }, [hydrated, router, token]);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      setPending(true);
      const result = await loginAdmin(values);
      setSession({
        token: result.token,
        admin: result.admin
      });
      toast.success(result.message);
      router.replace(searchParams.get("next") || "/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to sign in with those credentials."));
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeSwitcher />
      </div>
      <div className="orb left-[-140px] top-[10%] h-56 w-56 bg-primary/15" />
      <div className="orb bottom-[-100px] right-[-100px] h-60 w-60 bg-accent/10" />

      <Card className="w-full max-w-md border-white/15 bg-card/95 shadow-[0_20px_50px_rgba(2,8,23,0.55)]">
        <CardContent className="p-7 sm:p-8">
          <div className="mb-7 flex flex-col items-center space-y-4 text-center">
            <Image src="/logo.png" alt="AstroNexus logo" width={120} height={120} priority className="h-24 w-24" />
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/5 px-3 py-1 text-xs text-slate-300">
                <Sparkles className="h-3.5 w-3.5" />
                Astrology Admin
              </div>
              <h1 className="text-3xl font-semibold text-white">Sign in to AstroNexus</h1>
            </div>
          </div>

          <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
              <Input type="email" placeholder="admin@example.com" {...form.register("email")} />
              {form.formState.errors.email ? (
                <p className="mt-2 text-sm text-rose-300">{form.formState.errors.email.message}</p>
              ) : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
              <Input type="password" placeholder="Enter your password" {...form.register("password")} />
              {form.formState.errors.password ? (
                <p className="mt-2 text-sm text-rose-300">{form.formState.errors.password.message}</p>
              ) : null}
            </div>

            <Button type="submit" className="w-full text-white" size="lg" disabled={pending}>
              {pending ? "Signing in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
