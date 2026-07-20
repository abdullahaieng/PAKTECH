"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/store/cart-store";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/notification-provider";
import { formatPrice, getEffectivePrice } from "@/lib/format";
import { PROVINCES } from "@/lib/constants";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(11, "Valid phone number required"),
  address: z.string().min(10, "Complete address required"),
  city: z.string().min(2, "City required"),
  province: z.string().min(1, "Province required"),
  postalCode: z.string().optional(),
  paymentMethod: z.enum(["cod", "card"]),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getShipping = useCartStore((s) => s.getShipping);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const couponCode = useCartStore((s) => s.couponCode);
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cod",
      province: "Punjab",
      firstName: user?.name.split(" ")[0] ?? "",
      lastName: user?.name.split(" ").slice(1).join(" ") ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        paymentMethod: "cod",
        province: "Punjab",
        firstName: user.name.split(" ")[0] ?? "",
        lastName: user.name.split(" ").slice(1).join(" ") ?? "",
        email: user.email,
        phone: user.phone ?? "",
      });
    }
  }, [user, reset]);

  if (items.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No items to checkout</h1>
        <Button asChild><Link href="/shop">Go to Shop</Link></Button>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          couponCode: couponCode ?? undefined,
          ...data,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        toast(json.error ?? "Order failed", "error");
        return;
      }
      clearCart();
      toast(`Order ${json.data.orderNumber} placed! Hum jald contact karenge.`, "success", {
        title: "Order Confirmed",
        persist: true,
        href: "/account",
      });
      router.push("/account");
    } catch {
      toast("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className="container-custom py-8">
      <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} className="mb-6" />
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-xl border p-6">
            <h2 className="font-semibold text-lg mb-4">Billing Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register("firstName")} className="mt-1" />
                {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register("lastName")} className="mt-1" />
                {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} className="mt-1" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="03XX XXXXXXX" {...register("phone")} className="mt-1" />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
              </div>
            </div>
          </section>

          <section className="rounded-xl border p-6">
            <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Complete Address</Label>
                <Input id="address" {...register("address")} className="mt-1" />
                {errors.address && <p className="text-xs text-destructive mt-1">{errors.address.message}</p>}
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register("city")} className="mt-1" />
                  {errors.city && <p className="text-xs text-destructive mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <Label>Province</Label>
                  <Select defaultValue="Punjab" onValueChange={(v) => setValue("province", v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" {...register("postalCode")} className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Order Notes (optional)</Label>
                <Input id="notes" placeholder="Delivery instructions..." {...register("notes")} className="mt-1" />
              </div>
            </div>
          </section>

          <section className="rounded-xl border p-6">
            <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
            <RadioGroup
              defaultValue="cod"
              onValueChange={(v) => setValue("paymentMethod", v as "cod" | "card")}
              className="space-y-3"
            >
              <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-secondary/50 transition-colors">
                <RadioGroupItem value="cod" />
                <div>
                  <p className="font-medium">Cash on Delivery (COD)</p>
                  <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-secondary/50 transition-colors opacity-60">
                <RadioGroupItem value="card" disabled />
                <div>
                  <p className="font-medium">Credit/Debit Card</p>
                  <p className="text-sm text-muted-foreground">Coming soon</p>
                </div>
              </label>
            </RadioGroup>
          </section>
        </div>

        <div className="rounded-xl border p-6 h-fit sticky top-24">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="line-clamp-1 flex-1 mr-2">{item.product.name} x{item.quantity}</span>
                <span className="shrink-0">
                  {formatPrice(getEffectivePrice(item.product.price, item.product.salePrice) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
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
          <Button type="submit" className="w-full mt-6" variant="accent" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
