import type { Metadata } from "next";
import { AdminAuthGuard } from "@/components/admin/auth-guard";

export const metadata: Metadata = {
  title: "PakTech Admin",
  description: "PakTech store management dashboard",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-panel min-h-screen bg-[var(--admin-background)] text-[var(--admin-foreground)]">
      <AdminAuthGuard>{children}</AdminAuthGuard>
    </div>
  );
}
