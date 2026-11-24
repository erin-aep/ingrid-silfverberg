"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useAnimationControls } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useLenis } from "@/components/layout/SmoothScroll";

/** Transition colour — --chrome2 (#C87DE8). Ours, kept. */
const PANEL = "#c87de8";

/** Draw / un-draw easing + timing (~1s each way). */
const EASE = [0.66, 0, 0.34, 1] as const;
const DRAW = 1;
const UNDRAW = 1;

/**
 * Stroke width as a PERCENTAGE of the SVG (resolution-independent, like the
 * reference). It stays THIN for the first half of the draw so the line clearly
 * reads as a LINE sweeping across, then swells to THICK to fully cover; it
 * thins back down on the way out. No opacity animation.
 */
const STROKE_THIN = "5%";
const STROKE_THICK = "30%";

/**
 * A hand-drawn spiral — a chain of cubic Béziers, NOT a mathematical spiral, so
 * it reads as organic/imperfect. Authored in a 1000×1000 viewBox. The centreline
 * ENTERS at the upper-left, winds ~2.5 loops inward to the centre, then tails
 * out to the lower-right. The SVG is oversized to 130% (offset −15% on each
 * side) so the loops overflow the viewport and cover the corners without a huge
 * radius — the reference's trick.
 */
const LINE_PATH =
  "M 70 300 C 310 40 980 40 905 500 C 850 962 240 986 120 745 C 4 526 200 274 486 289 C 746 303 776 520 655 652 C 545 766 320 745 300 632 C 283 520 362 461 500 471 C 706 484 873 662 952 946";

/**
 * Page transition as a LINE (on-brand with the site's line motif), rebuilt to
 * match the reference feel: a #C87DE8 hand-drawn stroke DRAWS in from the
 * upper-left, winding to the centre and on to the lower-right. It stays thin
 * while sweeping, then swells to cover; the route swaps while covered, then the
 * stroke keeps travelling and UN-DRAWS (thinning back down) to reveal.
 *
 * Internal <a> clicks are intercepted (capture phase) so the draw → navigate →
 * un-draw sequence stays coordinated. Reduced motion skips it entirely.
 */
export function PageTransition() {
  const reduced = usePrefersReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const lineControls = useAnimationControls();
  const lenisRef = useLenis();

  const animating = useRef(false);
  const routeReady = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (routeReady.current) {
      routeReady.current();
      routeReady.current = null;
    }
  }, [pathname]);

  const navigate = useCallback(
    async (href: string) => {
      if (animating.current) return;
      animating.current = true;

      const lenis = lenisRef?.current;
      lenis?.stop();

      // draw in (thin, then swelling) until the stroke covers the page
      await lineControls.start("cover", {
        duration: DRAW,
        ease: EASE,
        strokeWidth: { duration: DRAW, ease: "easeIn", times: [0, 0.5, 1] },
      });

      // swap route while covered, then wait for it to mount (or time out)
      const ready = new Promise<void>((res) => (routeReady.current = res));
      router.push(href);
      await Promise.race([ready, new Promise<void>((r) => setTimeout(r, 1400))]);
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      await new Promise((r) => setTimeout(r, 60));

      // keep travelling — un-draw (thinning) to reveal
      await lineControls.start("reveal", { duration: UNDRAW, ease: EASE });
      lineControls.set("hidden");
      lenis?.start();
      animating.current = false;
    },
    [lineControls, lenisRef, router],
  );

  // Intercept same-origin anchor navigations (capture phase beats <Link>).
  useEffect(() => {
    if (reduced) return;

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;

      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const raw = anchor.getAttribute("href");
      if (!raw || !raw.startsWith("/")) return; // external / mailto / hash → default
      if (raw.startsWith("/#")) return; // in-page anchor → default

      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // same page → default

      e.preventDefault();
      e.stopPropagation();
      navigate(url.pathname + url.search + url.hash);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate, reduced]);

  if (reduced) return null;

  // strokeDashoffset (pathLength normalised to 1, dasharray "1 1"):
  //  1 → nothing drawn · 0 → fully drawn (covers) · -1 → travelled off (gone)
  // strokeWidth keyframes keep it thin through the first half of the draw, then
  // swell to cover — and thin back down on reveal. No opacity change.
  const pathVariants = {
    hidden: { strokeDashoffset: 1, strokeWidth: STROKE_THIN },
    cover: {
      strokeDashoffset: 0,
      strokeWidth: [STROKE_THIN, STROKE_THIN, STROKE_THICK],
    },
    reveal: { strokeDashoffset: -1, strokeWidth: STROKE_THIN },
  };

  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed z-[300]"
      style={{ top: "-15%", left: "-15%", width: "130%", height: "130%" }}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
    >
      <motion.path
        d={LINE_PATH}
        fill="none"
        stroke={PANEL}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        initial="hidden"
        animate={lineControls}
        variants={pathVariants}
      />
    </svg>
  );
}
