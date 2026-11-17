"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Web Design motif. Idle: the cursor arrow (icon-web-design.svg) alone, large
 * and centred. Hover: the cursor scales down and tucks into the window frame's
 * upper-right while the browser-window frame assembles — its four corner
 * squares fly out from the centre and the outline draws in. Reduced motion
 * keeps the same end states with no travel.
 *
 * Frame geometry matches icon-web-hover.svg (viewBox 238×180): 12px corner
 * squares, a 226×168 stroked frame inset at (5.5, 5.5). Each square's idle
 * transform moves its centre to the viewBox centre (119, 90).
 */
const SQUARES = [
  { x: 0, y: 0, tx: 113, ty: 84 }, // top-left
  { x: 226, y: 0, tx: -113, ty: 84 }, // top-right
  { x: 0, y: 168, tx: 113, ty: -84 }, // bottom-left
  { x: 226, y: 168, tx: -113, ty: -84 }, // bottom-right
] as const;

export function WebIcon() {
  const reduced = usePrefersReducedMotion();
  const ease = "cubic-bezier(0.34,1.4,0.5,1)";
  // A plain settle ease (no overshoot) for anything that must not dip past its
  // target — the Z-lift especially: an overshoot there would undershoot below 0
  // on exit and tuck the motif behind the card surface, so it blinks out.
  const settle = "cubic-bezier(0.22,1,0.36,1)";
  // Transform keeps the springy assembly; opacity uses the settle ease so it
  // never overshoots below 0 and pops out early — keeping hover↔idle seamless.
  const motifTransition = `transform 650ms ${ease}, opacity 650ms ${settle}`;

  const squareBase = reduced
    ? "opacity-0 group-hover/sv:opacity-100"
    : "opacity-0 [transform:translate(var(--tx),var(--ty))] group-hover/sv:opacity-100 group-hover/sv:[transform:translate(0px,0px)]";

  const frameCls = reduced
    ? "opacity-0 group-hover/sv:opacity-100"
    : "origin-center opacity-0 [transform:scale(0.55)] group-hover/sv:opacity-100 group-hover/sv:[transform:scale(1)]";

  const cursorCls = reduced
    ? "block w-full select-none [transform:translate(0px,0px)_scale(1)] group-hover/sv:[transform:translate(55%,-35%)_scale(0.42)]"
    : "block w-full origin-center select-none transition-transform duration-[650ms] [transform:translate(0px,0px)_scale(1)] group-hover/sv:[transform:translate(55%,-35%)_scale(0.42)]";

  // Lift the whole motif onto a forward 3D plane on hover, like the Motion and
  // Branding shapes, so it floats and tilts with the card's cursor rotation.
  const rootCls = reduced
    ? "pointer-events-none absolute inset-0 [transform-style:preserve-3d]"
    : "pointer-events-none absolute inset-0 [transform-style:preserve-3d] transition-transform duration-[650ms] [transform:translateZ(0px)] group-hover/sv:[transform:translateZ(60px)]";

  return (
    <div className={rootCls} style={reduced ? undefined : { transitionTimingFunction: settle }}>
      {/* Window frame — upper portion of the card, assembles on hover */}
      <div
        className="absolute left-1/2 top-[19%] w-[112%] -translate-x-1/2"
        style={{ aspectRatio: "238 / 180" }}
      >
        <svg
          viewBox="0 0 238 180"
          fill="none"
          className="block h-auto w-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="web-grad" x1="5" y1="22.5" x2="232" y2="174" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F499AF" />
              <stop offset="1" stopColor="#A66FE8" />
            </linearGradient>
          </defs>

          {/* Window outline */}
          <rect
            x="5.5"
            y="5.5"
            width="226"
            height="168"
            stroke="url(#web-grad)"
            className={frameCls}
            style={reduced ? undefined : { transformOrigin: "119px 90px", transition: motifTransition }}
          />

          {/* Corner squares — start at centre, fly to their corners */}
          {SQUARES.map((s, i) => (
            <rect
              key={i}
              x={s.x}
              y={s.y}
              width="12"
              height="12"
              fill="url(#web-grad)"
              className={squareBase}
              style={
                reduced
                  ? undefined
                  : ({
                      "--tx": `${s.tx}px`,
                      "--ty": `${s.ty}px`,
                      transition: motifTransition,
                    } as React.CSSProperties)
              }
            />
          ))}
        </svg>
      </div>

      {/* Cursor — large & centred at idle, shrinks into the frame on hover */}
      <div className="absolute left-1/2 top-1/2 w-[56%] -translate-x-1/2 -translate-y-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/services/web-cursor.svg"
          alt=""
          className={cursorCls}
          style={reduced ? undefined : { transitionTimingFunction: ease }}
        />
      </div>
    </div>
  );
}
