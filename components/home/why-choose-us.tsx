"use client";

import { ShieldCheck, Truck, Lock, Award } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "@/components/shared/scroll-animation";
 
const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Swift nationwide dispatch in 2-3 days with reliable tracking directly to your doorstep.",
    gradient: "from-cyan-500/10 to-blue-500/10",
    iconColor: "text-cyan-500",
    borderColor: "hover:border-cyan-500/20",
    glow: "shadow-cyan-500/5",
  },
  {
    icon: ShieldCheck,
    title: "Genuine Products",
    description: "100% authentic tech accessories sourced directly from official brand manufacturers.",
    gradient: "from-indigo-500/10 to-violet-500/10",
    iconColor: "text-indigo-500",
    borderColor: "hover:border-indigo-500/20",
    glow: "shadow-indigo-500/5",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Shop with absolute peace of mind using encrypted gateways or Cash on Delivery options.",
    gradient: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-500",
    borderColor: "hover:border-purple-500/20",
    glow: "shadow-purple-500/5",
  },
  {
    icon: Award,
    title: "Warranty Support",
    description: "Comprehensive product warranty support to ensure your technology is always protected.",
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-500",
    borderColor: "hover:border-emerald-500/20",
    glow: "shadow-emerald-500/5",
  },
];
 
export function WhyChooseUs() {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
 
      <div className="container-custom relative">
        <ScrollAnimation className="text-center mb-16">
          <div className="h-1 w-12 gradient-bg rounded-full mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">
            Designed for <span className="gradient-text">Reliability</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            We deliver original technology solutions with a premium checkout and customer care experience.
          </p>
        </ScrollAnimation>
 
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`group rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl p-8 text-center h-full shadow-sm hover:shadow-xl ${feature.glow} ${feature.borderColor} transition-all duration-300`}
              >
                <div className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} ${feature.iconColor} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
