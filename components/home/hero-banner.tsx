"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Play, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const showcaseProducts = [
  {
    name: "PakTech Watch Ultra",
    category: "Smart Watches",
    price: 19999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    href: "/shop?category=smart-watches",
    accent: "from-blue-500/30 to-cyan-500/20",
  },
  {
    name: "Pro Buds X3",
    category: "AirPods & Earbuds",
    price: 9999,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop",
    href: "/shop?category=airpods-earbuds",
    accent: "from-violet-500/30 to-purple-500/20",
  },
  {
    name: "GaN Charger 100W",
    category: "Fast Chargers",
    price: 5999,
    image: "https://images.unsplash.com/photo-1583863788437-eb7e5672c4e9?w=800&h=800&fit=crop",
    href: "/shop?category=fast-chargers",
    accent: "from-indigo-500/30 to-blue-500/20",
  },
  {
    name: "Pro Gaming Headset",
    category: "Gaming",
    price: 6499,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=800&fit=crop",
    href: "/shop?category=gaming-accessories",
    accent: "from-cyan-500/30 to-indigo-500/20",
  },
];

const rotatingWords = ["Tech Experience", "Daily Life", "Gaming Setup", "Work Flow"];

const stats = [
  { value: 50000, suffix: "+", label: "Happy Customers" },
  { value: 150, suffix: "+", label: "Cities" },
  { value: 500, suffix: "+", label: "Products" },
  { value: 4.9, suffix: "★", label: "Rating", decimals: 1 },
];

function AnimatedCounter({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, value]);

  const display = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}

function FloatingOrb({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={cn("absolute rounded-full blur-3xl pointer-events-none", className)}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export function HeroBanner() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % showcaseProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const product = showcaseProducts[activeProduct];

  return (
    <section className="relative overflow-hidden text-white min-h-[90vh] flex items-center">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#1e1060] to-[#0c2340]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,_rgba(99,102,241,0.4),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,_rgba(6,182,212,0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_80%,_rgba(168,85,247,0.2),transparent_50%)]" />
        <FloatingOrb className="w-96 h-96 bg-indigo-500/30 -top-20 -left-20" delay={0} />
        <FloatingOrb className="w-80 h-80 bg-cyan-500/20 top-1/2 -right-20" delay={2} />
        <FloatingOrb className="w-64 h-64 bg-violet-500/20 bottom-0 left-1/3" delay={4} />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container-custom relative z-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur-sm"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="h-4 w-4 text-accent" />
              </motion.span>
              <span className="text-white/80">Pakistan&apos;s #1 Premium Tech Store</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                Elevate Your
                <span className="block mt-2 h-[1.2em] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={wordIndex}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -40, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="block bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent"
                    >
                      {rotatingWords[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/60 max-w-lg leading-relaxed"
            >
              Premium tech accessories — AirPods, smart watches, power banks &amp; gaming gear.
              Original products, nationwide delivery, Cash on Delivery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" variant="accent" className="h-13 px-8 text-base" asChild>
                <Link href="/shop">
                  <span className="relative z-10 flex items-center gap-2">
                    Shop Now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
              <Button size="lg" variant="glow" className="h-13 px-8 text-white border-white/30 hover:text-white" asChild>
                <Link href="/shop?category=airpods-earbuds" className="flex items-center gap-2">
                  <Play className="h-4 w-4 fill-current" />
                  Explore AirPods
                </Link>
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm cursor-default"
                >
                  <p className="text-2xl font-bold text-white">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                  </p>
                  <p className="text-xs text-white/50 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Mobile product showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:hidden"
          >
            <div className="relative rounded-2xl border border-white/10 overflow-hidden aspect-[4/3]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProduct}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0"
                >
                  <Image src={product.image} alt={product.name} fill className="object-cover" sizes="100vw" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs text-white/60">{product.category}</p>
                <p className="font-bold">{product.name}</p>
                <p className="text-accent font-semibold">{formatPrice(product.price)}</p>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {showcaseProducts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveProduct(i)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    activeProduct === i ? "w-6 bg-accent" : "w-2 bg-white/30"
                  )}
                  aria-label={`Show product ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Desktop interactive showcase */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
            className="relative hidden lg:block"
            style={{ perspective: 1000 }}
          >
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative"
            >
              {/* Glow ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={cn(
                  "absolute -inset-4 rounded-3xl bg-gradient-to-r opacity-40 blur-2xl",
                  product.accent
                )}
              />

              {/* Main product card */}
              <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="relative aspect-square">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProduct}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1024px) 0vw, 50vw"
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Product info overlay */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProduct}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-0 left-0 right-0 p-6"
                    >
                      <p className="text-xs text-white/60 uppercase tracking-wider">{product.category}</p>
                      <h3 className="text-xl font-bold mt-1">{product.name}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-2xl font-bold text-accent">
                          {formatPrice(product.price)}
                        </span>
                        <Button size="sm" variant="accent" asChild>
                          <Link href={product.href}>
                            View <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Floating mini cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md px-4 py-3 shadow-xl"
              >
                <p className="text-xs text-white/60">Free Shipping</p>
                <p className="text-sm font-semibold">Orders 5K+</p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-2 -left-4 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md px-4 py-3 shadow-xl"
              >
                <p className="text-xs text-white/60">COD Available</p>
                <p className="text-sm font-semibold text-cyan-400">All Pakistan</p>
              </motion.div>
            </motion.div>

            {/* Thumbnail selector */}
            <div className="flex justify-center gap-3 mt-6">
              {showcaseProducts.map((item, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveProduct(i)}
                  className={cn(
                    "relative h-14 w-14 rounded-xl overflow-hidden border-2 transition-all duration-300",
                    activeProduct === i
                      ? "border-accent shadow-lg shadow-accent/30 scale-110"
                      : "border-white/20 opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
