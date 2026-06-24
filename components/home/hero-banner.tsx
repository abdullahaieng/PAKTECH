"use client";
 
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
 
const showcaseProducts = [
  {
    name: "PakTech Watch Ultra",
    category: "Smart Watches",
    price: 19999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    href: "/product/paktech-watch-ultra",
    accent: "from-blue-500/20 to-cyan-500/10",
  },
  {
    name: "Pro Buds X3",
    category: "AirPods & Earbuds",
    price: 9999,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop",
    href: "/product/paktech-pro-buds-x3",
    accent: "from-violet-500/20 to-purple-500/10",
  },
  {
    name: "GaN Charger 100W",
    category: "Fast Chargers",
    price: 5999,
    image: "https://images.unsplash.com/photo-1583863788437-eb7e5672c4e9?w=800&h=800&fit=crop",
    href: "/product/gan-charger-100w-4port",
    accent: "from-indigo-500/20 to-blue-500/10",
  },
  {
    name: "Pro Gaming Headset",
    category: "Gaming Accessories",
    price: 6499,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=800&fit=crop",
    href: "/product/pro-gaming-headset-7-1",
    accent: "from-cyan-500/20 to-indigo-500/10",
  },
];
 
const rotatingWords = ["Accessories", "Workspace", "Gaming Gear", "Smart Tech"];
 
const stats = [
  { value: 50000, suffix: "+", label: "Happy Customers" },
  { value: 150, suffix: "+", label: "Cities Covered" },
  { value: 4.9, suffix: "★", label: "Average Rating" },
];
 
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
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
    const duration = 1500;
    const steps = 50;
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
 
  const display = value % 1 === 0 ? Math.floor(count).toLocaleString() : count.toFixed(1);
 
  return (
    <span ref={ref} className="font-mono tabular-nums">
      {display}{suffix}
    </span>
  );
}
 
function FloatingOrb({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={cn("absolute rounded-full blur-[100px] pointer-events-none", className)}
      animate={{
        y: [0, -40, 0],
        x: [0, 20, 0],
        scale: [1, 1.15, 1],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}
 
export function HeroBanner() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
 
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 22 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
 
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);
 
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % showcaseProducts.length);
    }, 7000);
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
    <section className="relative overflow-hidden min-h-[92vh] flex items-center pt-24 pb-20 lg:pt-32 lg:pb-28">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 overflow-hidden bg-[#050508] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(6,182,212,0.1),transparent_60%)]" />
        <FloatingOrb className="w-[450px] h-[450px] bg-indigo-600/10 -top-40 -left-40" delay={0} />
        <FloatingOrb className="w-[400px] h-[400px] bg-cyan-500/10 top-1/3 -right-20" delay={3} />
        <FloatingOrb className="w-[350px] h-[350px] bg-violet-600/10 bottom-10 left-1/4" delay={6} />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>
 
      <div className="container-custom relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-10 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-4.5 py-2 text-xs md:text-sm backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span className="text-zinc-400 font-semibold tracking-wide uppercase">Premium Tech Collection</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
            </motion.div>
 
            <div className="space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-5xl sm:text-6xl md:text-7xl xl:text-8.5xl font-extrabold tracking-tight text-white leading-[0.95] text-balance"
              >
                Next-Gen Tech
                <span className="block mt-3 h-[1.15em] overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={wordIndex}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -50, opacity: 0 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="block bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent font-black"
                    >
                      {rotatingWords[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.h1>
 
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed"
              >
                Discover our curated selection of flagship tech accessories. Original products, fast delivery across Pakistan, and secure checkout backed by premium support.
              </motion.p>
            </div>
 
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" variant="accent" className="rounded-full h-14 px-8 text-base shadow-2xl hover:-translate-y-0.5 transition-transform" asChild>
                <Link href="/shop" className="flex items-center gap-2">
                  Explore Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-white border-zinc-800 bg-transparent hover:bg-zinc-900/40 hover:-translate-y-0.5 transition-all" asChild>
                <Link href="/about">
                  Our Story
                </Link>
              </Button>
            </motion.div>
 
            {/* Minimal Stats Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-zinc-900/60 max-w-lg"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-1 text-left">
                  <p className="text-2xl md:text-3xl font-extrabold text-white">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
 
          {/* Right Showcase Column */}
          <div className="lg:col-span-5 relative">
            {/* Mobile product showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:hidden w-full max-w-md mx-auto"
            >
              <div className="relative rounded-3xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md overflow-hidden aspect-[4/3] shadow-2xl">
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
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{product.category}</p>
                    <p className="font-bold text-white text-lg mt-0.5">{product.name}</p>
                  </div>
                  <span className="text-cyan-400 font-extrabold text-base">{formatPrice(product.price)}</span>
                </div>
              </div>
              <div className="flex justify-center gap-2.5 mt-5">
                {showcaseProducts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveProduct(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      activeProduct === i ? "w-6 bg-cyan-400" : "w-1.5 bg-zinc-700"
                    )}
                    aria-label={`Show product ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
 
            {/* Desktop interactive 3D showcase */}
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
              className="relative hidden lg:block w-full max-w-[460px] ml-auto"
              style={{ perspective: 1000 }}
            >
              <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative"
              >
                {/* Glow ring backing */}
                <motion.div
                  className={cn(
                    "absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br opacity-25 blur-3xl transition-all duration-500",
                    product.accent
                  )}
                />
 
                {/* Main product card showcase */}
                <div className="relative rounded-[2.2rem] border border-white/5 bg-zinc-950/20 backdrop-blur-2xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.5)] transition-all duration-300">
                  <div className="relative aspect-square">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeProduct}
                        initial={{ opacity: 0, scale: 1.06 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          priority
                          className="object-cover"
                          sizes="500px"
                        />
                      </motion.div>
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />
 
                    {/* Floating mini glass info cards */}
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-3 -right-3 rounded-2xl border border-white/5 bg-zinc-950/60 backdrop-blur-md px-4 py-3 shadow-2xl flex items-center gap-2"
                    >
                      <Truck className="h-4.5 w-4.5 text-cyan-400" />
                      <div>
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Shipping</p>
                        <p className="text-xs font-bold text-white">Free Nationwide</p>
                      </div>
                    </motion.div>
 
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute bottom-28 -left-3 rounded-2xl border border-white/5 bg-zinc-950/60 backdrop-blur-md px-4 py-3 shadow-2xl flex items-center gap-2"
                    >
                      <ShieldCheck className="h-4.5 w-4.5 text-indigo-400" />
                      <div>
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Guarantee</p>
                        <p className="text-xs font-bold text-white">100% Genuine</p>
                      </div>
                    </motion.div>
 
                    {/* Product info overlay */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeProduct}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute bottom-0 left-0 right-0 p-8 space-y-4"
                      >
                        <div>
                          <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">{product.category}</p>
                          <h3 className="text-2xl font-bold text-white mt-1 leading-tight tracking-tight">{product.name}</h3>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <span className="text-2xl font-black text-white">
                            {formatPrice(product.price)}
                          </span>
                          <Button size="sm" variant="accent" className="rounded-full shadow-lg gap-1.5" asChild>
                            <Link href={product.href}>
                              Buy Now
                              <ShoppingBag className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
 
                {/* Thumbnail Selector Row */}
                <div className="flex justify-center gap-3.5 mt-8">
                  {showcaseProducts.map((item, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveProduct(i)}
                      className={cn(
                        "relative h-14 w-14 rounded-2xl overflow-hidden border-2 transition-all duration-300",
                        activeProduct === i
                          ? "border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105"
                          : "border-zinc-800/80 opacity-50 hover:opacity-100"
                      )}
                    >
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
 
      {/* Bottom smooth fade to background */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
