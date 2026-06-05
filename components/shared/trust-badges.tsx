"use client";

import { Shield, Banknote, RotateCcw, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const iconMap = { Shield, Banknote, RotateCcw, Truck };

const badges = [
  { label: "100% Original", icon: "Shield" as const, desc: "Authenticity guaranteed", gradient: "from-indigo-500 to-violet-600" },
  { label: "Cash on Delivery", icon: "Banknote" as const, desc: "Pay when you receive", gradient: "from-cyan-500 to-blue-600" },
  { label: "7-Day Returns", icon: "RotateCcw" as const, desc: "Hassle-free returns", gradient: "from-violet-500 to-purple-600" },
  { label: "Nationwide Shipping", icon: "Truck" as const, desc: "150+ cities covered", gradient: "from-blue-500 to-cyan-600" },
];

interface TrustBadgesProps {
  className?: string;
  variant?: "horizontal" | "grid" | "cards";
}

export function TrustBadges({ className, variant = "horizontal" }: TrustBadgesProps) {
  if (variant === "cards") {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
        {badges.map((badge, i) => {
          const Icon = iconMap[badge.icon];
          return (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="group relative rounded-2xl border border-border bg-card p-5 cursor-default overflow-hidden interactive-card"
            >
              <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br", badge.gradient)} />
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300", badge.gradient)}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-bold text-sm">{badge.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{badge.desc}</p>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        variant === "horizontal"
          ? "flex flex-wrap items-center justify-center gap-6 md:gap-10"
          : "grid grid-cols-2 gap-4 md:grid-cols-4",
        className
      )}
    >
      {badges.map((badge) => {
        const Icon = iconMap[badge.icon];
        return (
          <motion.div key={badge.label} whileHover={{ scale: 1.08 }} className="flex items-center gap-2 text-sm cursor-default">
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-md", badge.gradient)}>
              <Icon className="h-4 w-4" />
            </div>
            <span className="font-semibold">{badge.label}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
