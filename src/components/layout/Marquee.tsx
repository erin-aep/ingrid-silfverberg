"use client";

import { disciplines } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Marquee() {
  const reduced = usePrefersReducedMotion();
  const items = [...disciplines, "Award-Winning"];
  const track = [...items, ...items];

  return (
    <div
      className="overflow-hidden border-y border-[rgba(200,125,232,0.12)] bg-bg2 py-4"
      aria-hidden
    >
      <div
        className={`inline-flex whitespace-nowrap ${reduced ? "" : "animate-marquee"}`}
      >
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="inline-flex items-center">
            <span className="font-display text-gradient-chrome px-6 text-[1.4rem] opacity-50">
              {item}
            </span>
            <span className="px-2 text-[0.9rem] text-magenta opacity-60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
