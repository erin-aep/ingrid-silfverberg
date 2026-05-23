"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HeroSpline } from "@/components/sections/HeroSpline";
import { disciplines, site } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const ctaPrimary =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-chrome1 to-chrome2 px-8 py-3 text-[0.65rem] tracking-[0.15em] text-bg uppercase transition-shadow hover:shadow-[0_0_30px_rgba(200,125,232,0.45)]";

const ctaSecondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(200,125,232,0.35)] bg-[rgba(92,26,122,0.15)] px-8 py-3 text-[0.65rem] tracking-[0.15em] text-chrome1 uppercase backdrop-blur-sm transition-all hover:border-chrome1 hover:bg-[rgba(192,24,110,0.15)]";

export function Hero() {
  const reduced = usePrefersReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.12, delayChildren: 0.2 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-8 pt-24 pb-20"
    >
      <HeroSpline />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[rgba(14,5,16,0.35)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(14,5,16,0.55) 100%),
            radial-gradient(ellipse 50% 40% at 50% 80%, rgba(92,26,122,0.35) 0%, transparent 70%)
          `,
        }}
      />

      <motion.div
        className="pointer-events-none relative z-[2] max-w-4xl text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={item}
          className="mb-6 flex items-center justify-center gap-4 text-[0.6rem] tracking-[0.25em] text-muted uppercase"
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-chrome2" />
          multidisciplinary artist
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-chrome2" />
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display mb-4 text-[clamp(3.5rem,9vw,8rem)] leading-none text-gradient-hero drop-shadow-[0_0_40px_rgba(200,125,232,0.3)] animate-shimmer"
        >
          {site.name}
        </motion.h1>

        <motion.p
          variants={item}
          className="font-serif mb-8 text-[clamp(1rem,2.5vw,1.5rem)] tracking-wide text-muted italic"
        >
          {site.tagline}
        </motion.p>

        <motion.div
          variants={item}
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          {disciplines.map((d) => (
            <span
              key={d}
              className="rounded-full border border-[rgba(200,125,232,0.3)] bg-[rgba(92,26,122,0.25)] px-3.5 py-1.5 text-[0.58rem] tracking-[0.12em] text-chrome2 uppercase backdrop-blur-sm"
            >
              {d}
            </span>
          ))}
        </motion.div>

        <motion.div
          variants={item}
          className="pointer-events-auto flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="#work" className={ctaPrimary} data-cursor="big">
            <span
              className="absolute inset-0 bg-gradient-to-br from-chrome2 to-chrome3 opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
            <span className="relative z-[1]">View Work</span>
          </Link>
          <Link
            href={site.tallyProjectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={ctaSecondary}
            data-cursor="big"
          >
            Start a project →
          </Link>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2 text-[0.55rem] tracking-[0.15em] text-muted uppercase">
        <div className="h-10 w-px bg-gradient-to-b from-transparent to-chrome2 animate-scrollpulse" />
        <span>PLZ SCROLL</span>
      </div>
    </section>
  );
}
