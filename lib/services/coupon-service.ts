import type { Coupon } from "@/types";
import { getDatabase, updateDatabase } from "@/lib/db/file-store";

export function getAllCoupons(): Coupon[] {
  return getDatabase().coupons;
}

export function validateCoupon(code: string): Coupon | null {
  const coupon = getDatabase().coupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase() && c.active
  );
  return coupon ?? null;
}

export function calculateDiscount(subtotal: number, discountPercent: number): number {
  return Math.round((subtotal * discountPercent) / 100);
}

export function updateCoupon(code: string, data: Partial<Coupon>): Coupon | null {
  let updated: Coupon | null = null;
  updateDatabase((db) => {
    const index = db.coupons.findIndex((c) => c.code.toUpperCase() === code.toUpperCase());
    if (index === -1) return;
    db.coupons[index] = { ...db.coupons[index], ...data };
    updated = db.coupons[index];
  });
  return updated;
}

export function createCoupon(data: Coupon): Coupon {
  const code = data.code.toUpperCase();
  const existing = getDatabase().coupons.find((c) => c.code.toUpperCase() === code);
  if (existing) throw new Error("Coupon code already exists");

  const coupon: Coupon = { ...data, code, active: data.active ?? true };
  updateDatabase((db) => {
    db.coupons.push(coupon);
  });
  return coupon;
}

export function deleteCoupon(code: string): boolean {
  let deleted = false;
  updateDatabase((db) => {
    const before = db.coupons.length;
    db.coupons = db.coupons.filter((c) => c.code.toUpperCase() !== code.toUpperCase());
    deleted = db.coupons.length < before;
  });
  return deleted;
}
