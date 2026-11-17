"use client";

import { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CaseStudyCard } from "@/components/sections/work/CaseStudyCard";
import { caseStudies, workFilters, type WorkCategory } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function CaseStudies() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<WorkCategory>("All");

  // ── scroll-velocity warp: scroll SPEED sets the tilt intensity (0..1), each
  //    card's position in the window sets the direction. Springs back to 0
  //    (flat) when the scroll stops.
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const velAbs = useTransform(scrollVelocity, (v) =>
    Math.min(Math.abs(v) / 2200, 1),
  );
  const velFactor = useSpring(velAbs, {
    stiffness: 100,
    damping: 20,
    mass: 0.6,
  });

  const filtered = useMemo(
    () =>
      active === "All"
        ? caseStudies
        : caseStudies.filter((s) => s.category === active),
    [active],
  );

  return (
    <section id="work" className="bg-bg px-6 py-24 md:px-0">
      <div className="mx-auto w-full max-w-[1760px] md:w-4/5">
        <FadeIn>
          <SectionHeading>Case Studies</SectionHeading>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="my-8 flex flex-wrap gap-2">
            {workFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActive(filter)}
                data-cursor="big"
                className={`rounded-full border px-4 py-1.5 text-[0.58rem] tracking-[0.12em] uppercase transition-all ${
                  active === filter
                    ? "border-chrome2 bg-[rgba(92,26,122,0.4)] text-chrome1"
                    : "border-[rgba(200,125,232,0.25)] text-muted hover:border-chrome2 hover:bg-[rgba(92,26,122,0.4)] hover:text-chrome1"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </FadeIn>

        <motion.div
          layout={!reduced}
          className="mt-4 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-20"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((study) => (
              <motion.div
                key={study.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
              >
                <CaseStudyCard study={study} velFactor={reduced ? undefined : velFactor} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
