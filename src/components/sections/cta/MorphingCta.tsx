"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Decorative bento mark that morphs between two arrangements of the same six
 * tiles (CTA 1 ⇄ CTA 2). Each tile keeps its identity and eases to its new
 * position/size — a "magic move". Box order below is the numbered mapping from
 * the reference (tile 1 → tile 6). Reduced motion holds the first layout.
 */
type Box = { x: number; y: number; w: number; h: number };

// CTA 1 — tiles 1..6
const STATE_A: Box[] = [
  { x: 0, y: 0, w: 149, h: 63 },
  { x: 162, y: 0, w: 56, h: 141 },
  { x: 0, y: 77, w: 49, h: 64 },
  { x: 63, y: 77, w: 86, h: 64 },
  { x: 0, y: 155, w: 127, h: 63 },
  { x: 141, y: 155, w: 77, h: 63 },
];

// CTA 2 — same tiles, new arrangement
const STATE_B: Box[] = [
  { x: 0, y: 0, w: 135.569, h: 63.3563 },
  { x: 148.512, y: 0, w: 69.4875, h: 63.3563 },
  { x: 0, y: 76.9814, w: 49.05, h: 141.019 },
  { x: 62.6758, y: 76.9814, w: 155.325, h: 64.0375 },
  { x: 62.6758, y: 154.644, w: 104.231, h: 63.3563 },
  { x: 180.531, y: 154.644, w: 37.4688, h: 63.3563 },
];

const RX = 13.625;
const EASE = [0.65, 0, 0.35, 1] as const; // easeInOut — settles into each layout

export function MorphingCta({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setFlipped((f) => !f), 1900);
    return () => clearInterval(id);
  }, [reduced]);

  const layout = flipped ? STATE_B : STATE_A;

  return (
    <svg
      viewBox="0 0 218 218"
      className={className}
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* objectBoundingBox units → every tile reads pink (top-left) → purple
            (bottom-right) on its own box, matching the source gradients. */}
        <linearGradient id="cta-tile-grad" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F499AF" />
          <stop offset="1" stopColor="#A66FE8" />
        </linearGradient>
      </defs>

      {layout.map((b, i) => (
        <motion.rect
          key={i}
          rx={RX}
          fill="url(#cta-tile-grad)"
          initial={false}
          animate={{ x: b.x, y: b.y, width: b.w, height: b.h }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.8, ease: EASE }
          }
        />
      ))}
    </svg>
  );
}
