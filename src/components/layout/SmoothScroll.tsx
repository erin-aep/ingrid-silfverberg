"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Global Lenis smooth-scroll provider. Lenis keeps the real scroll position in
 * sync (it just eases the wheel), so framer-motion's `useScroll` / `useVelocity`
 * continue to work against it. Disabled entirely under reduced motion.
 *
 * The instance is shared through a ref so consumers (e.g. a modal that needs to
 * freeze the page) can call `lenis.stop()` / `lenis.start()` without re-renders.
 */
const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  // On client-side navigation, Lenis keeps its own internal scroll target and
  // cached page dimensions. Without this, a soft nav (e.g. tapping the logo to
  // return home) can leave Lenis parked at the previous page's scroll offset —
  // landing mid-page in a sticky scroll scene — while the document actually
  // reset to the top. Snap Lenis to the top and recompute on every route change.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) {
      window.scrollTo(0, 0);
      return;
    }
    lenis.scrollTo(0, { immediate: true, force: true });
    lenis.resize();
  }, [pathname]);

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  );
}
