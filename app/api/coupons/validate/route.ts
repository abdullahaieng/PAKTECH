import { validateCoupon, calculateDiscount } from "@/lib/services/coupon-service";
import { ok, fail } from "@/lib/api/response";

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();
    if (!code) return fail("Coupon code required");
    const coupon = validateCoupon(code);
    if (!coupon) return fail("Invalid coupon code");
    const discount = subtotal ? calculateDiscount(subtotal, coupon.discount) : 0;
    return ok({ coupon, discount });
  } catch {
    return fail("Invalid request");
  }
}
