"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Search, ShoppingBag, Heart, User, Menu, Moon, Sun, ChevronDown, Phone, Sparkles, Bell,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MegaMenu } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";
import { SearchBar } from "@/components/shared/search-bar";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useNotificationStore } from "@/store/notification-store";
import { useUIStore } from "@/store/ui-store";
import { useScrollPosition, useMounted } from "@/hooks/use-client";
import { useStoresHydrated } from "@/hooks/use-stores-hydrated";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isScrolled } = useScrollPosition();
  const mounted = useMounted();
  const storesHydrated = useStoresHydrated();
  const { theme, setTheme } = useTheme();

  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const unreadNotifications = useNotificationStore((s) => s.getUnreadCount());
  const openCart = useUIStore((s) => s.openCart);
  const openWishlist = useUIStore((s) => s.openWishlist);
  const openNotifications = useUIStore((s) => s.openNotifications);
  const isMobileMenuOpen = useUIStore((s) => s.isMobileMenuOpen);
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const closeMobileMenu = useUIStore((s) => s.closeMobileMenu);
  const { user } = useAuth();

  return (
    <>
      <div className="hidden md:block gradient-bg animate-gradient text-white text-xs">
        <div className="container-custom flex items-center justify-between py-2.5">
          <p className="flex items-center gap-1.5 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Free shipping on orders over Rs. 5,000 | Cash on Delivery
          </p>
          <div className="flex items-center gap-4">
            <a href={`tel:${SITE_CONFIG.phone}`} className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Phone className="h-3 w-3" /> {SITE_CONFIG.phone}
            </a>
            <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} className="hover:opacity-80 transition-opacity font-medium">
              WhatsApp Order →
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-500",
          isScrolled ? "glass shadow-lg shadow-primary/5" : "bg-background/80 backdrop-blur-sm"
        )}
      >
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleMobileMenu}>
                <Menu className="h-5 w-5" />
              </Button>

              <Link href="/" className="flex items-center gap-2.5 group">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg text-white font-bold text-sm shadow-md glow-sm"
                >
                  PT
                </motion.div>
                <span className="text-xl font-bold tracking-tight hidden sm:block gradient-text">PakTech</span>
              </Link>

              <nav className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map((link) =>
                  link.label === "Shop" ? (
                    <div key={link.href} className="relative" onMouseEnter={() => setMegaMenuOpen(true)}>
                      <Link
                        href={link.href}
                        className={cn(
                          "nav-link flex items-center gap-1 rounded-xl px-4 py-2 hover:text-primary",
                          pathname === link.href && "active text-primary"
                        )}
                      >
                        Shop <ChevronDown className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "nav-link rounded-xl px-4 py-2 hover:text-primary",
                        pathname === link.href && "active text-primary"
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <SearchBar className="w-full" />
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="md:hidden rounded-xl" onClick={() => setSearchOpen(!searchOpen)}>
                <Search className="h-5 w-5" />
              </Button>

              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl hover:text-primary"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              )}

              <Button variant="ghost" size="icon" asChild className="hidden sm:flex rounded-xl hover:text-primary">
                <Link href={user ? "/account" : "/account/login"} aria-label="Account">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="h-6 w-6 rounded-full" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl hover:text-primary"
                onClick={openNotifications}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {storesHydrated && unreadNotifications > 0 && (
                  <Badge variant="accent" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </Badge>
                )}
              </Button>

              <Button variant="ghost" size="icon" className="relative rounded-xl hover:text-primary" onClick={openWishlist}>
                <Heart className="h-5 w-5" />
                {storesHydrated && wishlistCount > 0 && (
                  <Badge variant="accent" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>

              <Button variant="ghost" size="icon" className="relative rounded-xl hover:text-primary" onClick={openCart}>
                <ShoppingBag className="h-5 w-5" />
                {storesHydrated && cartCount > 0 && (
                  <Badge variant="accent" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] animate-pulse-glow">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {searchOpen && (
            <div className="pb-4 md:hidden">
              <SearchBar autoFocus onSearch={() => setSearchOpen(false)} />
            </div>
          )}
        </div>

        <MegaMenu isOpen={megaMenuOpen} onClose={() => setMegaMenuOpen(false)} />
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
}
