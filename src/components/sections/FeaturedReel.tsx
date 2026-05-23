"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { VimeoEmbed } from "@/components/ui/VimeoEmbed";
import { site } from "@/lib/data";

export function FeaturedReel() {
  return (
    <section className="relative overflow-hidden bg-bg2 px-6 py-24 md:px-12">
      <FadeIn className="mx-auto max-w-[1000px]">
        <SectionLabel>Showreel</SectionLabel>
        <SectionHeading>The Work in Motion</SectionHeading>

        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded border border-[rgba(200,125,232,0.2)] bg-purple-deep">
          <span className="absolute top-3 left-3 z-[3] h-6 w-6 border-t-2 border-l-2 border-[rgba(244,160,200,0.7)]" />
          <span className="absolute top-3 right-3 z-[3] h-6 w-6 border-t-2 border-r-2 border-[rgba(244,160,200,0.7)]" />
          <span className="absolute bottom-3 left-3 z-[3] h-6 w-6 border-b-2 border-l-2 border-[rgba(244,160,200,0.7)]" />
          <span className="absolute right-3 bottom-3 z-[3] h-6 w-6 border-r-2 border-b-2 border-[rgba(244,160,200,0.7)]" />
          <VimeoEmbed
            src={site.showreelVimeo}
            title="Ingrid Silfverberg showreel"
          />
        </div>

        <p className="mt-5 font-serif text-[0.95rem] tracking-wide text-muted italic">
          0:00 — Title sequence · 0:18 — Brand identity systems · 0:34 — Film
          direction · 0:52 — UI/UX motion · 1:10 — Marketing campaigns
        </p>
      </FadeIn>
    </section>
  );
}
