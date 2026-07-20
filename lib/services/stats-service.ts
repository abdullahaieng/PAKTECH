import type { DashboardStats } from "@/types";
import { getDatabase } from "@/lib/db/store";

export function getDashboardStats(): DashboardStats {
  const db = getDatabase();
  const orders = db.orders;
  const deliveredOrders = orders.filter((o) => o.status !== "cancelled");

  const registeredUsers = db.users?.length ?? 0;
  const orderEmails = new Set(orders.map((o) => o.shippingAddress.email.toLowerCase()));

  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    totalRevenue: deliveredOrders.reduce((sum, o) => sum + o.total, 0),
    totalProducts: db.products.length,
    lowStockProducts: db.products.filter((p) => p.stock <= 5).length,
    totalCustomers: Math.max(registeredUsers, orderEmails.size),
    recentOrders: orders.slice(0, 5),
  };
}
