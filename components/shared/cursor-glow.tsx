"use client";

import { useEffect, useRef, useState } from "react";

export function CursorGlow() {
  const [visible, setVisible] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduced) return;

    setVisible(true);

    const paint = () => {
      frame.current = null;
      const el = glowRef.current;
      if (!el) return;
      el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
    };

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (frame.current === null) {
        frame.current = requestAnimationFrame(paint);
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed top-0 left-0 z-[30] mix-blend-screen hidden md:block">
      <div
        ref={glowRef}
        className="w-96 h-96 rounded-full opacity-40 blur-3xl will-change-transform"
        style={{
          background:
            "radial-gradient(circle, var(--glow) 0%, var(--glow-secondary) 40%, transparent 70%)",
        }}
      />
    </div>
  );
}
