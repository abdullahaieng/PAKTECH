"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Eye } from "lucide-react";
import { api, type Order } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => {
    setLoading(true);
    api.getOrders().then(setOrders).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.updateOrderStatus(id, status);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order? Stock will be restored.")) return;
    try {
      await api.deleteOrder(id);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-[var(--muted)] mt-1">{orders.length} total orders</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-[var(--muted)]">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-[var(--muted)]">No orders found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-[var(--muted)]">Order</th>
                <th className="text-left p-4 font-medium text-[var(--muted)]">Customer</th>
                <th className="text-left p-4 font-medium text-[var(--muted)]">Date</th>
                <th className="text-left p-4 font-medium text-[var(--muted)]">Total</th>
                <th className="text-left p-4 font-medium text-[var(--muted)]">Status</th>
                <th className="text-right p-4 font-medium text-[var(--muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium">{order.orderNumber}</td>
                  <td className="p-4">
                    <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p className="text-xs text-[var(--muted)]">{order.shippingAddress.email}</p>
                  </td>
                  <td className="p-4 text-[var(--muted)]">
                    {new Date(order.createdAt).toLocaleDateString("en-PK")}
                  </td>
                  <td className="p-4 font-semibold">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 capitalize cursor-pointer ${statusColors[order.status] ?? ""}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/orders/${order.id}`} className="p-1.5 rounded hover:bg-slate-100 text-[var(--muted)]">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleDelete(order.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
