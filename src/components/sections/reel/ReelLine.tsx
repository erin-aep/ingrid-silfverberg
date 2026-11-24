"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export type ReelLineHandle = { draw: (progress: number) => void };

/**
 * The flowing accent line (user's line-reel.svg), drawn in via stroke-dashoffset.
 * Parent calls `draw(0..1)` from the scroll handler.
 */
export const ReelLine = forwardRef<ReelLineHandle, { className?: string }>(
  function ReelLine({ className }, ref) {
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

    useImperativeHandle(ref, () => ({
      draw: (progress: number) => {
        const path = pathRef.current;
        if (!path) return;
        const p = Math.max(0, Math.min(1, progress));
        path.style.strokeDashoffset = `${lenRef.current * (1 - p)}`;
      },
    }), []);

    return (
      <svg
        className={className}
        viewBox="0 0 1728 1117"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <path
          ref={pathRef}
          d="M1772 -235C1535.51 -225.052 1166.12 -77.2958 1218.18 270.768C1223.69 307.58 1233.91 346.633 1249.5 388C1412.5 820.5 1703.5 518 1676.5 371.5C1655.7 258.615 1439.25 137.122 1218.18 270.768C1152.35 310.565 1086.11 372.988 1024.5 465C756 866 607 665.5 513 610C419 554.5 184.5 606 167.5 1024C153.9 1358.4 -3.16666 1373.67 -80 1339.5"
          stroke="url(#reel-line-grad)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="reel-line-grad"
            x1="1034.12"
            y1="558.502"
            x2="1772"
            y2="558.502"
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
