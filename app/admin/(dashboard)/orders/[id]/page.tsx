"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api, type Order } from "@/lib/admin/api";
import { formatPrice } from "@/lib/format";

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (id) api.getOrder(id).then(setOrder).catch(console.error);
  }, [id]);

  if (!order) return <p className="text-[var(--admin-muted)]">Loading order...</p>;

  const addr = order.shippingAddress;

  return (
    <div>
      <Link href="/admin/orders" className="flex items-center gap-2 text-sm text-[var(--admin-muted)] hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-[var(--admin-muted)] mt-1">
            {new Date(order.createdAt).toLocaleString("en-PK")} &middot; {order.paymentMethod.toUpperCase()}
          </p>
        </div>
        <span className="capitalize px-3 py-1 rounded-full bg-slate-100 text-sm font-medium">{order.status}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-4">Order Items</h2>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.productId} className="flex justify-between py-3">
                  <div>
                    <p className="font-medium text-sm">{item.productName}</p>
                    <p className="text-xs text-[var(--admin-muted)]">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[var(--admin-muted)]">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-[var(--admin-muted)]">Shipping</span><span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-3">Customer</h2>
            <p className="text-sm font-medium">{addr.firstName} {addr.lastName}</p>
            <p className="text-sm text-[var(--admin-muted)]">{addr.email}</p>
            <p className="text-sm text-[var(--admin-muted)]">{addr.phone}</p>
          </div>
          <div className="bg-white rounded-xl border p-5">
            <h2 className="font-semibold mb-3">Shipping Address</h2>
            <p className="text-sm text-[var(--admin-muted)] leading-relaxed">
              {addr.address}<br />
              {addr.city}, {addr.province}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
