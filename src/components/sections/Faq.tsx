"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { faq, site } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Faq() {
  const reduced = usePrefersReducedMotion();
  // One open at a time; the first question starts open.
  const [open, setOpen] = useState<string | null>("01-0");

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-bg px-6 py-24 md:px-12 md:py-32"
    >
      {/* soft radial glow, bottom-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 55% at 12% 85%, rgba(92,26,122,0.22) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-[2] mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16 lg:gap-24">
        {/* left: intro (sticky on desktop) */}
        <FadeIn className="md:sticky md:top-28 md:h-fit">
          <SectionLabel>{faq.label}</SectionLabel>
          <SectionHeading>{faq.heading}</SectionHeading>
          <p className="font-serif mt-2 max-w-sm text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.6] text-[rgba(240,232,248,0.6)] italic">
            A few things clients usually ask before we start. Still curious about
            something?
          </p>
          <Link
            href={site.tallyProjectUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="big"
            className="group mt-6 inline-flex items-center gap-2 text-[0.62rem] tracking-[0.18em] text-chrome2 uppercase transition-colors hover:text-chrome1"
          >
            Just ask
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </FadeIn>

        {/* right: grouped accordion */}
        <FadeIn delay={0.1} className="flex flex-col gap-12">
          {faq.groups.map((group) => (
            <div key={group.id}>
              {/* group header */}
              <div className="mb-2 flex items-center gap-3">
                <span className="font-mono text-[0.68rem] tracking-[0.16em] text-gradient-chrome">
                  {group.id}
                </span>
                <span
                  aria-hidden
                  className="h-px flex-1 bg-[rgba(200,125,232,0.18)]"
                />
                <span className="font-mono text-[0.62rem] tracking-[0.2em] text-chrome2 uppercase">
                  {group.title}
                </span>
              </div>

              <ul>
                {group.items.map((item, i) => {
                  const key = `${group.id}-${i}`;
                  const isOpen = open === key;
                  const steps = "steps" in item ? item.steps : null;
                  const aAfter = "aAfter" in item ? item.aAfter : null;
                  const panelId = `faq-panel-${key}`;
                  const btnId = `faq-btn-${key}`;

                  return (
                    <li
                      key={key}
                      className="border-b border-[rgba(200,125,232,0.14)] first:border-t"
                    >
                      <button
                        type="button"
                        id={btnId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpen(isOpen ? null : key)}
                        data-cursor="big"
                        className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                      >
                        <span
                          className={`font-serif text-[clamp(1.1rem,1.7vw,1.4rem)] leading-snug transition-colors duration-300 ${
                            isOpen
                              ? "text-chrome1"
                              : "text-text group-hover:text-chrome2"
                          }`}
                        >
                          {item.q}
                        </span>
                        {/* plus / minus indicator */}
                        <span
                          aria-hidden
                          className="relative mt-1 h-4 w-4 shrink-0"
                        >
                          <span className="absolute top-1/2 left-0 h-px w-4 -translate-y-1/2 bg-chrome2" />
                          <span
                            className={`absolute top-0 left-1/2 h-4 w-px -translate-x-1/2 bg-chrome2 transition-transform duration-300 ${
                              isOpen ? "scale-y-0" : "scale-y-100"
                            }`}
                          />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={panelId}
                            role="region"
                            aria-labelledby={btnId}
                            key="panel"
                            initial={reduced ? false : { height: 0, opacity: 0 }}
                            animate={
                              reduced
                                ? { opacity: 1 }
                                : { height: "auto", opacity: 1 }
                            }
                            exit={
                              reduced
                                ? { opacity: 0 }
                                : { height: 0, opacity: 0 }
                            }
                            transition={{ duration: 0.45, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="max-w-[46ch] pb-7 font-serif text-[clamp(0.95rem,1.15vw,1.08rem)] leading-[1.7] text-[rgba(240,232,248,0.68)]">
                              <p>{item.a}</p>

                              {steps && (
                                <ol className="mt-4 space-y-2.5">
                                  {steps.map((s) => (
                                    <li
                                      key={s.term}
                                      className="flex flex-col gap-0.5 border-l border-[rgba(200,125,232,0.25)] pl-4 sm:flex-row sm:gap-2"
                                    >
                                      <span className="font-mono text-[0.72rem] tracking-[0.1em] whitespace-nowrap text-gradient-chrome uppercase sm:mt-1">
                                        {s.term}
                                      </span>
                                      <span>{s.def}</span>
                                    </li>
                                  ))}
                                </ol>
                              )}

                              {aAfter && <p className="mt-4">{aAfter}</p>}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
