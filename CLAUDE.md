# CLAUDE.md — ingrid-portfolio

Guidance for Claude Code when working in this repository. Read this before making changes.

This is the **live production portfolio** for Ingrid Silfverberg (a multidisciplinary motion artist), deployed at https://ingrid-silfverberg.vercel.app. Treat every change as production-facing. When in doubt, ask before changing.

---

## Project overview

A single-page marketing/portfolio site. One route (`/`) composed of stacked sections, rendered as fully static HTML. All content is hard-coded in one data file; there is no CMS, database, API routes, or backend.

**Purpose & identity.** A professional storefront for Ingrid Silfverberg's creative work — motion design, animation, filmmaking, video editing, and multidisciplinary digital art. It exists to showcase the reel + selected work and to convert visitors into project inquiries (the Hero and Contact CTAs point to the Tally intake form).

**Audience & positioning.** Prospective clients and collaborators — creative directors, studios, brands, and agencies evaluating whether to hire. Positioning is premium, editorial, and artist-led: the site itself is a portfolio piece and should read as intentional craft, not a template.

## Tech stack

| Concern         | Choice                                                         |
| --------------- | -------------------------------------------------------------- |
| Framework       | Next.js **16.2.6** (App Router, Turbopack, React Server Components) |
| UI library      | React **19.2.4**                                               |
| Styling         | Tailwind CSS **v4** (CSS-first config via `@theme inline` in `globals.css` — there is **no** `tailwind.config.js`) |
| Animation       | Framer Motion **12** (`framer-motion`)                         |
| Fonts           | `next/font/google` — Instrument Serif (display/serif) + Space Mono (mono/body) |
| 3D              | Spline viewer web component, loaded at runtime from unpkg CDN  |
| Video           | Vimeo iframe embeds                                            |
| Language        | TypeScript 5 (strict), path alias `@/*` → `./src/*`            |
| Package manager | **npm** (`package-lock.json`)                                  |
| Node            | v24 (local); Node 18 is no longer supported by this Next version |
| Deployment      | Vercel (Git-connected, auto-deploy)                            |

## Architecture

```
src/
├── app/
│   ├── layout.tsx        Root layout: fonts, <CustomCursor>, skip-link, metadata
│   ├── page.tsx          The only page — composes all sections in order
│   ├── globals.css       Tailwind import, design tokens, keyframes, utility classes
│   └── favicon.ico
├── components/
│   ├── layout/           Nav, Footer, Marquee, CustomCursor
│   ├── sections/         Hero, HeroSpline, FeaturedReel, SelectedWork, Services,
│   │                     About, AboutPortrait, Testimonials, Contact
│   └── ui/               FadeIn, SectionHeading, SectionLabel, VimeoEmbed
├── hooks/
│   └── usePrefersReducedMotion.ts
├── lib/
│   └── data.ts           ★ Single source of truth for ALL copy & content
└── types/
    └── spline-viewer.d.ts  JSX typing for the <spline-viewer> web component
```

Section render order (`src/app/page.tsx`): Nav → Hero → Marquee → FeaturedReel → SelectedWork → Services → About → Testimonials → Contact → Footer.

### Content lives in `src/lib/data.ts`

Almost all editable text and config is here: `disciplines`, `navLinks`, `workItems` (+ `workFilters`), `services`, `testimonials`, and the `site` object (name, email, social URLs, Tally form URL, showreel + hero Spline URLs, tagline, location, about photo path). **Edit copy/content here first** — prefer this over hard-coding strings in components.

### Server vs client components

`page.tsx`, `layout.tsx`, `Footer`, `SectionHeading`, `SectionLabel`, `VimeoEmbed` are server components. Everything using Framer Motion, hooks, or browser APIs is marked `"use client"` (Hero, Nav, CustomCursor, Marquee, SelectedWork, Services, About, AboutPortrait, Testimonials, Contact, FadeIn, HeroSpline). Keep the `"use client"` boundary as low in the tree as possible.

## Design system

Defined as CSS custom properties in `src/app/globals.css` under `:root`, then exposed to Tailwind via `@theme inline`. Use the Tailwind token classes (e.g. `bg-bg`, `text-chrome1`, `border-magenta`) — do not introduce new raw hex values in components without reason.

- **Palette** (dark, purple→magenta→chrome): `--bg #0e0510`, `--bg2 #1a0b22`, `--purple-deep`, `--purple-mid`, `--magenta #c0186e`, `--pink #e8359a`, chrome ramp `--chrome1 #f4a0c8` / `--chrome2 #c87de8` / `--chrome3 #7b5de8` / `--chrome4 #f08060`, `--text #f0e8f8`, `--muted`.
- **Fonts**: `font-display` / `font-serif` = Instrument Serif; `font-mono` = Space Mono (also the body default). Headings use `font-display` with the `text-gradient-chrome` / `text-gradient-hero` gradient-text utilities.
- **Signature utilities** (in `globals.css`): `.text-gradient-chrome`, `.text-gradient-hero`, `.grid-texture`, `.work-theme-1..5` (project card gradients), `.hero-spline-root`/`.hero-spline-viewer`.
- **Visual language**: rounded-full pill buttons/badges, thin `rgba(200,125,232,…)` borders, ✦ star accents, uppercase letter-spaced micro-labels, radial-gradient glows.

Do **not** redesign, restyle, or change the palette/typography without explicit approval.

## Animation & interaction guidelines

- **Always respect reduced motion.** Use the `usePrefersReducedMotion()` hook (or the `@media (prefers-reduced-motion: reduce)` block in `globals.css`) for every animation. Existing pattern: pass `reduced ? false : {…}` to Framer Motion `initial`, and gate CSS animation classes. The three keyframe utilities (`animate-shimmer`, `animate-scrollpulse`, `animate-marquee`) are already disabled under reduced motion.
- **Scroll reveals**: wrap content in `<FadeIn>` (fades up once on enter, viewport-triggered). Use the optional `delay` prop for stagger.
- **Standard easing**: `[0.22, 1, 0.36, 1]`. Keep durations in the 0.3–0.8s range to match the existing feel.
- **Custom cursor**: desktop/fine-pointer only; interactive elements opt into the enlarged cursor via `data-cursor="big"`. Add that attribute to new clickable elements.
- Filtered work grid uses Framer Motion `layout` + `AnimatePresence mode="popLayout"`; testimonials auto-advance every 14s (paused under reduced motion).

## Creative direction

The site is itself a portfolio piece — hold it to the standard of the work it showcases.

- **Preserve the editorial, premium aesthetic.** Intentional typography, deliberate composition, and generous whitespace come first. The chrome-gradient-on-dark look is the signature; keep it coherent.
- **Avoid generic "AI-website" tells.** No stock-y hero clichés, no filler sections, no decorative gradients-for-the-sake-of-it, no boilerplate copy. Every element should earn its place.
- **Prioritize visual storytelling.** Let the reel, work, and imagery carry the page; text supports, never crowds.
- **Keep motion subtle, purposeful, and performant.** Animations accent content and respect reduced motion (see below). Favor restraint over spectacle.
- **Reduce clutter.** When adding anything, prefer removing or simplifying first. Default to less.
- When a change risks the look or feel, stop and ask rather than guess.

## SEO requirements

- Page metadata is set in `src/app/layout.tsx` via the `metadata` export (title, description, OpenGraph). Keep the lowercase title style "ingrid silfverberg — motion artist" and update OG fields together with any copy change.
- `public/google8aeec8ea5d8183ff.html` is the **Google Search Console site-verification file — must not be renamed, moved, or deleted.** (A duplicate at the repo root is being removed; keep the one in `public/`.)
- Preserve the accessibility baseline that supports SEO: `lang="en"`, the skip-to-content link, semantic `<main>`/`<section>` with `id`s, `aria-label`s, and image `alt` text.
- There is currently **no** `sitemap.ts`, `robots.ts`, `metadataBase`, favicon/OG image set beyond `favicon.ico`, or per-section structured data. Adding these is a valid improvement (see Next steps) but is a change, not a given.

## Coding conventions

- TypeScript strict mode; prefer `type` aliases and `as const` for static data (matches `data.ts`).
- Functional components, named exports (no default-export components except the required `page.tsx` / `layout.tsx`).
- Import via the `@/` alias, not long relative paths.
- Tailwind utility classes inline; extract shared class strings to a `const` only when reused (see `ctaPrimary`/`ctaSecondary` in `Hero.tsx`).
- Keep `"use client"` only where needed.
- External links: always `target="_blank" rel="noopener noreferrer"`.

## External services & integrations

- **Vercel** — hosting + CI/CD (Git-connected).
- **Tally** — project intake form at `https://tally.so/r/b56rx0` (`site.tallyProjectUrl`); the Hero and Contact CTAs link to it. Opens in a new tab; not embedded.
- **Vimeo** — showreel + one project video, via `<VimeoEmbed>` iframes.
- **Spline** — hero 3D scene; the viewer script is loaded at runtime from `https://unpkg.com/@splinetool/viewer@1.12.95/...` (pinned version) in `HeroSpline.tsx`, scene URL `prod.spline.design/0K1F2NrFx2E9F3Dl/...`.
- **Google Search Console** — verification file (above).
- No analytics package is currently installed (no GA, no `@vercel/analytics`).

## Environment variables & secrets

**There are none.** No `.env*` files exist, and no `process.env` usage in `src/`. All service URLs are public and live in `data.ts`. If you ever add a secret, use `.env.local` (git-ignored by `.gitignore`), never commit it, and never print its value.

## Development commands

```bash
npm install        # install deps
npm run dev        # dev server at http://localhost:3000 (Turbopack)
npm run build      # production build (static)
npm run start      # serve the production build
npm run lint       # ESLint (flat config, eslint-config-next core-web-vitals + ts)
```

TypeScript is type-checked as part of `next build`. There is **no test suite** (no Jest/Vitest/Playwright configured).

## Build & verification before shipping

1. `npm run lint` — note: there are **2 pre-existing lint errors** (`react-hooks/set-state-in-effect`) in `src/hooks/usePrefersReducedMotion.ts`. These do not block `next build`. Don't introduce new ones.
2. `npm run build` — must compile and type-check cleanly.
3. Spot-check in the browser, including a reduced-motion run and a mobile width.

## Git workflow

- **Always work on a feature or development branch, never directly on `main`** unless explicitly authorized. `main` is the production branch — every push to it auto-deploys to production via Vercel.
- **Never commit, push, merge, or deploy without explicit approval.**
- **Check `git status` before making changes** to understand the working tree.
- **Never overwrite or discard uncommitted user changes** (no `git checkout --`, `git reset --hard`, `git stash drop`, or `git clean` over untracked/modified files) without approval.
- **Keep commits focused and descriptive** — small, single-purpose, present-tense messages (e.g. "Add OG image", "Fix marquee pause on reduced motion").
- **Verify builds before proposing changes for production** — run `npm run lint` and `npm run build` and confirm they pass.

## Deployment workflow

- Vercel is connected to the GitHub repo. **Pushing to the default branch (`main`) triggers a production deploy automatically.** Pull-request / branch pushes get Vercel preview deployments.
- There is no `vercel.json` — Vercel uses auto-detected Next.js defaults.
- **Do not deploy to production directly.** Do not push to `main` without explicit approval. Prefer a feature branch + preview deploy for review.

## Known issues / tech debt

- 2 ESLint errors in `usePrefersReducedMotion.ts` (setState in effect). Low risk; a guarded refactor is a candidate improvement.
- Next build warns about **multiple lockfiles** — there is a stray `package-lock.json` at `/Users/erica/` that makes Next infer the wrong workspace root. Setting `turbopack.root` in `next.config.ts` would silence it.
- `about.jpg` is not present in `public/images/`; `AboutPortrait` renders a styled fallback until a real portrait is added.
- No sitemap/robots/`metadataBase`/OG image, no analytics, no error boundary, no tests.
- Runtime-injected Spline script and Vimeo/Spline third-party embeds are external dependencies outside our control.

## Things that must NOT change without explicit approval

- The **design** — palette, typography, layout, spacing, the chrome-gradient look.
- **Production functionality** or content copy/links in `data.ts` (email, socials, Tally URL, Vimeo/Spline URLs).
- **`public/google8aeec8ea5d8183ff.html`** (Google verification).
- Dependency versions (**no upgrades yet**) and `package-lock.json`.
- Config files: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `.gitignore`.
- Deployment config / the Vercel connection; **no production deploys** without approval.
- Existing integrations (Tally, Vimeo, Spline, Vercel).

## Safety rules

- **Never expose secrets, API keys, credentials, or environment variable values** — don't print, log, or commit them. (This project currently has none; if any are added, use `.env.local` and keep it git-ignored.)
- **Never delete existing functionality, assets, integrations, or configuration without approval** — sections, components, content in `data.ts`, the Google verification file, embeds, or config files.
- **Never upgrade or remove dependencies without explaining the impact first** — dependency versions and `package-lock.json` are pinned; propose and justify before changing.
- **Never modify Vercel production settings or deployment configuration without approval** — the Git-connected Vercel project, build settings, domains, or env.
- **Never perform destructive Git commands** — no force-push, hard reset of shared branches, history rewrites, or `git clean` over user changes.
- **Always explain potentially breaking changes before implementing them** — describe the risk and get a go-ahead first.
