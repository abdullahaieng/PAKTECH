"use client";

import Link from "next/link";
import { X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, MEGA_MENU_CATEGORIES, SITE_CONFIG } from "@/lib/constants";
import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-background border-l lg:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-bold">Menu</span>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4">
              <SearchBar onSearch={() => onClose()} />
            </div>

            <Separator />

            <nav className="p-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="block rounded-lg px-4 py-3 text-base font-medium hover:bg-secondary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/account"
                onClick={onClose}
                className="block rounded-lg px-4 py-3 text-base font-medium hover:bg-secondary transition-colors"
              >
                Account
              </Link>
            </nav>

            <Separator />

            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1">
                Categories <ChevronDown className="h-3 w-3" />
              </p>
              <div className="space-y-1">
                {MEGA_MENU_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={onClose}
                    className="block rounded-lg px-4 py-2.5 text-sm hover:bg-secondary transition-colors"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-4 mt-auto">
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                className={cn("flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 text-white font-medium")}
              >
                WhatsApp Order
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
