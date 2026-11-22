"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { FadeIn } from "@/components/ui/FadeIn";
import { MorphingCta } from "@/components/sections/cta/MorphingCta";
import { cta, site } from "@/lib/data";

const PINK_GRAD = "linear-gradient(90deg, #F499AF 0%, #A66FE8 100%)";
const INK = "#2b1030"; // deep plum — reads on the #FFDBE4 fill

export function CtaCard() {
  const reduced = usePrefersReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt toward the cursor — same feel as the Services cards.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 150, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [6, -6]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-6, 6]), spring);
  const onMove = (e: React.MouseEvent) => {
    if (reduced || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  // Bottom row: on hover the whole row fills #FFDBE4 from the cursor,
  // "Let's talk." becomes the email, and a "Copy my email" tag trails the cursor.
  const fillRef = useRef<HTMLDivElement>(null);
  const followRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [copied, setCopied] = useState(false);

  const bloom = (e: React.MouseEvent, open: boolean) => {
    if (reduced || !fillRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - r.left;
    const cy = e.clientY - r.top;
    const far = Math.ceil(
      Math.max(
        Math.hypot(cx, cy),
        Math.hypot(r.width - cx, cy),
        Math.hypot(cx, r.height - cy),
        Math.hypot(r.width - cx, r.height - cy),
      ),
    );
    fillRef.current.style.clipPath = `circle(${open ? far : 0}px at ${cx.toFixed(0)}px ${cy.toFixed(0)}px)`;
  };

  const trail = (e: React.MouseEvent) => {
    if (followRef.current)
      followRef.current.style.transform = `translate3d(${e.clientX + 18}px, ${e.clientY + 18}px, 0)`;
  };

  const copyEmail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  const talkCls =
    "font-display leading-none text-[clamp(1.75rem,4vw,3.75rem)] whitespace-nowrap";
  const emailCls =
    "font-display leading-none text-[clamp(1.25rem,2.6vw,2.4rem)] whitespace-nowrap";

  return (
    <section id="lets-talk" className="bg-bg px-6 py-20 md:px-12 md:py-28">
      <FadeIn>
        <div className={reduced ? undefined : "mx-auto max-w-[1200px] [perspective:1400px]"}>
          <motion.div
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            data-cursor="big"
            style={
              reduced
                ? undefined
                : { rotateX, rotateY, transformStyle: "preserve-3d" }
            }
            className="relative mx-auto flex min-h-[20rem] max-w-[1200px] flex-col justify-between gap-10 overflow-hidden rounded-[28px] border border-[rgba(205,129,228,0.22)] bg-[rgba(26,11,34,0.6)] p-8 will-change-transform md:aspect-[21/9] md:min-h-0 md:gap-0 md:p-14"
          >
            {/* soft inner glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(60% 70% at 85% 25%, rgba(166,111,232,0.18) 0%, transparent 70%), radial-gradient(50% 60% at 15% 30%, rgba(244,153,175,0.12) 0%, transparent 70%)",
              }}
            />

            {/* top row: headline + grid icon */}
            <div className="relative flex items-start justify-between gap-6">
              <div>
                <h2 className="font-display text-gradient-chrome text-[clamp(1.8rem,3.6vw,3.25rem)] leading-[1.05]">
                  {cta.lead[0]}
                  <br />
                  {cta.lead[1]}
                  <br />
                  <em className="italic">{cta.lead[2]}</em>
                </h2>
                <p className="font-serif mt-4 text-[clamp(0.8rem,1.1vw,1rem)] text-muted">
                  {cta.sub}
                </p>
              </div>
              <MorphingCta className="h-[clamp(3rem,7vw,7rem)] w-[clamp(3rem,7vw,7rem)] shrink-0 select-none" />
            </div>

            {/* full-bleed bottom row that fills #FFDBE4 on hover */}
            <button
              type="button"
              onClick={copyEmail}
              aria-label={`Copy email ${site.email}`}
              className="relative -mx-8 -mb-8 mt-6 block w-[calc(100%+4rem)] cursor-none overflow-hidden rounded-b-[28px] text-left md:-mx-14 md:-mb-14 md:w-[calc(100%+7rem)]"
              onMouseEnter={(e) => {
                setHover(true);
                bloom(e, true);
                trail(e);
              }}
              onMouseMove={trail}
              onMouseLeave={(e) => {
                setHover(false);
                bloom(e, false);
              }}
            >
              {/* thin divider sits above the fill */}
              <div className="absolute inset-x-8 top-0 z-10 h-px bg-[rgba(205,129,228,0.2)] md:inset-x-14" />

              {/* #FFDBE4 fill that blooms from the cursor */}
              <div
                ref={fillRef}
                aria-hidden
                className="absolute inset-0 bg-[#FFDBE4]"
                style={{
                  clipPath: reduced ? undefined : "circle(0px at 50% 100%)",
                  transition: reduced
                    ? undefined
                    : "clip-path 620ms cubic-bezier(0.22,1,0.36,1)",
                }}
              />

              <div className="relative flex items-center justify-end px-8 py-6 md:px-14 md:py-7">
                {/* text swap: "Let's talk." <-> email, stacked + right-aligned */}
                <span className="grid justify-items-end">
                  <span
                    className={`${talkCls} col-start-1 row-start-1 italic transition-opacity duration-300`}
                    style={{
                      opacity: hover ? 0 : 1,
                      backgroundImage: PINK_GRAD,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {cta.action}
                  </span>
                  <span
                    aria-hidden={!hover}
                    className={`${emailCls} col-start-1 row-start-1 self-center transition-opacity duration-300`}
                    style={{ opacity: hover ? 1 : 0, color: INK }}
                  >
                    {site.email}
                  </span>
                </span>
              </div>
            </button>
          </motion.div>
        </div>
      </FadeIn>

      {/* cursor-trailing "Copy my email" tag (Space Mono, pink→purple) */}
      <div
        ref={followRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[90] will-change-transform"
        style={{ opacity: hover ? 1 : 0, transition: "opacity 240ms ease" }}
      >
        <span
          className="block rounded-full px-5 py-2.5 font-mono text-[0.8rem] tracking-[0.04em] whitespace-nowrap text-[#FFF2F7]"
          style={{ backgroundImage: PINK_GRAD }}
        >
          {copied ? cta.copied : cta.copyLabel}
        </span>
      </div>
    </section>
  );
}
