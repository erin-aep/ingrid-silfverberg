"use client";

import { useEffect, useRef } from "react";

/** Full-strength gradient for the thumb. */
const GRAD = "linear-gradient(180deg, #F499AF 0%, #A66FE8 100%)";
/** Same gradient at 50% opacity for the track (alpha baked into the stops so
 *  the 100% thumb nested inside isn't dimmed by a container opacity). */
const GRAD_50 =
  "linear-gradient(180deg, rgba(244,153,175,0.5) 0%, rgba(166,111,232,0.5) 100%)";

/**
 * A custom, non-interactive scroll indicator pinned to the right edge.
 *
 * - Track: full-length F499AF→A66FE8 gradient at 50% opacity.
 * - Thumb: the same gradient at 100% opacity; its length reflects how much of
 *   the page is in view and its position tracks the scroll offset.
 *
 * Purely decorative (`pointer-events-none`, `aria-hidden`) — it reports scroll
 * position but you cannot drag it. Reads the real scroll offset, so it stays
 * correct with Lenis smooth scroll and under reduced motion alike.
 */
export function ScrollProgress() {
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const thumb = thumbRef.current;
      const track = trackRef.current;
      if (!thumb || !track) return;

      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const trackH = track.clientHeight;

      // compact thumb — a small fraction of the short track (clamped visible)
      const thumbH = Math.max(28, Math.min(trackH, trackH * 0.32));

      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const travel = trackH - thumbH;
      const y = Math.max(0, Math.min(travel, progress * travel));

      thumb.style.height = `${thumbH}px`;
      thumb.style.transform = `translateY(${y}px)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      aria-hidden
      className="pointer-events-none fixed top-1/2 right-[12px] z-[200] h-[150px] w-[4px] -translate-y-1/2 overflow-hidden rounded-full"
      style={{ background: GRAD_50 }}
    >
      <div
        ref={thumbRef}
        className="w-full rounded-full will-change-transform"
        style={{ background: GRAD }}
      />
    </div>
  );
}
