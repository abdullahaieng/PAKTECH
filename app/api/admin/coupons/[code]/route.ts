import { requireAdmin } from "@/lib/auth/admin-auth";
import { updateCoupon, deleteCoupon } from "@/lib/services/coupon-service";
import { ok, fail, unauthorized } from "@/lib/api/response";
import type { Coupon } from "@/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ code: string }> }) {
  if (!requireAdmin(request)) return unauthorized();
  const { code } = await params;
  const body = await request.json() as Partial<Coupon>;
  const coupon = updateCoupon(code, body);
  if (!coupon) return fail("Coupon not found", 404);
  return ok(coupon);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ code: string }> }) {
  if (!requireAdmin(request)) return unauthorized();
  const { code } = await params;
  if (!deleteCoupon(code)) return fail("Coupon not found", 404);
  return ok({ deleted: true });
}
