import type { Metadata } from "next";
import Link from "next/link";
import { BriefForm } from "@/components/sections/contact/BriefForm";
import { FooterMenu } from "@/components/layout/FooterMenu";
import { Footer } from "@/components/layout/Footer";
import { navLinks, site } from "@/lib/data";

export const metadata: Metadata = {
  title: "contact — ingrid silfverberg",
  description:
    "Start a project with Ingrid Silfverberg. Send a short brief — two things about your project and a rough budget are enough to start.",
  openGraph: {
    title: "contact — ingrid silfverberg",
    description:
      "Start a project with Ingrid Silfverberg. Send a short brief and get an honest answer.",
  },
};

export default function ContactPage() {
  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-[100] flex items-center justify-between bg-gradient-to-b from-[rgba(14,5,16,0.95)] to-transparent px-6 py-6 md:px-12">
        <Link
          href="/"
          className="font-display text-gradient-chrome text-[1.4rem] tracking-wide"
          data-cursor="big"
        >
          {site.name}
        </Link>
        <nav aria-label="Primary">
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={`/${link.href}`}
                  className="text-[0.65rem] tracking-[0.15em] text-muted uppercase transition-colors hover:text-chrome1"
                  data-cursor="big"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/"
          className="font-mono text-[0.6rem] tracking-[0.12em] text-chrome2 uppercase transition-colors hover:text-chrome1 md:hidden"
          data-cursor="big"
        >
          ← Home
        </Link>
      </header>

      <main id="main" className="min-h-screen bg-bg px-6 pt-36 pb-28 md:px-12 md:pt-44">
        <div className="mx-auto max-w-[1400px]">
          <BriefForm />
        </div>
      </main>

      {/* footer: services menu + socials, then the bottom bar */}
      <section className="relative overflow-hidden bg-bg2 px-6 pt-24 pb-14 md:px-12 md:pt-28 md:pb-16">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 55% 55% at 50% 100%, rgba(92,26,122,0.55) 0%, transparent 70%)",
          }}
        />
        <FooterMenu />
      </section>
      <Footer />
    </>
  );
}
