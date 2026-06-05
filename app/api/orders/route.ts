import { createOrder, getOrdersByEmail } from "@/lib/services/order-service";
import { getSessionFromRequest } from "@/lib/auth/session";
import { getUserById } from "@/lib/services/user-service";
import { ok, fail } from "@/lib/api/response";
import type { CheckoutFormData } from "@/types";

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
    const result = createOrder({
      items,
      couponCode,
      shippingAddress: shippingAddress as CheckoutFormData,
      userId: session?.userId,
    });

    if ("error" in result) return fail(result.error);
    return ok(result.order, 201);
  } catch {
    return fail("Invalid request body");
  }
}
