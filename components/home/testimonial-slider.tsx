"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import type { Testimonial } from "@/types";
import { ScrollAnimation } from "@/components/shared/scroll-animation";

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export function TestimonialSlider({ testimonials }: TestimonialSliderProps) {
  const [current, setCurrent] = useState(0);
  const count = testimonials.length;

  useEffect(() => {
    if (count === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % count);
    }, 5000);
    return () => clearInterval(timer);
  }, [count]);

  if (count === 0) return null;

  return (
    <section className="py-24 md:py-32 relative overflow-hidden border-t border-border/10 bg-background">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-glow-secondary/5 rounded-full blur-3xl pointer-events-none" />
 
      <div className="container-custom relative">
        <ScrollAnimation className="text-center mb-16">
          <div className="h-1 w-12 gradient-bg rounded-full mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Customer <span className="gradient-text">Voices</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Read authentic reviews from technology enthusiasts who trust PakTech for their daily essentials.
          </p>
        </ScrollAnimation>
 
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl p-8 md:p-12 shadow-sm hover:shadow-lg transition-all duration-300">
            {/* Massive modern quotation marks */}
            <span className="absolute top-4 left-6 text-7xl md:text-8.5xl font-serif text-primary/10 select-none pointer-events-none">&ldquo;</span>
 
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45 }}
                className="text-center relative z-10"
              >
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-lg md:text-2xl font-semibold leading-relaxed text-foreground mb-8 text-balance max-w-3xl mx-auto">
                  &ldquo;{testimonials[current].comment}&rdquo;
                </blockquote>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border border-border ring-2 ring-primary/20">
                    <Image
                      src={testimonials[current].avatar}
                      alt={testimonials[current].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <p className="font-bold text-foreground text-base">{testimonials[current].name}</p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Verified Purchaser
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {testimonials[current].city} &bull; {testimonials[current].product}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
 
          {/* Custom dot selectors */}
          <div className="flex justify-center gap-2.5 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
