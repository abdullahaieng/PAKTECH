"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Timer, ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { CountdownTimer } from "@/components/home/countdown-timer";
import { ScrollAnimation } from "@/components/shared/scroll-animation";
import type { Product } from "@/types";

interface FlashSaleBannerProps {
  products: Product[];
}

export function FlashSaleBanner({ products }: FlashSaleBannerProps) {
  return (
    <section className="py-16 md:py-20">
      <div className="container-custom">
        <ScrollAnimation>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 p-8 md:p-12 text-white mb-10">
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold mb-4"
                >
                  <Flame className="h-4 w-4" />
                  HOT DEAL
                </motion.div>
                <div className="flex items-center gap-2 mb-3">
                  <Timer className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Flash Sale</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-3">Up to 40% Off</h2>
                <p className="text-white/80 mb-6 max-w-md">
                  Limited time deals on premium tech accessories. Grab yours before midnight!
                </p>
                <Button variant="secondary" size="lg" className="group" asChild>
                  <Link href="/shop">
                    Shop Flash Sale
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              <CountdownTimer className="flex flex-col items-center md:items-end" />
            </div>

            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ rotate: 360 }}
                transition={{ duration: 20 + i * 10, repeat: Infinity, ease: "linear" }}
                className="absolute rounded-full border border-white/10 pointer-events-none"
                style={{
                  width: 200 + i * 80,
                  height: 200 + i * 80,
                  right: -50 - i * 30,
                  top: -50 - i * 20,
                }}
              />
            ))}
          </div>
        </ScrollAnimation>

        <ProductGrid products={products.slice(0, 4)} columns={4} />
      </div>
    </section>
  );
}
