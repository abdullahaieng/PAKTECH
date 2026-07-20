"use client";

import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollPosition } from "@/hooks/use-client";
import { Button } from "@/components/ui/button";

export function BackToTop() {
  const { showBackToTop } = useScrollPosition(400);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {showBackToTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 left-6 z-50"
        >
          <Button
            size="icon"
            variant="outline"
            onClick={scrollToTop}
            className="h-11 w-11 rounded-full shadow-lg bg-background/90 backdrop-blur-sm border-border"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
