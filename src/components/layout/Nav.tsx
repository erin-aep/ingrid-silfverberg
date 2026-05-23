"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { navLinks, site } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function Nav() {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.header
      initial={reduced ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 right-0 left-0 z-[100] flex items-center justify-between bg-gradient-to-b from-[rgba(14,5,16,0.95)] to-transparent px-6 py-6 md:px-12"
    >
      <Link
        href="#hero"
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
                href={link.href}
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
        href="#contact"
        className="font-mono text-[0.6rem] tracking-[0.12em] text-chrome2 uppercase transition-colors hover:text-chrome1 md:hidden"
        data-cursor="big"
      >
        Contact
      </Link>
    </motion.header>
  );
}
