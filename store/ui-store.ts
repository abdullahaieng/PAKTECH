"use client";

import { create } from "zustand";
import type { Product } from "@/types";

interface UIStore {
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isNotificationsOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  quickViewProduct: Product | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: () => void;
  openNotifications: () => void;
  closeNotifications: () => void;
  toggleNotifications: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  setQuickViewProduct: (product: Product | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  isWishlistOpen: false,
  isNotificationsOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  quickViewProduct: null,

  openCart: () => set({ isCartOpen: true, isWishlistOpen: false, isNotificationsOpen: false }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen, isWishlistOpen: false, isNotificationsOpen: false })),

  openWishlist: () => set({ isWishlistOpen: true, isCartOpen: false, isNotificationsOpen: false }),
  closeWishlist: () => set({ isWishlistOpen: false }),
  toggleWishlist: () => set((s) => ({ isWishlistOpen: !s.isWishlistOpen, isCartOpen: false, isNotificationsOpen: false })),

  openNotifications: () => set({ isNotificationsOpen: true, isCartOpen: false, isWishlistOpen: false }),
  closeNotifications: () => set({ isNotificationsOpen: false }),
  toggleNotifications: () =>
    set((s) => ({
      isNotificationsOpen: !s.isNotificationsOpen,
      isCartOpen: false,
      isWishlistOpen: false,
    })),

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),

  setQuickViewProduct: (product) => set({ quickViewProduct: product }),
}));
