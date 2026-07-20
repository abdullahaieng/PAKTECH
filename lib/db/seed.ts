import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { testimonials, faqs, teamMembers, brandStats } from "@/data/content";
import { SHIPPING_CONFIG } from "@/lib/constants";
import type { StoreDatabase } from "./types";

export function createSeedDatabase(): StoreDatabase {
  return {
    products: [...products],
    categories: [...categories],
    orders: [],
    coupons: [
      { code: "PAKTECH10", discount: 10, active: true, description: "10% off all orders" },
      { code: "WELCOME15", discount: 15, active: true, description: "15% off for new customers" },
      { code: "FLASH20", discount: 20, active: true, description: "20% flash sale discount" },
    ],
    faqs: [...faqs],
    testimonials: [...testimonials],
    teamMembers: [...teamMembers],
    brandStats: [...brandStats],
    contactMessages: [],
    users: [],
    passwordResetTokens: [],
    settings: {
      freeShippingThreshold: SHIPPING_CONFIG.freeShippingThreshold,
      standardShipping: SHIPPING_CONFIG.standardShipping,
      expressShipping: SHIPPING_CONFIG.expressShipping,
    },
    version: 1,
  };
}
