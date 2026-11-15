"use client";

import { useSyncExternalStore } from "react";
import useCanvasCursor from "@/hooks/useCanvasCursor";

function subscribe(query: string) {
  return (onChange: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  };
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function CanvasCursorCanvas() {
  useCanvasCursor();
  return (
    <canvas
      id="canvas"
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9998] h-full w-full"
    />
  );
}

export function CanvasCursor() {
  const finePointer = useMediaQuery("(pointer: fine)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  // Desktop/fine-pointer only, and never under reduced motion.
  if (!finePointer || reduced) return null;
  return <CanvasCursorCanvas />;
}
