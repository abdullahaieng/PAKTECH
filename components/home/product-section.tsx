"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ProductGrid } from "@/components/product/product-grid";
import { ScrollAnimation } from "@/components/shared/scroll-animation";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
  accent?: boolean;
}

export function ProductSection({ title, subtitle, products, href = "/shop", accent = false }: ProductSectionProps) {
  return (
    <section className={cn("py-16 md:py-20", accent && "bg-secondary/30")}>
      <div className="container-custom">
        <ScrollAnimation className="flex items-end justify-between mb-10">
          <div>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              className="h-1 bg-accent rounded-full mb-4"
            />
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{title}</h2>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex group">
            <Link href={href}>
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </ScrollAnimation>

        <ProductGrid products={products.slice(0, 8)} columns={4} />

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href={href}>View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
