import type { AppNotification } from "@/types";

type SeedNotification = Omit<AppNotification, "id" | "read" | "createdAt">;

export const DEFAULT_NOTIFICATIONS: SeedNotification[] = [
  {
    title: "Welcome to PakTech!",
    message: "Premium tech accessories — AirPods, watches, chargers and more. Shop today.",
    type: "promo",
    href: "/shop",
  },
  {
    title: "Free Delivery",
    message: "Free delivery across Pakistan on every order.",
    type: "info",
    href: "/shop",
  },
  {
    title: "Flash Sale — 40% Off",
    message: "Limited-time discount on selected products today. Don't miss out!",
    type: "promo",
    href: "/shop?sort=featured",
  },
  {
    title: "Coupon: PAKTECH10",
    message: "Use PAKTECH10 at checkout for 10% off.",
    type: "promo",
    href: "/cart",
  },
];
