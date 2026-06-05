"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/components/providers/notification-provider";
import { formatPrice, getEffectivePrice } from "@/lib/format";
import { useState } from "react";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getShipping = useCartStore((s) => s.getShipping);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const getTotal = useCartStore((s) => s.getTotal);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const couponCode = useCartStore((s) => s.couponCode);
  const { toast } = useToast();
  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = () => {
    if (applyCoupon(couponInput)) {
      toast(`Coupon applied!`, "success");
    } else {
      toast("Invalid coupon. Try: PAKTECH10, WELCOME15, FLASH20", "error");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/30 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added anything yet.</p>
        <Button asChild variant="accent" size="lg">
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <Breadcrumbs items={[{ label: "Cart" }]} className="mb-6" />
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 rounded-xl border p-4">
              <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-secondary">
                <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.product.slug}`} className="font-medium hover:text-accent line-clamp-2">
                  {item.product.name}
                </Link>
                <p className="text-sm text-muted-foreground mt-0.5">{item.product.brand}</p>
                <p className="font-semibold mt-2">
                  {formatPrice(getEffectivePrice(item.product.price, item.product.salePrice))}
                </p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => removeItem(item.product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-6 h-fit sticky top-24">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>

          <div className="flex gap-2 mb-4">
            <Input placeholder="Coupon code" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} disabled={!!couponCode} />
            <Button variant="outline" onClick={handleApplyCoupon} disabled={!!couponCode}>Apply</Button>
          </div>
          {couponCode && <p className="text-xs text-green-600 mb-4">Coupon {couponCode} applied!</p>}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(getSubtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{getShipping() === 0 ? "FREE" : formatPrice(getShipping())}</span>
            </div>
            {getDiscount() > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(getDiscount())}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
          </div>

          <Button className="w-full mt-6" variant="accent" size="lg" asChild>
            <Link href="/checkout">Proceed to Checkout <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button className="w-full mt-2" variant="outline" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
