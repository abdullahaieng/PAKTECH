import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AdminSidebar />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
