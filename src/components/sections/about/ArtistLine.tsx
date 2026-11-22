"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type ArtistLineHandle = { draw: (progress: number) => void };

/**
 * The flowing accent line (user's artist-line.svg), drawn in via
 * stroke-dashoffset. Parent calls `draw(0..1)` from the scroll handler; it
 * sits behind the portrait so the ribbon reads as weaving past her.
 */
export const ArtistLine = forwardRef<ArtistLineHandle, { className?: string }>(
  function ArtistLine({ className }, ref) {
    const pathRef = useRef<SVGPathElement>(null);
    const lenRef = useRef(0);

    useEffect(() => {
      const path = pathRef.current;
      if (!path) return;
      const len = path.getTotalLength();
      lenRef.current = len;
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        draw: (progress: number) => {
          const path = pathRef.current;
          if (!path) return;
          const p = Math.max(0, Math.min(1, progress));
          path.style.strokeDashoffset = `${lenRef.current * (1 - p)}`;
        },
      }),
      [],
    );

    return (
      <svg
        className={className}
        viewBox="0 0 1690 1958"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {/* One continuous sub-path so stroke-dashoffset draws it as a single
            unbroken stroke. The original artist-line.svg is three sub-paths that
            all meet at the junction (238.839, 1033.43); here sub-path 1 is
            reversed to begin at the top endpoint (171, 2.6), and the interior
            moveto/close are dropped (the pen is already at the junction), so the
            line draws top hook → loop → tail to the bottom-right — matching the
            reference webm. Geometry is identical to the source file. */}
        <path
          ref={pathRef}
          d="M171.099 2.64355C282.599 181.644 171.098 243.644 38.0987 466.144C-46.9694 608.457 36.1788 910.737 238.839 1033.43C343.901 1097.04 481.083 1112.38 643.599 1032.14C1119.6 797.144 703.547 256.144 374.599 466.144C205.602 574.031 174.353 833.682 238.839 1033.43C299.873 1222.49 446.667 1357.88 643.599 1260.14C1048.6 1059.14 1808.6 1130.14 1666.6 1424.14C1553 1659.34 1575.77 1919.14 1623.1 1953.14"
          stroke="url(#artist-line-grad)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="artist-line-grad"
            x1="1015.07"
            y1="977.894"
            x2="1684.03"
            y2="977.894"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F499AF" />
            <stop offset="1" stopColor="#A66FE8" />
          </linearGradient>
        </defs>
      </svg>
    );
  },
);
