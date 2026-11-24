"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useLenis } from "@/components/layout/SmoothScroll";
import { about } from "@/lib/data";
import {
  ArtistLine,
  type ArtistLineHandle,
} from "@/components/sections/about/ArtistLine";

/* ── math helpers ────────────────────────────────────────────── */
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (p: number, p0: number, p1: number) => clamp((p - p0) / (p1 - p0));
const smooth = (t: number) => t * t * (3 - 2 * t);

const N = about.boxCount; // 12
const LAST = N - 1; // index of the portrait box
const EXPAND_START = 0.8; // carousel runs 0 → here, then box 12 expands

// Three #F499AF glow blobs over the purple backdrop image, each drifting on an
// organic sum-of-sines "wiggle" (incommensurate frequencies so it never obviously
// repeats) + a subtle rotation — AE-style ambient motion. Shared by box 12 and
// the fullscreen portrait, so they move at both scales (offsets are %-based).
const GLOWS = [
  { w: "72%", h: "64%", left: "-8%", top: "6%", seed: 0.0 },
  { w: "58%", h: "58%", left: "48%", top: "-12%", seed: 2.4 },
  { w: "64%", h: "62%", left: "22%", top: "44%", seed: 4.7 },
];

function PortraitBackground() {
  const reduced = usePrefersReducedMotion();
  const glowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const t0 = performance.now();
    // layered sines → very lively, organic, non-repeating drift (~AE wiggle).
    // A strong ~1 Hz term gives the energetic jitter; slower terms wander it.
    const wig = (t: number, s: number, f: number) =>
      10.0 * Math.sin(t * 0.33 + s * f) +
      6.5 * Math.sin(t * 1.0 + s * 1.7 * f) +
      4.0 * Math.sin(t * 2.4 + s * 2.3 * f);
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      GLOWS.forEach((g, i) => {
        const el = glowRefs.current[i];
        if (!el) return;
        const x = wig(t, g.seed + 1, 1);
        const y = wig(t, g.seed + 5, 1.1);
        const rot = 12 * Math.sin(t * 0.5 + g.seed);
        const sc = 1 + 0.13 * Math.sin(t * 0.85 + g.seed * 1.3);
        el.style.transform = `translate(${x.toFixed(2)}%, ${y.toFixed(2)}%) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/about/portrait-bg.webp"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      {GLOWS.map((g, i) => (
        <div
          key={i}
          ref={(el) => {
            glowRefs.current[i] = el;
          }}
          aria-hidden
          className="absolute rounded-full mix-blend-screen will-change-transform"
          style={{
            width: g.w,
            height: g.h,
            left: g.left,
            top: g.top,
            background:
              "radial-gradient(closest-side, rgba(244,153,175,0.6), rgba(244,153,175,0))",
            filter: "blur(28px)",
          }}
        />
      ))}
    </>
  );
}

/* ── final-screen content (shared by scroll + reduced-motion) ── */
function FinalContent({
  helloRef,
  pitchRef,
  bulletRefs,
}: {
  helloRef?: React.Ref<HTMLDivElement>;
  pitchRef?: React.Ref<HTMLDivElement>;
  bulletRefs?: React.MutableRefObject<(HTMLLIElement | null)[]>;
}) {
  return (
    <>
      {/* Hi! I'm Ingrid. — top-left */}
      <div
        ref={helloRef}
        className="pointer-events-none absolute top-[22vh] left-[6vw] z-[30] will-change-[transform,opacity] max-md:top-[12vh]"
      >
        <p className="font-serif text-[clamp(1.1rem,1.6vw,1.5rem)] text-text/90">
          {about.hello}
        </p>
        <p className="font-display text-[#FFDBE4] text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95] italic">
          {about.name}
        </p>
      </div>

      {/* Brands collaborate… + bullets — far right, narrower column.
          On small widths it drops toward the vertical centre so it clears the
          "Hi! I'm Ingrid." heading. */}
      <div
        ref={pitchRef}
        className="pointer-events-none absolute top-[16vh] right-[4vw] z-[30] w-[min(32vw,30rem)] will-change-[transform,opacity] max-md:top-[40vh] max-md:left-[4vw] max-md:w-[92vw] max-md:rounded-3xl max-md:bg-bg/72 max-md:p-6 max-md:backdrop-blur-[3px]"
      >
        <p className="font-serif text-[clamp(1.1rem,1.5vw,1.4rem)] text-text/90">
          {about.pitchLead}
        </p>
        <p className="font-serif text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.05] text-text italic">
          {about.pitchAccent}
        </p>
        <ul className="mt-[5vh] space-y-[3.4vh]">
          {about.points.map((pt, i) => (
            <li
              key={pt.emph}
              ref={
                bulletRefs
                  ? (el) => {
                      bulletRefs.current[i] = el;
                    }
                  : undefined
              }
              className="flex gap-4 will-change-transform"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pt.marker}
                alt=""
                className="mt-[0.35em] h-[0.95rem] w-[0.95rem] shrink-0"
              />
              <p className="font-serif text-[clamp(0.95rem,1.15vw,1.15rem)] leading-[1.5] text-text/90">
                {pt.pre} <em>{pt.emph}</em>. {pt.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/* ── static branch (reduced motion / no-JS fallback) ─────────── */
function AboutStatic() {
  return (
    <section id="about" className="relative overflow-hidden bg-bg">
      <div className="relative min-h-screen overflow-hidden">
        <PortraitBackground />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={about.photo}
          alt="Ingrid Silfverberg holding an award"
          className="absolute inset-0 h-full w-full object-cover select-none"
          style={{ objectPosition: "50% 16%" }}
        />
        <FinalContent />
      </div>
    </section>
  );
}

/* ── a carousel box with layered bg + fg and cursor parallax ──
   Same pattern as the Case Studies cards: the foreground drifts toward the
   cursor and the background the opposite way (and less), giving depth; the
   foreground also lifts slightly on hover. ── */
function CarouselBox({
  bg,
  fg,
  full = false,
}: {
  bg?: string;
  fg: string;
  full?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const [hover, setHover] = useState(false);
  const px = useMotionValue(0); // -0.5 .. 0.5
  const py = useMotionValue(0);
  const spring = { stiffness: 150, damping: 20, mass: 0.4 };
  const fgX = useSpring(useTransform(px, [-0.5, 0.5], [-20, 20]), spring);
  const fgY = useSpring(useTransform(py, [-0.5, 0.5], [-20, 20]), spring);
  const bgX = useSpring(useTransform(px, [-0.5, 0.5], [12, -12]), spring);
  const bgY = useSpring(useTransform(py, [-0.5, 0.5], [12, -12]), spring);
  // `full` scenes sit scaled up so their scroll/hover drift never bares an edge.
  const fgBase = full ? 1.2 : 1;
  const fgScale = useSpring(hover ? fgBase + 0.07 : fgBase, spring);

  const onMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    setHover(false);
    px.set(0);
    py.set(0);
  };

  return (
    <div
      className="absolute inset-0 pointer-events-auto"
      data-cursor="big"
      onMouseEnter={() => setHover(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* background — gradient + glows: scroll drift (outer, from --par set by
          the carousel) + cursor drift (inner img). Omitted in `full` mode. */}
      {bg && (
        <div
          className="absolute inset-0 will-change-transform"
          style={
            reduced
              ? undefined
              : { transform: "translateY(calc(var(--par,0) * 7px))" }
          }
        >
          <motion.img
            src={bg}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-[1.22] object-cover will-change-transform"
            style={reduced ? undefined : { x: bgX, y: bgY }}
          />
        </div>
      )}
      {/* foreground — the motif: stronger, opposite scroll drift + cursor drift
          + lift. `full` images are a complete scene, so they cover-fill and are
          scaled up a touch so the drift never exposes an edge. */}
      <div
        className="absolute inset-0 will-change-transform"
        style={
          reduced ? undefined : { transform: "translateY(calc(var(--par,0) * -15px))" }
        }
      >
        <motion.img
          src={fg}
          alt=""
          aria-hidden
          className={`absolute inset-0 h-full w-full will-change-transform ${
            full ? "object-cover" : "object-contain p-[6%]"
          }`}
          style={reduced ? undefined : { x: fgX, y: fgY, scale: fgScale }}
        />
      </div>
    </div>
  );
}

/* ── scroll-driven carousel scene ────────────────────────────── */
function AboutScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const portraitRef = useRef<HTMLDivElement>(null);

  // flanking text
  const flankGroupRef = useRef<HTMLDivElement>(null);
  const leftSlotRef = useRef<HTMLDivElement>(null);
  const rightSlotRef = useRef<HTMLDivElement>(null);
  // per-word roll: outer clip spans + inner roll tracks (staggered order:
  // Every→I, vision→can bring, has a→yours, story→to life)
  const colClipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const colRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const colW = useRef<{ lead: number; prom: number }[]>([]);

  // final content
  const finalRef = useRef<HTMLDivElement>(null);
  const helloRef = useRef<HTMLDivElement>(null);
  const pitchRef = useRef<HTMLDivElement>(null);
  const bulletRefs = useRef<(HTMLLIElement | null)[]>([]);
  const lineWrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<ArtistLineHandle>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const applyProgress = useCallback((p: number) => {
    const stage = stageRef.current;
    const W = stage?.clientWidth ?? window.innerWidth;
    const H = stage?.clientHeight ?? window.innerHeight;

    // box size + vertical pitch between box centres (≈5 boxes in view)
    const S = Math.min(W, H) * 0.2;
    const pitch = H * 0.23;
    stage?.style.setProperty("--sh", `${S / 2 + W * 0.03}px`);

    /* ── carousel scroll: active index 0 → LAST across the runway ── */
    const carProg = seg(p, 0, EXPAND_START);
    const activeIdx = carProg * LAST;
    if (carouselRef.current) {
      carouselRef.current.style.setProperty("--s", `${S}px`);
      carouselRef.current.style.setProperty("--pitch", `${pitch}px`);
      const ty = H / 2 - S / 2 - activeIdx * pitch;
      carouselRef.current.style.transform = `translateY(${ty}px)`;
    }

    /* ── arch layout: each box's x-offset + scale follow its distance from
       centre, so the middle box is biggest + centred and neighbours recede
       left and shrink (a shallow coverflow arch). (boxes 1–11 only) ── */
    const archScaleOf = (ar: number) => clamp(1 - 0.26 * ar, 0, 1);
    const archXOf = (rel: number) => -W * 0.05 * rel * rel;
    boxRefs.current.forEach((el, i) => {
      if (!el) return;
      const rel = i - activeIdx;
      const ar = Math.abs(rel);
      el.style.transform = `translate(calc(-50% + ${archXOf(rel)}px), 0) scale(${archScaleOf(ar)})`;
      el.style.opacity = String(clamp((2.7 - ar) / 0.8, 0, 1));
      el.style.zIndex = String(Math.round(10 - ar));
      el.style.setProperty("--par", rel.toFixed(3));
    });

    /* ── portrait (box 12): ONE full-resolution element that rides the arch
       scaled DOWN to box size, then scales UP to fullscreen. Because it is
       only ever downscaled (max scale 1), it stays crisp — no second image,
       no cross-dissolve. It is a square so the framing is identical at every
       size. ── */
    const exp0 = smooth(seg(p, EXPAND_START, 0.96));
    if (portraitRef.current) {
      const L = Math.max(W, H);
      const relP = LAST - activeIdx;
      const arP = Math.abs(relP);
      const boxVis = S * archScaleOf(arP); // its size within the arch
      const k = lerp(boxVis / L, 1, exp0); // down in the carousel → 1 fullscreen
      const tx = archXOf(relP) * (1 - exp0);
      const ty = relP * pitch * (1 - exp0);
      const el = portraitRef.current;
      el.style.width = `${L}px`;
      el.style.height = `${L}px`;
      el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${k})`;
      el.style.borderRadius = `${lerp(22, 0, exp0)}%`;
      el.style.opacity = String(
        exp0 > 0 ? 1 : clamp((2.7 - arP) / 0.8, 0, 1),
      );
      el.style.zIndex = exp0 > 0.01 ? "25" : "10";
    }

    /* ── flanking text: "Every vision / has a story." morphs to
       "I can bring / yours to life." as the 7th box passes centre ── */
    // Per-word roll: each word is its own clipped track (lead on top, promise
    // below) and rolls up one line to swap. The four words cascade in order —
    // Every→I, vision→can bring, has a→yours, story→to life — for a classier,
    // staggered transition (no fade).
    const morphRaw = seg(activeIdx, 5, 6.6);
    const easeIO = (x: number) =>
      x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const stag = 0.12;
    const span = 0.62;
    colRefs.current.forEach((el, c) => {
      if (!el) return;
      const r = easeIO(clamp((morphRaw - c * stag) / span));
      el.style.transform = `translateY(${(-r * 1.18).toFixed(4)}em)`;
      // width eases lead→promise too, so both end states keep natural spacing
      const w = colW.current[c];
      const clip = colClipRefs.current[c];
      if (w && clip) clip.style.width = `${lerp(w.lead, w.prom, r)}px`;
    });
    // whole headline eases out (drift + fade) only as the portrait expands
    const textOut = 1 - smooth(seg(p, EXPAND_START, 0.9));
    if (flankGroupRef.current) flankGroupRef.current.style.opacity = String(textOut);
    const drift = smooth(seg(p, EXPAND_START, 0.95)) * W * 0.12;
    if (leftSlotRef.current)
      leftSlotRef.current.style.transform = `translate(${-drift}px, -50%)`;
    if (rightSlotRef.current)
      rightSlotRef.current.style.transform = `translate(${drift}px, -50%)`;

    /* ── final content fades in over the expanded portrait ── */
    const fin = smooth(seg(p, 0.92, 1));
    if (finalRef.current) finalRef.current.style.opacity = String(fin);
    if (helloRef.current) {
      helloRef.current.style.opacity = String(fin);
      helloRef.current.style.transform = `translateY(${lerp(20, 0, fin)}px)`;
    }
    if (pitchRef.current) {
      pitchRef.current.style.opacity = String(fin);
      pitchRef.current.style.transform = `translateY(${lerp(20, 0, fin)}px)`;
    }
    bulletRefs.current.forEach((el, i) => {
      if (!el) return;
      const e = smooth(seg(p, 0.93 + i * 0.015, 0.97 + i * 0.015));
      el.style.opacity = String(e);
      el.style.transform = `translateY(${lerp(20, 0, e)}px)`;
    });
    lineRef.current?.draw(smooth(seg(p, 0.9, 1)));
    if (lineWrapRef.current)
      lineWrapRef.current.style.opacity = String(smooth(seg(p, 0.9, 0.94)));
  }, []);

  useMotionValueEvent(scrollYProgress, "change", applyProgress);
  useEffect(() => {
    applyProgress(scrollYProgress.get());
    const onResize = () => applyProgress(scrollYProgress.get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyProgress, scrollYProgress]);

  // measure each word's lead/promise width (for the width-eased roll)
  useEffect(() => {
    const measure = () => {
      colW.current = colRefs.current.map((track) => {
        const kids = track?.children;
        return {
          lead: (kids?.[0] as HTMLElement)?.offsetWidth ?? 0,
          prom: (kids?.[1] as HTMLElement)?.offsetWidth ?? 0,
        };
      });
      applyProgress(scrollYProgress.get());
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [applyProgress, scrollYProgress]);

  // ── directional snap: when scrolling settles between two boxes, glide to
  //    lock onto the next box in the direction the user was scrolling. ──
  const lenisRef = useLenis();
  useEffect(() => {
    const lenis = lenisRef?.current;
    if (!lenis) return;
    let dir = 1;
    let gate: ReturnType<typeof setTimeout> | undefined;
    let safety: ReturnType<typeof setTimeout> | undefined;
    let snapping = false;

    const vel = () => (lenis as unknown as { velocity: number }).velocity;

    // Gate: polls while the scroll is still coasting and fires the snap the
    // moment velocity drops low — WITHOUT waiting for Lenis to fully stop
    // (that full-stop wait was the long pause). It re-checks itself every 90ms.
    const tick = () => {
      gate = undefined;
      if (Math.abs(vel()) > 0.9) {
        gate = setTimeout(tick, 90);
        return;
      }
      snap();
    };

    const arm = () => {
      if (gate === undefined && !snapping) gate = setTimeout(tick, 90);
    };

    const snap = () => {
      if (snapping) return;
      const p = scrollYProgress.get();
      // only within the carousel region (before the portrait expansion)
      if (p <= 0.012 || p >= EXPAND_START - 0.004) return;
      const idx = (p / EXPAND_START) * LAST;
      const nearest = Math.round(idx);
      // already basically on a box → settle to it; otherwise advance the way
      // the user was heading (down → next box, up → previous box)
      const target =
        Math.abs(idx - nearest) < 0.06
          ? nearest
          : dir > 0
            ? Math.ceil(idx)
            : Math.floor(idx);
      const t = Math.max(0, Math.min(LAST, target));
      const pT = (t / LAST) * EXPAND_START;
      if (Math.abs(pT - p) < 0.0015) return; // already locked

      const sec = sectionRef.current;
      if (!sec) return;
      const topAbs = window.scrollY + sec.getBoundingClientRect().top;
      const range = sec.offsetHeight - window.innerHeight;
      const release = () => {
        snapping = false;
      };
      snapping = true;
      lenis.scrollTo(topAbs + pT * range, {
        // longer + ease-in-out so it eases away and settles gently (less snappy)
        duration: 1.25,
        easing: (x: number) =>
          x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
        onComplete: release,
      });
      clearTimeout(safety); // fallback release if the glide is interrupted
      safety = setTimeout(release, 1500);
    };

    const onScroll = () => {
      const v = vel();
      if (v > 0.05) dir = 1;
      else if (v < -0.05) dir = -1;
      arm();
    };

    lenis.on("scroll", onScroll);
    return () => {
      lenis.off("scroll", onScroll);
      clearTimeout(gate);
      clearTimeout(safety);
    };
  }, [lenisRef, scrollYProgress]);

  const flankSize = "text-[clamp(1.6rem,4.2vw,4.5rem)]";
  // one clipped column (one line tall); its inner block holds lead + promise
  const colCls = "inline-block h-[1.18em] overflow-hidden align-top";
  const trackCls = "flex flex-col items-start will-change-transform";
  const wordLine =
    "font-display text-[#FFDBE4] leading-[1.18] whitespace-nowrap";

  return (
    <section ref={sectionRef} id="about" className="relative h-[760vh]">
      <div
        ref={stageRef}
        className="sticky top-0 h-screen overflow-hidden bg-bg"
      >
        {/* ── carousel column of boxes 1–11 (box 12 is the portrait below) ── */}
        <div
          ref={carouselRef}
          className="pointer-events-none absolute top-0 left-0 z-[10] w-full will-change-transform"
        >
          {Array.from({ length: LAST }).map((_, i) => {
            const art = about.boxes[i];
            return (
              <div
                key={i}
                ref={(el) => {
                  boxRefs.current[i] = el;
                }}
                className={`absolute left-1/2 origin-center overflow-hidden rounded-[22%] shadow-[0_20px_60px_rgba(0,0,0,0.4)] will-change-transform ${
                  art
                    ? ""
                    : "grid place-items-center border border-[rgba(200,125,232,0.3)] bg-gradient-to-br from-[rgba(200,125,232,0.35)] to-[rgba(123,93,232,0.25)]"
                }`}
                style={
                  {
                    "--i": i,
                    top: "calc(var(--i) * var(--pitch))",
                    width: "var(--s)",
                    height: "var(--s)",
                  } as React.CSSProperties
                }
              >
                {art ? (
                  <CarouselBox bg={art.bg} fg={art.fg} full={art.full} />
                ) : (
                  <span className="font-display text-[clamp(1.5rem,3vw,2.6rem)] text-[rgba(240,232,248,0.5)]">
                    {i + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── box 12: the one crisp portrait (gradient + full-res photo),
            rides the arch scaled down then scales up to fullscreen ── */}
        <div
          ref={portraitRef}
          className="pointer-events-none absolute top-1/2 left-1/2 z-[10] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] will-change-transform"
          style={{ transformOrigin: "center center" }}
        >
          <PortraitBackground />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={about.photo}
            alt="Ingrid Silfverberg holding an award"
            className="absolute inset-0 h-full w-full object-cover select-none"
            style={{ objectPosition: "50% 18%" }}
          />
        </div>

        {/* ── flanking text — each WORD is its own clipped track that rolls up
            to swap, cascading left→right for a classy staggered transition ── */}
        <div
          ref={flankGroupRef}
          className="pointer-events-none absolute inset-0 z-[20]"
        >
          {/* LEFT: "Every vision" → "I can bring" */}
          <div
            ref={leftSlotRef}
            className={`absolute top-1/2 right-[calc(50%+var(--sh,16rem))] whitespace-nowrap text-right will-change-transform ${flankSize}`}
            style={{ transform: "translateY(-50%)" }}
          >
            <span
              ref={(el) => {
                colClipRefs.current[0] = el;
              }}
              className={colCls}
            >
              <span
                ref={(el) => {
                  colRefs.current[0] = el;
                }}
                className={trackCls}
              >
                <span className={wordLine}>Every</span>
                <span className={wordLine}>I</span>
              </span>
            </span>
            <span
              ref={(el) => {
                colClipRefs.current[1] = el;
              }}
              className={`${colCls} ml-[0.26em]`}
            >
              <span
                ref={(el) => {
                  colRefs.current[1] = el;
                }}
                className={trackCls}
              >
                <span className={`${wordLine} italic`}>vision</span>
                <span className={wordLine}>can bring</span>
              </span>
            </span>
          </div>
          {/* RIGHT: "has a story." → "yours to life." */}
          <div
            ref={rightSlotRef}
            className={`absolute top-1/2 left-[calc(50%+var(--sh,16rem))] whitespace-nowrap text-left will-change-transform ${flankSize}`}
            style={{ transform: "translateY(-50%)" }}
          >
            <span
              ref={(el) => {
                colClipRefs.current[2] = el;
              }}
              className={colCls}
            >
              <span
                ref={(el) => {
                  colRefs.current[2] = el;
                }}
                className={trackCls}
              >
                <span className={wordLine}>has a</span>
                <span className={wordLine}>yours</span>
              </span>
            </span>
            <span
              ref={(el) => {
                colClipRefs.current[3] = el;
              }}
              className={`${colCls} ml-[0.26em]`}
            >
              <span
                ref={(el) => {
                  colRefs.current[3] = el;
                }}
                className={trackCls}
              >
                <span className={wordLine}>story.</span>
                <span className={wordLine}>
                  to <em className="italic">life.</em>
                </span>
              </span>
            </span>
          </div>
        </div>

        {/* ── final scene (crisp, fades in over the expanded portrait) ── */}
        <div
          ref={finalRef}
          className="pointer-events-none absolute inset-0 z-[26] opacity-0"
        >
          {/* accent line — bottom-left */}
          <div
            ref={lineWrapRef}
            className="pointer-events-none absolute bottom-[-10%] left-[-12%] h-[82%] w-[60%] opacity-0"
            aria-hidden
          >
            <ArtistLine ref={lineRef} className="h-full w-full" />
          </div>
          <FinalContent
            helloRef={helloRef}
            pitchRef={pitchRef}
            bulletRefs={bulletRefs}
          />
        </div>
      </div>
    </section>
  );
}

export function About() {
  const reduced = usePrefersReducedMotion();
  return reduced ? <AboutStatic /> : <AboutScroll />;
}
