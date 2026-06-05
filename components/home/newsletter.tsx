"use client";

import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollAnimation } from "@/components/shared/scroll-animation";
import { useToast } from "@/components/providers/notification-provider";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast("Subscribed to the newsletter. Thank you!", "success");
      setEmail("");
    }
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 gradient-bg animate-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />

      <div className="container-custom relative">
        <ScrollAnimation className="max-w-2xl mx-auto text-center text-white">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-5"
          >
            <Mail className="h-7 w-7" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Stay in the Loop</h2>
          <p className="text-white/75 mb-8">
            Latest deals, new arrivals, and exclusive offers — straight to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/15 border-white/25 text-white placeholder:text-white/50 rounded-xl h-12 backdrop-blur-sm focus:border-white"
            />
            <Button type="submit" variant="secondary" className="rounded-xl h-12 px-6 font-bold shrink-0 hover:scale-105 transition-transform">
              Subscribe
            </Button>
          </form>
        </ScrollAnimation>
      </div>
    </section>
  );
}
