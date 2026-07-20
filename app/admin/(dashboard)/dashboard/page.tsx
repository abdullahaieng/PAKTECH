"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Package, Users, AlertTriangle, DollarSign } from "lucide-react";
import { api, type DashboardStats } from "@/lib/admin/api";
import { StatsCard } from "@/components/admin/stats-card";
import { formatPrice } from "@/lib/format";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-[var(--admin-muted)]">Loading dashboard...</p>;
  if (!stats) return <p className="text-red-500">Failed to load stats.</p>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-[var(--admin-muted)] mt-1">Store overview and recent activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Revenue" value={formatPrice(stats.totalRevenue)} icon={DollarSign} variant="success" />
        <StatsCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} trend={`${stats.pendingOrders} pending`} />
        <StatsCard title="Products" value={stats.totalProducts} icon={Package} trend={`${stats.lowStockProducts} low stock`} variant={stats.lowStockProducts > 0 ? "warning" : "default"} />
        <StatsCard title="Customers" value={stats.totalCustomers} icon={Users} />
      </div>

      {stats.lowStockProducts > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>{stats.lowStockProducts} products</strong> are low on stock.{" "}
            <Link href="/admin/products" className="underline font-medium">Check products</Link>
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[var(--admin-border)]">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-indigo-600 hover:underline">View all</Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="p-8 text-center text-[var(--admin-muted)]">No orders yet</p>
        ) : (
          <div className="divide-y">
            {stats.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-[var(--admin-muted)]">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatPrice(order.total)}</p>
                  <span className="text-xs capitalize px-2 py-0.5 rounded-full bg-slate-100">{order.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
