"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AuthCard } from "@/components/account/auth-card";
import { GoogleSignInButton } from "@/components/account/google-sign-in-button";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/notification-provider";
import { signInWithEmail } from "@/lib/firebase/auth-actions";
import { saveAuth } from "@/lib/admin/auth";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const errorMessages: Record<string, string> = {
  google_not_configured: "Google login is not configured yet. Please sign in with email.",
  google_cancelled: "Google sign-in was cancelled.",
  google_failed: "Google sign-in failed. Please try again.",
  invalid_state: "Security error. Please try again.",
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refresh, firebaseEnabled } = useAuth();
  const { toast } = useToast();
  const form = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (user) {
      const redirect = searchParams.get("redirect");
      router.replace(redirect && !redirect.startsWith("/admin") ? redirect : "/account");
    }
  }, [user, router, searchParams]);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error && errorMessages[error]) toast(errorMessages[error], "error");
  }, [searchParams, toast]);

  const onSubmit = async (data: LoginForm) => {
    try {
      const adminRes = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const adminJson = await adminRes.json();
      if (adminJson.success) {
        saveAuth(adminJson.data.token, adminJson.data.email);
        toast("Welcome, Admin!", "success");
        const redirect = searchParams.get("redirect");
        router.push(redirect?.startsWith("/admin") ? redirect : "/admin/dashboard");
        return;
      }

      if (firebaseEnabled) {
        await signInWithEmail(data.email, data.password);
        await refresh();
        toast("Welcome back!", "success");
        const redirect = searchParams.get("redirect");
        router.push(redirect && !redirect.startsWith("/admin") ? redirect : "/account");
        return;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) {
        toast(json.error ?? "Login failed", "error");
        return;
      }
      await refresh();
      toast("Welcome back!", "success");
      const redirect = searchParams.get("redirect");
      router.push(redirect && !redirect.startsWith("/admin") ? redirect : "/account");
    } catch {
      toast("Something went wrong", "error");
    }
  };

  return (
    <div className="container-custom py-8">
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: "Login" }]} className="mb-6" />
      <AuthCard title="Welcome Back" subtitle="Sign in to your account">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} className="mt-1" />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/account/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" {...form.register("password")} className="mt-1" />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" variant="accent" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
            OR
          </span>
        </div>

        <GoogleSignInButton />

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/account/register" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-custom py-16 text-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
