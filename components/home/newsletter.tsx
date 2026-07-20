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
    <div className="relative rounded-[2.2rem] border border-border/40 bg-card/65 dark:bg-[#0c0c0e]/65 backdrop-blur-xl p-8 md:p-16 overflow-hidden shadow-2xl">
      {/* Background glow highlights */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
 
      <ScrollAnimation className="max-w-2xl mx-auto text-center">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-6"
        >
          <Mail className="h-5 w-5" />
        </motion.div>
        
        <h2 className="text-3xl md:text-4.5xl font-extrabold tracking-tight mb-3 text-foreground">
          Stay in the Loop
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
          Subscribe to receive early access to new arrivals, private sales, and curated product collections.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-secondary/40 border-border/40 text-foreground placeholder:text-muted-foreground/50 rounded-full h-12 px-5 focus:bg-background focus:border-primary/50 focus-visible:ring-primary/20 transition-all duration-300 text-sm"
          />
          <Button type="submit" variant="accent" className="rounded-full h-12 px-6 font-bold shrink-0 shadow-lg hover:shadow-primary/20 transition-all">
            Subscribe
          </Button>
        </form>
      </ScrollAnimation>
    </div>
  );
}
