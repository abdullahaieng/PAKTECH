"use client";

import { motion } from "framer-motion";
import { Truck, Shield, Banknote, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const promos = [
  { icon: Truck, text: "Free Shipping on Orders Rs. 5,000+", color: "text-cyan-300" },
  { icon: Shield, text: "100% Original Products Guaranteed", color: "text-violet-300" },
  { icon: Banknote, text: "Cash on Delivery — All Pakistan", color: "text-indigo-300" },
  { icon: Zap, text: "Flash Sale — Up to 40% Off Today", color: "text-purple-300" },
  { icon: Truck, text: "2-3 Day Delivery in Major Cities", color: "text-cyan-300" },
  { icon: Shield, text: "7-Day Easy Returns Policy", color: "text-violet-300" },
];

export function PromoMarquee() {
  const items = [...promos, ...promos];

  return (
    <div className="relative overflow-hidden border-y border-primary/10 py-3.5 gradient-bg animate-gradient">
      <div className="absolute inset-0 bg-black/20" />
      <motion.div
        className="relative flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-white shrink-0 font-medium">
            <item.icon className={cn("h-4 w-4", item.color)} />
            <span>{item.text}</span>
            <span className="text-white/30 mx-2">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
