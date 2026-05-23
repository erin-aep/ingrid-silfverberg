"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { testimonials } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const AUTO_ADVANCE_MS = 14000;

export function Testimonials() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [next, reduced]);

  const current = testimonials[index];

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-bg px-6 py-24 md:px-12"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 40% 50% at 50% 50%, rgba(92,26,122,0.25) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-[2] mx-auto max-w-[900px] text-center">
        <FadeIn>
          <SectionLabel className="justify-center">
            Client voices
          </SectionLabel>
          <SectionHeading>Testimonials</SectionHeading>
        </FadeIn>

        <div className="relative mt-12 min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current.id}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="px-4"
            >
              <p className="font-serif text-[clamp(1.25rem,3vw,1.75rem)] leading-[1.6] text-[rgba(240,232,248,0.9)] italic">
                &ldquo;{current.quote}&rdquo;
              </p>
              <footer className="mt-8">
                <cite className="font-display text-gradient-chrome text-xl not-italic">
                  {current.name}
                </cite>
                <p className="mt-2 text-[0.58rem] tracking-[0.12em] text-muted uppercase">
                  {current.role}
                  {" · "}
                  {current.companyUrl ? (
                    <Link
                      href={current.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-chrome2 transition-colors hover:text-chrome1"
                      data-cursor="big"
                    >
                      {current.company}
                    </Link>
                  ) : (
                    current.company
                  )}
                </p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="rounded-full border border-[rgba(200,125,232,0.3)] px-4 py-2 text-[0.58rem] tracking-[0.12em] text-chrome2 uppercase transition-colors hover:border-chrome1 hover:text-chrome1"
            data-cursor="big"
          >
            Prev
          </button>
          <div className="flex gap-2" role="tablist" aria-label="Testimonials">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show testimonial from ${t.name}`}
                onClick={() => setIndex(i)}
                data-cursor="big"
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? "w-8 bg-gradient-to-r from-chrome1 to-chrome2"
                    : "w-2 bg-[rgba(200,125,232,0.35)]"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="rounded-full border border-[rgba(200,125,232,0.3)] px-4 py-2 text-[0.58rem] tracking-[0.12em] text-chrome2 uppercase transition-colors hover:border-chrome1 hover:text-chrome1"
            data-cursor="big"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
