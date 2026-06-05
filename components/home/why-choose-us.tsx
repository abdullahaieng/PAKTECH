"use client";

import { Shield, Truck, HeadphonesIcon, Award } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "@/components/shared/scroll-animation";

const features = [
  {
    icon: Shield,
    title: "100% Original Products",
    description: "Every product comes with an authenticity guarantee. No fakes, no compromises.",
    gradient: "from-indigo-500 to-violet-600",
    glow: "shadow-indigo-500/20",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description: "Fast and reliable delivery across Pakistan. 150+ cities covered.",
    gradient: "from-cyan-500 to-blue-600",
    glow: "shadow-cyan-500/20",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Support",
    description: "Dedicated customer support team available on WhatsApp and phone.",
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Only the best quality tech accessories — ones we use ourselves.",
    gradient: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/20",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container-custom relative">
        <ScrollAnimation className="text-center mb-12">
          <div className="h-1 w-12 gradient-bg rounded-full mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Why Choose <span className="gradient-text">PakTech</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We bring premium accessories to Pakistan&apos;s tech enthusiasts — with quality, trust, and great service.
          </p>
        </ScrollAnimation>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`group rounded-2xl border bg-card p-6 text-center h-full shadow-lg ${feature.glow} hover:shadow-xl transition-shadow duration-300`}
              >
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
