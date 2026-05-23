"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { site } from "@/lib/data";

const socialLinks = [
  {
    href: site.instagram,
    label: `◎ ${site.instagramHandle}`,
    external: true,
  },
  { href: `mailto:${site.email}`, label: "✉ Send an email", external: false },
  { href: site.vimeo, label: "▶ Vimeo", external: true },
  { href: site.behance, label: "◈ Behance", external: true },
] as const;

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-bg2 px-6 py-24 text-center md:px-12"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(92,26,122,0.6) 0%, transparent 70%)",
        }}
      />

      <FadeIn className="relative z-[2] mx-auto max-w-[700px]">
        <SectionLabel className="justify-center">
          Let&apos;s work together
        </SectionLabel>

        <h2 className="font-display mb-8 text-[clamp(1.75rem,5vw,3.5rem)] leading-[1.15] text-gradient-hero drop-shadow-[0_0_30px_rgba(244,160,200,0.3)]">
          Let&apos;s turn your vision into motion – get in touch.
        </h2>

        <p className="font-serif mb-8 text-[1.2rem] text-muted italic">
          Open to freelance, collaboration, and passion projects worldwide.
        </p>

        <Link
          href={site.tallyProjectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative mb-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-chrome1 to-chrome2 px-8 py-3.5 text-[0.65rem] tracking-[0.15em] text-bg uppercase"
          data-cursor="big"
        >
          <span
            className="absolute inset-0 bg-gradient-to-br from-chrome2 to-chrome3 opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
          <span className="relative z-[1]">Start a project →</span>
        </Link>

        <div>
          <a
            href={`mailto:${site.email}`}
            className="text-gradient-chrome text-base"
            data-cursor="big"
          >
            {site.email}
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(200,125,232,0.3)] bg-[rgba(92,26,122,0.15)] px-5 py-2.5 text-[0.6rem] tracking-[0.12em] text-chrome2 uppercase transition-all hover:border-chrome1 hover:bg-[rgba(192,24,110,0.15)] hover:text-chrome1"
              data-cursor="big"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
