"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useNotificationStore } from "@/store/notification-store";

let rehydrateStarted = false;

export function RehydrateStores() {
  useEffect(() => {
    if (rehydrateStarted) return;
    rehydrateStarted = true;

    void useCartStore.persist.rehydrate();
    void useWishlistStore.persist.rehydrate();

    const seedIfReady = () => {
      if (useNotificationStore.persist.hasHydrated()) {
        useNotificationStore.getState().seedDefaults();
      }
    };

    useNotificationStore.persist.onFinishHydration(seedIfReady);
    void useNotificationStore.persist.rehydrate();
    seedIfReady();
  }, []);

  return null;
}
