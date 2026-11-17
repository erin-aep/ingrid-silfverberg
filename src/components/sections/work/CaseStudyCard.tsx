"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
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

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  const reduced = usePrefersReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  // ── background parallax: drifts as the card travels through the viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const bgYRaw = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const bgY = useSpring(bgYRaw, { stiffness: 120, damping: 30, mass: 0.4 });

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
      {/* visual block — bg drifts with the cursor; inner media tilts in 3D */}
      <div
        ref={blockRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-[rgba(205,129,228,0.18)] bg-bg2"
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

        {/* inner media container — tilts in 3D toward the cursor */}
        <div className="absolute inset-0 flex items-center justify-center p-[7%] [perspective:1000px]">
          <motion.div
            data-cursor="big"
            style={reduced ? undefined : { rotateX, rotateY }}
            className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_24px_60px_-20px_rgba(10,4,16,0.9)] will-change-transform"
          >
            <Media study={study} />
            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
          </motion.div>
        </div>
      </div>

      {/* meta line: Category • Year • tags */}
      <p className="mt-5 font-mono text-[0.62rem] tracking-[0.2em] uppercase">
        <span className="text-[#CD81E4]">
          {study.category} • {study.year}
        </span>
        {study.tags.length > 0 && (
          <span className="text-[#DAD1E0]"> • {study.tags.join(" • ")}</span>
        )}
      </p>

      {/* title — chrome gradient wipes left-to-right over the base on hover */}
      <h3 className="mt-2 font-display text-[clamp(1.5rem,2.6vw,2.3rem)] leading-[1.1]">
        <span className="relative inline-block">
          <span className="text-[#DAD1E0]">{study.title}</span>
          <span
            aria-hidden
            className="text-gradient-hero absolute inset-0 [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[clip-path:inset(0_0_0_0)] motion-reduce:transition-none"
          >
            {study.title}
          </span>
        </span>
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
