import { createOrder, getOrdersByEmail } from "@/lib/services/order-service";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getUserById } from "@/lib/services/user-service";
import { ok, fail } from "@/lib/api/response";
import type { CheckoutFormData } from "@/types";
import { sendOrderConfirmation } from "@/lib/email/service";

export async function GET(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) return fail("Authentication required", 401);

  const user = getUserById(session.userId);
  if (!user) return fail("User not found", 404);

  return ok(getOrdersByEmail(user.email));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, couponCode, ...shippingAddress } = body as {
      items: { productId: string; quantity: number }[];
      couponCode?: string;
    } & CheckoutFormData;

    if (!items?.length) return fail("Cart is empty");

    const session = getSessionFromRequest(request);
    const result = await createOrder({
      items,
      couponCode,
      shippingAddress: shippingAddress as CheckoutFormData,
      userId: session?.userId,
    });

    if ("error" in result) return fail(result.error);
    // Send order confirmation email (best-effort)
    try {
      const email = result.order.shippingAddress.email;
      const html = `<h1>Order ${result.order.orderNumber}</h1><p>Thank you for your order. Total: ${result.order.total}</p>`;
      await sendOrderConfirmation(email, result.order.orderNumber, html);
    } catch (e) {
      console.error("[orders] email send failed", e);
    }

    return ok(result.order, 201);
  } catch (err) {
    console.error("[orders] create failed:", err);
    return fail(err instanceof Error ? err.message : "Failed to create order", 500);
  }
}
