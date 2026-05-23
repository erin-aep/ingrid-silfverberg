"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AboutPortrait } from "@/components/sections/AboutPortrait";

const stats = [
  { num: "5+", label: "Disciplines" },
  { num: "✦", label: "Award-winning" },
  { num: "∞", label: "Global reach" },
] as const;

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-bg2 px-6 py-24 md:px-12">
      <div className="mx-auto grid max-w-[1000px] items-center gap-12 md:grid-cols-2 md:gap-20">
        <FadeIn>
          <div className="relative aspect-[4/5] overflow-hidden rounded border border-[rgba(200,125,232,0.2)] bg-purple-deep">
            <AboutPortrait />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <SectionLabel>About</SectionLabel>
          <SectionHeading>The Artist</SectionHeading>

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(60,200,100,0.2)] bg-[rgba(60,200,100,0.1)] px-3 py-1.5 text-[0.58rem] tracking-[0.1em] text-[#7ded98] uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7ded98]" />
            Available for projects
          </div>

          <p className="font-serif mb-8 text-[1.15rem] leading-[1.8] text-[rgba(240,232,248,0.8)]">
            I&apos;m a multidisciplinary artist who moves between motion design,
            branding, film, and UI/UX without ever fully settling into one. My
            work has won awards, played at festivals, and been made for brands
            that wanted something that actually moves people — literally and
            otherwise.
            <br />
            <br />
            I believe the best creative work doesn&apos;t respect category
            lines. Based in the Philippines. Working globally.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-t border-[rgba(200,125,232,0.2)] pt-4"
              >
                <p className="font-display text-gradient-chrome text-[2.2rem]">
                  {stat.num}
                </p>
                <p className="mt-1 text-[0.55rem] tracking-[0.12em] text-muted uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
