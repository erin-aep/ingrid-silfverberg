# Ingrid Silverberg — Portfolio

Premium multidisciplinary artist portfolio built with **Next.js**, **Tailwind CSS**, and **Framer Motion**.

## Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- Framer Motion
- Google Fonts via `next/font` (Instrument Serif, Space Mono)

## Sections

- Hero
- Showreel (featured motion)
- Selected Work (filterable grid)
- Services
- About
- Testimonials (carousel)
- Contact

## Getting started

```bash
cd ~/Projects/ingrid-portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Performance notes

- Fonts self-hosted through `next/font` with `display: swap`
- Animations respect `prefers-reduced-motion`
- Custom cursor only on fine pointers (desktop)
- Static content in `src/lib/data.ts` for easy updates

## Customize

Edit copy, projects, services, and testimonials in `src/lib/data.ts`.

## About photo

Add your portrait to `public/images/about.jpg` (see `public/images/README.md`).
