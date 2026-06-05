"use client";

import Link from "next/link";
import {
  Headphones, Watch, Battery, Zap, Cable, Speaker, Gamepad2, Smartphone, Car,
} from "lucide-react";
import { MEGA_MENU_CATEGORIES } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Headphones, Watch, Battery, Zap, Cable, Speaker, Gamepad2, Smartphone, Car,
};

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 z-50 border-b border-primary/10 glass shadow-xl shadow-primary/5"
      onMouseLeave={onClose}
    >
      <div className="container-custom py-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider gradient-text mb-4">
              Shop by Category
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {MEGA_MENU_CATEGORIES.map((cat) => {
                const Icon = iconMap[cat.icon];
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-secondary/80 border border-transparent hover:border-primary/20 transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg text-white shadow-md group-hover:scale-110 transition-transform duration-200">
                      {Icon && <Icon className="h-5 w-5" />}
                    </div>
                    <span className="text-sm font-semibold group-hover:text-primary transition-colors">{cat.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl gradient-bg animate-gradient p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative">
              <h3 className="font-bold text-lg mb-2">Flash Sale 🔥</h3>
              <p className="text-sm text-white/80 mb-4">
                Up to 40% off on selected tech accessories. Limited time offer!
              </p>
              <Link
                href="/shop?sort=featured"
                onClick={onClose}
                className="inline-flex items-center text-sm font-bold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors"
              >
                Shop Flash Sale →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
