"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { services } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Services() {
  const reduced = usePrefersReducedMotion();

  return (
    <section id="services" className="bg-bg px-6 py-24 md:px-12">
      <div className="mx-auto max-w-[1000px]">
        <FadeIn>
          <SectionLabel>What I do</SectionLabel>
          <SectionHeading>Services</SectionHeading>
        </FadeIn>

        <div className="mt-10 overflow-hidden rounded border border-[rgba(200,125,232,0.15)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {services.map((service, i) => (
              <FadeIn
                key={service.num}
                delay={i * 0.05}
                className="h-full min-w-0"
              >
                <motion.div
                  className="flex h-full min-h-full flex-col border-b border-[rgba(200,125,232,0.15)] bg-bg2 p-8 transition-colors hover:bg-[rgba(92,26,122,0.3)] sm:border-r lg:border-b-0 xl:last:border-r-0"
                  whileHover={
                    reduced
                      ? undefined
                      : { y: -2, transition: { duration: 0.25 } }
                  }
                >
                  <p className="mb-4 text-[0.55rem] tracking-[0.15em] text-magenta">
                    {service.num}
                  </p>
                  <h3 className="font-display mb-3 text-[1.4rem] leading-[1.1] text-gradient-chrome xl:text-[1.6rem]">
                    {service.title}
                  </h3>
                  <p className="font-serif flex-1 text-[0.95rem] leading-relaxed text-muted">
                    {service.description}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
