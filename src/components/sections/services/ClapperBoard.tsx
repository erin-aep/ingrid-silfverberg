"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Filmmaking motif: a clapperboard that snaps open on hover. The slate (bottom)
 * stays put; the arm (top) swings up about the left hinge — closed → open —
 * while the whole board lifts forward in the card's 3D space. Reduced motion
 * shows the open board with no swing.
 */
export function ClapperBoard() {
  const reduced = usePrefersReducedMotion();

  const ease = "cubic-bezier(0.34,1.4,0.5,1)";
  // Non-overshoot ease for the forward Z-lift: a springy curve here would
  // undershoot below 0 on exit and tuck the board behind the card surface, so
  // it would blink out for a frame. The scale/rotate spring lives separately.
  const settle = "cubic-bezier(0.22,1,0.36,1)";

  return (
    <div
      className={
        reduced
          ? "pointer-events-none absolute inset-0 grid place-items-center [transform-style:preserve-3d]"
          : "pointer-events-none absolute inset-0 grid place-items-center [transform-style:preserve-3d] transition-transform duration-[650ms] [transform:translateZ(0px)] group-hover/sv:[transform:translateZ(70px)]"
      }
      style={reduced ? undefined : { transitionTimingFunction: settle }}
    >
      <div
        className={
          reduced
            ? "relative w-[62%] [transform:scale(1.15)]"
            : "relative w-[62%] transition-transform duration-[650ms] [transform:translateY(0%)_scale(1.15)_rotate(0deg)] group-hover/sv:[transform:translateY(-30%)_scale(1.35)_rotate(-15deg)]"
        }
        style={{ aspectRatio: "162 / 143", transitionTimingFunction: ease }}
      >
        {/* Slate / body — anchored to the bottom, 108/143 of the height */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/services/film-clapper-bottom.svg"
          alt=""
          className="absolute bottom-0 left-0 block w-full select-none"
        />

        {/* Arm — hinged at its bottom-left corner, meets the slate's top edge */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/services/film-clapper-top.svg"
          alt=""
          className={
            reduced
              ? "absolute left-0 top-0 block w-full origin-bottom-left select-none -rotate-[30deg]"
              : "absolute left-0 top-0 block w-full origin-bottom-left select-none transition-transform duration-[650ms] group-hover/sv:-rotate-[30deg]"
          }
          style={{ transitionTimingFunction: ease }}
        />
      </div>
    </div>
  );
}
