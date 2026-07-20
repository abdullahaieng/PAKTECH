"use client";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(
  () => import("@/components/cart/cart-drawer").then((m) => m.CartDrawer),
  { ssr: false }
);
const WishlistDrawer = dynamic(
  () => import("@/components/cart/wishlist-drawer").then((m) => m.WishlistDrawer),
  { ssr: false }
);
const NotificationPanel = dynamic(
  () => import("@/components/notifications/notification-panel").then((m) => m.NotificationPanel),
  { ssr: false }
);
const QuickViewModal = dynamic(
  () => import("@/components/product/quick-view-modal").then((m) => m.QuickViewModal),
  { ssr: false }
);
const BackToTop = dynamic(
  () => import("@/components/shared/back-to-top").then((m) => m.BackToTop),
  { ssr: false }
);
const WhatsAppButton = dynamic(
  () => import("@/components/shared/whatsapp-button").then((m) => m.WhatsAppButton),
  { ssr: false }
);
const CursorGlow = dynamic(
  () => import("@/components/shared/cursor-glow").then((m) => m.CursorGlow),
  { ssr: false }
);

export function DeferredUI() {
  return (
    <>
      <CartDrawer />
      <WishlistDrawer />
      <NotificationPanel />
      <QuickViewModal />
      <BackToTop />
      <WhatsAppButton />
      <CursorGlow />
    </>
  );
}
