"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { VimeoEmbed } from "@/components/ui/VimeoEmbed";
import {
  workFilters,
  workItems,
  type WorkCategory,
  type WorkItem,
} from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const layoutClasses: Record<WorkItem["layout"], string> = {
  tall: "md:col-span-6 md:row-span-2 min-h-[280px] md:min-h-0",
  medium: "md:col-span-4",
  small: "md:col-span-4",
  wide: "md:col-span-8 min-h-[240px]",
};

function WorkCard({ item }: { item: WorkItem }) {
  const reduced = usePrefersReducedMotion();
  const hasVideo = Boolean(item.vimeoEmbed);

  const inner = (
    <>
      {item.award && (
        <span
          className="absolute top-2.5 right-2.5 z-[3] max-w-[min(100%,12rem)] rounded-full bg-gradient-to-br from-magenta to-chrome3 px-2.5 py-1 text-[0.48rem] leading-tight tracking-[0.08em] text-white uppercase"
          title={item.awardNote}
        >
          ✦ Award{item.awardNote ? ` · ${item.awardNote}` : ""}
        </span>
      )}

      {hasVideo && item.vimeoEmbed ? (
        <div className="absolute inset-0">
          <VimeoEmbed src={item.vimeoEmbed} title={item.title} />
          <div className="absolute inset-0 bg-[rgba(14,5,16,0.35)] transition-opacity group-hover:bg-[rgba(14,5,16,0.55)]" />
        </div>
      ) : (
        <div
          className={`work-theme-${item.theme} absolute inset-0`}
          aria-hidden
        />
      )}

      <div className="relative z-[2] mt-auto flex h-full min-h-[200px] flex-col justify-end p-4">
        {!hasVideo && (
          <div className="absolute inset-0 bg-[rgba(14,5,16,0.6)] opacity-0 transition-opacity group-hover:opacity-100" />
        )}
        <div
          className={`relative z-[2] transition-all ${
            hasVideo
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          }`}
        >
          <h3 className="font-display text-gradient-chrome text-[1.15rem] md:text-[1.3rem]">
            {item.title}
          </h3>
          <p className="mt-1 text-[0.5rem] tracking-[0.12em] text-muted uppercase">
            {item.tags}
          </p>
        </div>
      </div>
    </>
  );

  const className = `group relative flex flex-col overflow-hidden rounded border border-[rgba(200,125,232,0.1)] transition-colors hover:border-[rgba(244,160,200,0.4)] ${layoutClasses[item.layout]} col-span-12 min-h-[200px]`;

  if (item.href) {
    return (
      <motion.article
        layout={!reduced}
        initial={reduced ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.35 }}
        className={className}
        data-cursor="big"
      >
        <Link href={item.href} className="flex min-h-[200px] flex-1 flex-col">
          {inner}
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      layout={!reduced}
      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className={className}
      data-cursor="big"
    >
      {inner}
    </motion.article>
  );
}

export function SelectedWork() {
  const [active, setActive] = useState<WorkCategory>("All");

  const filtered = useMemo(() => {
    if (active === "All") return workItems;
    return workItems.filter((w) => w.categories.includes(active));
  }, [active]);

  return (
    <section id="work" className="bg-bg px-6 py-24 md:px-12">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <SectionLabel>Selected work</SectionLabel>
          <SectionHeading>Projects</SectionHeading>
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
          layout
          className="grid auto-rows-[minmax(200px,auto)] grid-cols-12 gap-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <WorkCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
