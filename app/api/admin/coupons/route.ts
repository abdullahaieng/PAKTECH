import { requireAdmin } from "@/lib/auth/admin-auth";
import { getAllCoupons, createCoupon } from "@/lib/services/coupon-service";
import { ok, unauthorized, fail } from "@/lib/api/response";
import type { Coupon } from "@/types";

export async function GET(request: Request) {
  if (!requireAdmin(request)) return unauthorized();
  return ok(getAllCoupons());
}

export async function POST(request: Request) {
  if (!requireAdmin(request)) return unauthorized();
  try {
    const body = await request.json() as Coupon;
    if (!body.code || !body.discount) return fail("Missing required fields");
    const coupon = createCoupon({ ...body, code: body.code.toUpperCase(), active: body.active ?? true });
    return ok(coupon, 201);
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Invalid request");
  }
}
