"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/account/auth-card";
import { useToast } from "@/components/providers/notification-provider";

const schema = z.object({
  password: z.string().min(6, "At least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function ResetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();
  const form = useForm({ resolver: zodResolver(schema) });

  if (!token) {
    return (
      <AuthCard title="Invalid Link" subtitle="This reset link has expired or is invalid">
        <Link href="/account/forgot-password" className="text-primary text-sm hover:underline">
          Request a new reset link
        </Link>
      </AuthCard>
    );
  }

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });
      const json = await res.json();
      if (!json.success) {
        toast(json.error ?? "Reset failed", "error");
        return;
      }
      toast("Password reset successfully! Please sign in.", "success");
      router.push("/account/login");
    } catch {
      toast("Something went wrong", "error");
    }
  };

  return (
    <AuthCard title="New Password" subtitle="Set your new password">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex justify-center mb-2">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div>
          <Label htmlFor="password">New Password</Label>
          <Input id="password" type="password" {...form.register("password")} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input id="confirm" type="password" {...form.register("confirmPassword")} className="mt-1" />
          {form.formState.errors.confirmPassword && (
            <p className="text-xs text-destructive mt-1">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" variant="accent" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Reset Password"}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="container-custom py-8">
      <Breadcrumbs items={[{ label: "Account" }, { label: "Reset Password" }]} className="mb-6" />
      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <ResetContent />
      </Suspense>
    </div>
  );
}
