"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AuthCard } from "@/components/account/auth-card";
import { GoogleSignInButton } from "@/components/account/google-sign-in-button";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/notification-provider";

const registerSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(11, "Valid phone required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { user, refresh } = useAuth();
  const { toast } = useToast();
  const form = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  useEffect(() => {
    if (user) router.replace("/account");
  }, [user, router]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        toast(json.error ?? "Registration failed", "error");
        return;
      }
      await refresh();
      toast("Account created successfully!", "success");
      router.push("/account");
    } catch {
      toast("Something went wrong", "error");
    }
  };

  return (
    <div className="container-custom py-8">
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: "Register" }]} className="mb-6" />
      <AuthCard title="Create Account" subtitle="Create your PakTech account">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...form.register("name")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="03XX XXXXXXX" {...form.register("phone")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
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
            {form.formState.isSubmitting ? "Creating..." : "Create Account"}
          </Button>
        </form>

        <div className="relative my-6">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">OR</span>
        </div>

        <GoogleSignInButton />

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/account/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </AuthCard>
    </div>
  );
}
