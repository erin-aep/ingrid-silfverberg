"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { footerServices, site } from "@/lib/data";

const socials = [
  { href: site.behance, label: "Behance" },
  { href: site.linkedin, label: "LinkedIn" },
  { href: site.vimeo, label: "Vimeo" },
  { href: site.instagram, label: "Instagram" },
].filter((s) => s.href) as { href: string; label: string }[];

/** Services menu + socials — the shared footer grid used on the home page
 *  (inside the Contact CTA section) and on the /contact page. */
export function FooterMenu({ delay = 0 }: { delay?: number }) {
  return (
    <FadeIn
      delay={delay}
      className="relative z-[2] mx-auto grid max-w-[1400px] gap-x-10 gap-y-12 md:grid-cols-[auto_1fr_auto]"
    >
      {/* SERVICES label */}
      <div className="font-mono text-[0.6rem] tracking-[0.2em] text-muted uppercase">
        Services
      </div>

      {/* service groups */}
      <div className="flex flex-wrap gap-x-12 gap-y-10">
        {footerServices.map((group) => (
          <div key={group.tag}>
            <span className="inline-flex rounded-full border border-[rgba(200,125,232,0.4)] px-3.5 py-1.5 font-mono text-[0.55rem] tracking-[0.18em] text-chrome2 uppercase">
              {group.tag}
            </span>
            <ul
              className={`mt-5 gap-x-12 gap-y-2.5 ${
                "cols" in group && group.cols === 2
                  ? "grid grid-flow-col grid-rows-3"
                  : "flex flex-col"
              }`}
            >
              {group.items.map((item) => (
                <li
                  key={item}
                  className="font-serif text-[clamp(1rem,1.2vw,1.1rem)] text-text/90"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* SOCIALS */}
      <div className="md:text-right">
        <div className="font-mono text-[0.6rem] tracking-[0.2em] text-muted uppercase">
          Socials
        </div>
        <ul className="mt-5 flex flex-col gap-2.5">
          {socials.map((s) => (
            <li key={s.label}>
              <Link
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="big"
                className="font-serif text-[clamp(1rem,1.2vw,1.15rem)] text-text/90 transition-colors hover:text-chrome1"
              >
                {s.label}
                <span aria-hidden className="ml-1 text-chrome3 text-[0.8em]">
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </FadeIn>
  );
}
