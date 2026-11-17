"use client";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Video Editing motif. Idle: the playhead indicator (edit-indicator.svg) alone,
 * large and centred. Hover plays a short sequence:
 *   1. the indicator scales down and rises to the top of the playhead,
 *   2. the vertical line grows in beneath it,
 *   3. the timeline clips ease in from the left, staggered.
 * Reduced motion shows the assembled timeline with no travel.
 *
 * Timeline bars match edit-timeline.svg (viewBox 232×62): three staggered rows
 * of rounded clips that the playhead line crosses.
 */
const BARS = [
  { x: 0, y: 0, w: 145, h: 17 },
  { x: 84, y: 23, w: 148, h: 17 },
  { x: 62, y: 45, w: 34, h: 17 },
  { x: 161, y: 45, w: 34, h: 17 },
] as const;

export function EditIcon() {
  const reduced = usePrefersReducedMotion();
  const smooth = "cubic-bezier(0.19,1,0.22,1)";
  const spring = "cubic-bezier(0.34,1.3,0.5,1)";

  const rootCls = reduced
    ? "pointer-events-none absolute inset-0 [transform-style:preserve-3d] [transform:translateY(10%)]"
    : "pointer-events-none absolute inset-0 [transform-style:preserve-3d] transition-transform duration-[1000ms] [transform:translateY(10%)_translateZ(0px)] group-hover/sv:[transform:translateY(10%)_translateZ(60px)_scale(1.25)]";

  // Enter: staggered delay via var(--d) + a longer duration (both only while
  // hovered). Exit: the base transition below — quick and un-delayed — so the
  // bars clear out promptly instead of lingering on their enter stagger.
  const barCls = reduced
    ? "opacity-0 group-hover/sv:opacity-100"
    : "opacity-0 [transform:scaleX(0)] group-hover/sv:opacity-100 group-hover/sv:[transform:scaleX(1)] group-hover/sv:[transition-duration:1000ms] group-hover/sv:[transition-delay:var(--d)]";

  const lineCls = reduced
    ? "block h-full w-full select-none opacity-0 group-hover/sv:opacity-100"
    : "block h-full w-full origin-top select-none opacity-0 [transform:scaleY(0)] group-hover/sv:opacity-100 group-hover/sv:[transform:scaleY(1)]";

  const indicatorCls = reduced
    ? "block w-full select-none [transform:translate(0px,0px)_scale(1)] group-hover/sv:[transform:translate(0px,-115%)_scale(0.5)]"
    : "block w-full origin-center select-none [transform:translate(0px,0px)_scale(1)] group-hover/sv:[transform:translate(0px,-61%)_scale(0.25)]";

  return (
    <div className={rootCls} style={reduced ? undefined : { transitionTimingFunction: smooth }}>
      {/* Timeline clips — ease in from the left, staggered (stage 3) */}
      <div
        className="absolute left-1/2 top-[34%] w-[80%] -translate-x-1/2"
        style={{ aspectRatio: "232 / 62" }}
      >
        <svg viewBox="0 0 232 62" fill="none" className="block w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="edit-grad" x1="0" y1="31" x2="232" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F499AF" />
              <stop offset="1" stopColor="#A66FE8" />
            </linearGradient>
          </defs>
          {BARS.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx="3"
              fill="url(#edit-grad)"
              className={barCls}
              style={
                reduced
                  ? undefined
                  : ({
                      transformBox: "fill-box",
                      transformOrigin: "left center",
                      // Base (exit) transition: fast, no delay.
                      transition: `transform 520ms ${smooth}, opacity 400ms linear`,
                      // Per-bar enter delay, consumed by the group-hover class.
                      "--d": `${660 + i * 130}ms`,
                    } as React.CSSProperties)
              }
            />
          ))}
        </svg>
      </div>

      {/* Playhead line — grows in beneath the indicator (stage 2) */}
      <div
        className="absolute left-1/2 top-[25%] h-[30%] -translate-x-1/2"
        style={{ aspectRatio: "12 / 109" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/services/edit-frame-line.svg"
          alt=""
          className={lineCls}
          style={reduced ? undefined : { transition: `transform 650ms ${smooth}, opacity 340ms linear`, transitionDelay: "320ms" }}
        />
      </div>

      {/* Indicator — large & centred at idle; rises and shrinks on hover (stage 1) */}
      <div className="absolute left-1/2 top-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/services/edit-indicator.svg"
          alt=""
          className={indicatorCls}
          style={reduced ? undefined : { transition: `transform 680ms ${spring}` }}
        />
      </div>
    </div>
  );
}
