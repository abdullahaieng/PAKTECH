"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Settings, LogOut, User } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/notification-provider";

const profileSchema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading, logout, refresh } = useAuth();
  const { toast } = useToast();

  const profileForm = useForm({ resolver: zodResolver(profileSchema) });
  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    if (!loading && !user) router.replace("/account/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      profileForm.reset({ name: user.name, phone: user.phone ?? "" });
    }
  }, [user, profileForm]);

  if (loading || !user) return <div className="container-custom py-16 text-center">Loading...</div>;

  const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      profileForm.clearErrors("root");

      // Trim phone number
      const payload = {
        name: data.name?.trim(),
        phone: data.phone?.trim() || undefined,
      };

      console.log("[settings] Sending profile update:", payload);

      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      console.log("[settings] Profile update response:", json);

      if (!json.success) {
        console.error("[settings] Update failed:", json.error);
        toast(json.error ?? "Update failed", "error");
        profileForm.setError("root", { message: json.error });
        return;
      }

      await refresh();
      toast("Profile updated successfully!", "success");
      console.log("[settings] Profile updated successfully");
    } catch (error) {
      console.error("[settings] Update error:", error);
      toast("Something went wrong", "error");
      profileForm.setError("root", { 
        message: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  };

  const onPasswordSubmit = async (data: z.infer<typeof passwordSchema>) => {
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        toast(json.error ?? "Failed", "error");
        return;
      }
      passwordForm.reset();
      toast("Password changed successfully!", "success");
    } catch {
      toast("Something went wrong", "error");
    }
  };

  return (
    <div className="container-custom py-8 max-w-2xl">
      <Breadcrumbs items={[{ label: "Account", href: "/account" }, { label: "Settings" }]} className="mb-6" />

      <div className="flex items-center gap-3 mb-8">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full border object-cover"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-7 w-7 text-primary" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground text-sm">{user.email}</p>
          <span className="text-xs capitalize px-2 py-0.5 rounded-full bg-muted mt-1 inline-block">
            {user.provider} account
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl border p-6">
          <h2 className="font-semibold flex items-center gap-2 mb-4">
            <Settings className="h-4 w-4" /> Profile Settings
          </h2>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            {profileForm.formState.errors.root && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {profileForm.formState.errors.root.message}
              </div>
            )}
            <div>
              <Label>Email</Label>
              <Input value={user.email} disabled className="mt-1 bg-muted" />
            </div>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...profileForm.register("name")} className="mt-1" />
              {profileForm.formState.errors.name && (
                <p className="text-xs text-red-600 mt-1">{profileForm.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                placeholder="03XX XXXXXXX"
                {...profileForm.register("phone")} 
                className="mt-1" 
              />
              {profileForm.formState.errors.phone && (
                <p className="text-xs text-red-600 mt-1">{profileForm.formState.errors.phone.message}</p>
              )}
            </div>
            <Button type="submit" variant="accent" disabled={profileForm.formState.isSubmitting}>
              Save Profile
            </Button>
          </form>
        </section>

        {user.hasPassword && (
          <section className="rounded-xl border p-6">
            <h2 className="font-semibold mb-4">Change Password</h2>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input type="password" {...passwordForm.register("currentPassword")} className="mt-1" />
              </div>
              <div>
                <Label>New Password</Label>
                <Input type="password" {...passwordForm.register("newPassword")} className="mt-1" />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input type="password" {...passwordForm.register("confirmPassword")} className="mt-1" />
              </div>
              <Button type="submit" variant="outline">Update Password</Button>
            </form>
          </section>
        )}

        {!user.hasPassword && user.provider === "google" && (
          <section className="rounded-xl border p-6 bg-muted/30">
            <p className="text-sm text-muted-foreground">
              You signed in with Google. To set a password, use{" "}
              <Link href="/account/forgot-password" className="text-primary hover:underline">Forgot Password</Link>.
            </p>
          </section>
        )}

        <Separator />

        <div className="flex items-center justify-between">
          <Link href="/account" className="text-sm text-primary hover:underline">← Back to Account</Link>
          <Button variant="outline" onClick={logout} className="text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
