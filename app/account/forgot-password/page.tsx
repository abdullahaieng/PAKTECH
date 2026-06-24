"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Mail } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/account/auth-card";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/notification-provider";
import { resetPasswordEmail } from "@/lib/firebase/auth-actions";

const schema = z.object({ email: z.string().email("Valid email required") });

export default function ForgotPasswordPage() {
  const { firebaseEnabled } = useAuth();
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const form = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      if (firebaseEnabled) {
        await resetPasswordEmail(data.email);
        setSent(true);
        toast("Password reset email sent! Check your inbox.", "success");
        return;
      }

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) {
        toast(json.error ?? "Failed", "error");
        return;
      }
      toast(json.data.message, "success");
      if (json.data.resetUrl) setResetUrl(json.data.resetUrl);
    } catch {
      toast("Something went wrong", "error");
    }
  };

  return (
    <div className="container-custom py-8">
      <Breadcrumbs items={[{ label: "Account" }, { label: "Forgot Password" }]} className="mb-6" />
      <AuthCard title="Reset Password" subtitle="We&apos;ll send a reset link to your email">
        {!resetUrl && !sent ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...form.register("email")} className="mt-1" placeholder="you@email.com" />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive mt-1">{String(form.formState.errors.email.message)}</p>
              )}
            </div>
            <Button type="submit" className="w-full" variant="accent" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        ) : sent ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Check your email for a password reset link. If you don&apos;t see it, check your spam folder.
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Development mode: use the reset link below (emails will be sent in production)
            </p>
            <Link href={resetUrl!} className="block text-sm text-primary font-medium break-all hover:underline">
              {resetUrl}
            </Link>
          </div>
        )}
        <Link href="/account/login" className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-6 hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>
      </AuthCard>
    </div>
  );
}
