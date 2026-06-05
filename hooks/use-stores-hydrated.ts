"use client";

import { useSyncExternalStore } from "react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useNotificationStore } from "@/store/notification-store";

function subscribeStoresHydrated(onStoreChange: () => void) {
  const unsubCart = useCartStore.persist.onFinishHydration(onStoreChange);
  const unsubWishlist = useWishlistStore.persist.onFinishHydration(onStoreChange);
  const unsubNotifications = useNotificationStore.persist.onFinishHydration(onStoreChange);
  return () => {
    unsubCart();
    unsubWishlist();
    unsubNotifications();
  };
}

function getStoresHydrated() {
  return (
    useCartStore.persist.hasHydrated() &&
    useWishlistStore.persist.hasHydrated() &&
    useNotificationStore.persist.hasHydrated()
  );
}

/** Server + first client paint: false — avoids hydration mismatch with localStorage. */
export function useStoresHydrated() {
  return useSyncExternalStore(subscribeStoresHydrated, getStoresHydrated, () => false);
}
