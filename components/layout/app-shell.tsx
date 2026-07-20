"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { DeferredUI } from "@/components/layout/deferred-ui";
import { motion, useScroll, useSpring } from "framer-motion";
 
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });
 
  if (isAdmin) {
    return <>{children}</>;
  }
 
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-primary via-accent to-glow-secondary z-50 origin-left"
        style={{ scaleX }}
      />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <DeferredUI />
    </>
  );
}
