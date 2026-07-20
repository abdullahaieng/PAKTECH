"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Category } from "@/types";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "@/components/shared/scroll-animation";
import { Button } from "@/components/ui/button";

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      <div className="container-custom relative">
        <ScrollAnimation className="flex items-end justify-between mb-10">
          <div>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              className="h-1 bg-accent rounded-full mb-4"
            />
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Shop by Category</h2>
            <p className="text-muted-foreground">Find exactly what you need</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex group">
            <Link href="/shop">
              All Categories
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </ScrollAnimation>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <StaggerItem key={category.id}>
              <Link href={`/shop?category=${category.slug}`} className="group block">
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="relative overflow-hidden rounded-3xl aspect-[4/3] border border-border/30 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
 
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="font-bold text-sm md:text-lg tracking-tight translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                      {category.name}
                    </h3>
                    <p className="text-xs text-white/60 mt-1 font-medium">{category.productCount} Products</p>
                    <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      Shop Collection <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
