"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { CaseStudy } from "@/lib/data";

/** The media that plays inside the inner container (muted, looping). */
function Media({ study }: { study: CaseStudy }) {
  if (study.video) {
    return (
      <video
        className="h-full w-full object-cover"
        src={study.video}
        poster={study.poster}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }
  if (study.gif) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={study.gif}
        alt={study.title}
        className="h-full w-full object-cover"
      />
    );
  }
  if (study.poster) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={study.poster}
        alt={study.title}
        className="h-full w-full object-cover"
      />
    );
  }
  // Branded placeholder until a clip is provided.
  return (
    <div className="relative h-full w-full bg-[#0c0510]">
      <div className="grid-texture absolute inset-0 opacity-40" aria-hidden />
      <div
        className="absolute inset-0 flex items-center justify-center font-mono text-[0.55rem] tracking-[0.3em] text-[#CD81E4]/50 uppercase"
        aria-hidden
      >
        {study.category}
      </div>
    </div>
  );
}

const MAX_WARP_DEG = 17;

export function CaseStudyCard({
  study,
  velFactor,
}: {
  study: CaseStudy;
  /** Shared scroll-speed intensity (0..1); settles to 0 when idle. */
  velFactor?: MotionValue<number>;
}) {
  const reduced = usePrefersReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  // ── background parallax: drifts as the card travels through the viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // ── scroll warp direction: the card's centre crossing the window. 0.5 = the
  //    middle line (pivot); above it faces down, below it faces up. Multiplied
  //    by the shared scroll-speed factor so it only warps while scrolling.
  const { scrollYProgress: centerProgress } = useScroll({
    target: cardRef,
    offset: ["center end", "center start"],
  });
  const warpDir = useTransform(centerProgress, [0, 1], [1, -1]); // bottom +1 → top −1
  const warpX = useTransform(() =>
    velFactor ? warpDir.get() * MAX_WARP_DEG * velFactor.get() : 0,
  );
  const bgYRaw = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const bgY = useSpring(bgYRaw, { stiffness: 120, damping: 30, mass: 0.4 });

  // ── Lusion-style scroll reveal: the inner media + text emerge from the centre
  //    of the viewport (scale up + fade in), then recede as the card leaves.
  //    `reveal` plateaus at 1 while the card sits in the central band.
  const reveal = useSpring(
    useTransform(scrollYProgress, [0.08, 0.3, 0.7, 0.92], [0, 1, 1, 0]),
    { stiffness: 140, damping: 32, mass: 0.4 },
  );
  const mediaOpacity = useTransform(reveal, [0, 0.6], [0, 1]);
  const textY = useTransform(reveal, [0, 1], [20, 0]);
  const titleClipPct = useTransform(reveal, [0, 1], [100, 0]);
  const titleClip = useMotionTemplate`inset(${titleClipPct}% 0 0 0)`;

  // ── entrance scale (0.75 → 1, eased) as the card enters, pivoting about the
  //    CENTRE OF THE PAGE so the background grows outward from the viewport
  //    middle rather than from its own centre.
  const entryScale = useSpring(
    useTransform(scrollYProgress, [0, 0.45], [0.75, 1], { clamp: true }),
    { stiffness: 120, damping: 28, mass: 0.5 },
  );
  // Scale pivots on the viewport's horizontal centre (the gap between the two
  // columns) and the card's OWN vertical centre — so the card grows outward
  // from the centre line without shifting up or down.
  const measureRef = useRef<HTMLDivElement>(null);
  const originX = useMotionValue(0);
  const transformOrigin = useMotionTemplate`${originX}px 50%`;

  useLayoutEffect(() => {
    const measure = () => {
      const el = measureRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      originX.set(window.innerWidth / 2 - r.left);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [originX]);

  // ── subtle 3D tilt of the inner media toward the cursor (reusable pattern)
  const px = useMotionValue(0); // -0.5 .. 0.5
  const py = useMotionValue(0);
  const spring = { stiffness: 150, damping: 20, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), spring);
  // background drifts the opposite way for subtle parallax depth
  const bgX = useSpring(useTransform(px, [-0.5, 0.5], [16, -16]), spring);
  const bgYc = useSpring(useTransform(py, [-0.5, 0.5], [16, -16]), spring);

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !blockRef.current) return;
    const r = blockRef.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const inner = (
    <>
      {/* visual block — grows from page centre on entry, warps (rotateX) with
          scroll velocity, bg drifts with the cursor, inner media tilts in 3D */}
      <div ref={measureRef}>
      <motion.div
        style={reduced ? undefined : { scale: entryScale, transformOrigin }}
        className="will-change-transform"
      >
      <div className="[perspective:900px]">
      <motion.div
        ref={blockRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={reduced || !velFactor ? undefined : { rotateX: warpX }}
        className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[rgba(205,129,228,0.18)] bg-bg2 will-change-transform"
      >
        {/* backdrop: scroll parallax (y) + subtle cursor drift (x/y) */}
        <motion.div
          aria-hidden
          style={{ y: reduced ? 0 : bgY }}
          className="absolute -top-[12%] left-0 h-[124%] w-full"
        >
          <motion.div
            style={reduced ? undefined : { x: bgX, y: bgYc }}
            className="relative h-full w-full scale-[1.08] will-change-transform"
          >
            {study.background ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={study.background}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_0%,#2a0f3a_0%,#1a0b22_58%,#0e0510_100%)]" />
                <div className="grid-texture absolute inset-0 opacity-60" />
                <div className="absolute top-[52%] left-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#8A2FB5_0%,transparent_70%)] opacity-50 blur-3xl" />
              </>
            )}
          </motion.div>
        </motion.div>

        {/* inner media — emerges from centre on scroll + tilts toward the cursor */}
        <div className="absolute inset-0 flex items-center justify-center p-[7%] [perspective:1000px]">
          <motion.div
            data-cursor="big"
            style={
              reduced ? undefined : { rotateX, rotateY, opacity: mediaOpacity }
            }
            className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_24px_60px_-20px_rgba(10,4,16,0.9)] will-change-transform"
          >
            <Media study={study} />
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
          </motion.div>
        </div>
      </motion.div>
      </div>
      </motion.div>
      </div>

      {/* meta line: Category • Year • tags — fades/slides in and out on scroll */}
      <motion.p
        style={reduced ? undefined : { opacity: reveal, y: textY }}
        className="mt-5 font-mono text-[0.62rem] tracking-[0.2em] uppercase"
      >
        <span className="text-[#CD81E4]">
          {study.categoryLabel ?? study.category} • {study.year}
        </span>
        {study.tags.length > 0 && (
          <span className="text-[#DAD1E0]"> • {study.tags.join(" • ")}</span>
        )}
      </motion.p>

      {/* title — reveals with a rising mask on scroll; chrome wipe on hover */}
      <h3 className="mt-2 font-display text-[clamp(1.5rem,2.6vw,2.3rem)] leading-[1.1]">
        <motion.span
          style={
            reduced ? undefined : { opacity: reveal, y: textY, clipPath: titleClip }
          }
          className="relative inline-block"
        >
          <span className="text-[#DAD1E0]">{study.title}</span>
          <span
            aria-hidden
            className="text-gradient-hero absolute inset-0 [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[clip-path:inset(0_0_0_0)] motion-reduce:transition-none"
          >
            {study.title}
          </span>
        </motion.span>
      </h3>
    </>
  );

  const className = "group block";

  if (study.href) {
    return (
      <article ref={cardRef}>
        <Link href={study.href} className={className}>
          {inner}
        </Link>
      </article>
    );
  }

  return (
    <article ref={cardRef} className={className}>
      {inner}
    </article>
  );
}
