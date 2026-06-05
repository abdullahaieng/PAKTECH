"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, Package, Settings } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuth } from "@/components/providers/auth-provider";
import { formatPrice, getEffectivePrice, formatDate } from "@/lib/format";
import type { Order } from "@/types";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const wishlistItems = useWishlistStore((s) => s.items);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/account/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    fetch("/api/orders")
      .then((r) => r.json())
      .then((json) => { if (json.success) setOrders(json.data); })
      .finally(() => setOrdersLoading(false));
  }, [user]);

  if (loading || !user) {
    return <div className="container-custom py-16 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="container-custom py-8">
      <Breadcrumbs items={[{ label: "Account" }]} className="mb-6" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-14 w-14 rounded-full border-2 border-primary/20" />
          ) : (
            <div className="h-14 w-14 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">Hello, {user.name.split(" ")[0]}!</h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/account/settings"><Settings className="h-4 w-4 mr-1" /> Account Settings</Link>
        </Button>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders"><Package className="h-4 w-4 mr-1" /> Orders</TabsTrigger>
          <TabsTrigger value="wishlist"><Heart className="h-4 w-4 mr-1" /> Wishlist ({wishlistItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          {ordersLoading ? (
            <p className="text-muted-foreground text-center py-8">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 rounded-xl border">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-medium">No orders yet</p>
              <Button className="mt-4" asChild><Link href="/shop">Start Shopping</Link></Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-shadow">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)} &middot; {order.items.length} item(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                      order.status === "delivered" ? "bg-green-100 text-green-700" :
                      order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                      order.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.status}
                    </span>
                    <span className="font-semibold">{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="wishlist" className="mt-6">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12 rounded-xl border">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-medium">Wishlist is empty</p>
              <Button className="mt-4" asChild><Link href="/shop">Browse Products</Link></Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistItems.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="flex gap-3 rounded-xl border p-3 hover:shadow-md transition-shadow">
                  <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-secondary">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                    <p className="text-sm font-semibold mt-1">
                      {formatPrice(getEffectivePrice(product.price, product.salePrice))}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
