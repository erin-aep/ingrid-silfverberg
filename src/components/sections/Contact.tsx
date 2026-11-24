"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { FooterMenu } from "@/components/layout/FooterMenu";
import { site } from "@/lib/data";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-bg2 px-6 pt-24 pb-14 md:px-12 md:pt-28 md:pb-16"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 55% at 50% 100%, rgba(92,26,122,0.55) 0%, transparent 70%)",
        }}
      />

      {/* top: CTA */}
      <FadeIn className="relative z-[2] mx-auto max-w-[920px] text-center">
        <h2 className="font-display text-[clamp(2rem,5.6vw,4rem)] leading-[1.08] text-gradient-hero drop-shadow-[0_0_30px_rgba(244,160,200,0.25)]">
          Let&apos;s turn your vision into motion.
          <br />
          Hit me up!
        </h2>

        <p className="font-serif mx-auto mt-6 max-w-[42ch] text-[clamp(1rem,1.3vw,1.2rem)] text-muted italic">
          Open to freelance, collaboration, and passion projects worldwide.
        </p>

        <Link
          href="/contact"
          className="group relative mt-9 inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-br from-chrome1 to-chrome2 px-8 py-3.5 text-[0.65rem] tracking-[0.15em] text-bg uppercase shadow-[0_4px_20px_-6px_rgba(232,53,154,0.45)] transition-[box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_16px_46px_-8px_rgba(232,53,154,0.7)] motion-reduce:transition-none"
          data-cursor="big"
        >
          {/* deeper gradient fades in on hover */}
          <span
            className="absolute inset-0 bg-gradient-to-br from-chrome2 to-chrome3 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
          />
          {/* light sheen sweeps across on hover */}
          <span
            className="pointer-events-none absolute inset-0 -translate-x-[140%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[140%] motion-reduce:hidden"
            aria-hidden
          />
          <span className="relative z-[1]">Start a project</span>
          <span
            aria-hidden
            className="relative z-[1] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 motion-reduce:transition-none"
          >
            →
          </span>
        </Link>

        <div className="mt-9">
          <a
            href={`mailto:${site.email}`}
            className="text-gradient-chrome font-mono text-[clamp(0.85rem,1.7vw,1.1rem)] tracking-[0.02em]"
            data-cursor="big"
          >
            {site.email}
          </a>
        </div>
      </FadeIn>

      {/* bottom: services menu + socials */}
      <div className="mt-20 md:mt-28">
        <FooterMenu delay={0.1} />
      </div>
    </section>
  );
}
