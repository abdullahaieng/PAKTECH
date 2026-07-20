import type { CheckoutFormData, Order, OrderLineItem, OrderStatus } from "@/types";
import { getDatabase, commitDatabaseUpdate } from "@/lib/db/store";
import { getEffectivePrice } from "@/lib/format";
import { validateCoupon, calculateDiscount } from "./coupon-service";

interface CreateOrderInput {
  items: { productId: string; quantity: number }[];
  couponCode?: string;
  shippingAddress: CheckoutFormData;
  userId?: string;
}

function generateOrderNumber(): string {
  const count = getDatabase().orders.length + 1;
  const year = new Date().getFullYear();
  return `PT-${year}-${String(count).padStart(4, "0")}`;
}

export function getAllOrders(): Order[] {
  return getDatabase().orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrderById(id: string): Order | undefined {
  return getDatabase().orders.find((o) => o.id === id);
}

export function getOrdersByEmail(email: string): Order[] {
  return getAllOrders().filter(
    (o) => o.shippingAddress.email.toLowerCase() === email.toLowerCase()
  );
}

export async function createOrder(input: CreateOrderInput): Promise<{ order: Order } | { error: string }> {
  const db = getDatabase();
  const lineItems: OrderLineItem[] = [];
  let subtotal = 0;

  for (const item of input.items) {
    const product = db.products.find((p) => p.id === item.productId);
    if (!product) return { error: `Product not found: ${item.productId}` };
    if (product.stock < item.quantity) {
      return { error: `${product.name} is out of stock (only ${product.stock} left)` };
    }

    const price = getEffectivePrice(product.price, product.salePrice);
    lineItems.push({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.images[0],
      price,
      quantity: item.quantity,
    });
    subtotal += price * item.quantity;
  }

  if (lineItems.length === 0) return { error: "Cart is empty" };

  const coupon = input.couponCode ? validateCoupon(input.couponCode) : null;
  if (input.couponCode && !coupon) return { error: "Invalid coupon code" };

  const discount = coupon ? calculateDiscount(subtotal, coupon.discount) : 0;
  const shipping = 0;
  const total = subtotal + shipping - discount;

  const order: Order = {
    id: `order-${Date.now()}`,
    orderNumber: generateOrderNumber(),
    userId: input.userId,
    createdAt: new Date().toISOString(),
    status: "pending",
    items: lineItems,
    subtotal,
    shipping,
    discount,
    total,
    couponCode: coupon?.code,
    shippingAddress: {
      firstName: input.shippingAddress.firstName,
      lastName: input.shippingAddress.lastName,
      email: input.shippingAddress.email,
      phone: input.shippingAddress.phone,
      address: input.shippingAddress.address,
      city: input.shippingAddress.city,
      province: input.shippingAddress.province,
      postalCode: input.shippingAddress.postalCode,
    },
    paymentMethod: input.shippingAddress.paymentMethod,
    notes: input.shippingAddress.notes,
  };

  await commitDatabaseUpdate((db) => {
    for (const item of lineItems) {
      const product = db.products.find((p) => p.id === item.productId);
      if (product) product.stock -= item.quantity;
    }
    db.orders.unshift(order);
  });

  return { order };
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  let updated: Order | null = null;
  await commitDatabaseUpdate((db) => {
    const order = db.orders.find((o) => o.id === id);
    if (!order) return;
    order.status = status;
    updated = order;
  });
  return updated;
}

export async function deleteOrder(id: string): Promise<boolean> {
  let deleted = false;
  await commitDatabaseUpdate((db) => {
    const index = db.orders.findIndex((o) => o.id === id);
    if (index === -1) return;
    const order = db.orders[index];

    if (order.status !== "cancelled") {
      for (const item of order.items) {
        const product = db.products.find((p) => p.id === item.productId);
        if (product) product.stock += item.quantity;
      }
    }

    db.orders.splice(index, 1);
    deleted = true;
  });
  return deleted;
}

export async function cancelOrder(id: string): Promise<Order | null> {
  let cancelled: Order | null = null;
  await commitDatabaseUpdate((db) => {
    const order = db.orders.find((o) => o.id === id);
    if (!order || order.status === "cancelled") return;

    for (const item of order.items) {
      const product = db.products.find((p) => p.id === item.productId);
      if (product) product.stock += item.quantity;
    }
    order.status = "cancelled";
    cancelled = order;
  });
  return cancelled;
}
