"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useMotionValueEvent,
  useScroll,
  useSpring,
  useVelocity,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useLenis } from "@/components/layout/SmoothScroll";
import { site } from "@/lib/data";
import {
  INITIAL_REEL_STATE,
  ReelCanvas,
  type ReelState,
} from "@/components/sections/reel/ReelCanvas";
import {
  ReelLine,
  type ReelLineHandle,
} from "@/components/sections/reel/ReelLine";
import {
  MotionMorph,
  type MotionMorphHandle,
} from "@/components/sections/reel/MotionMorph";

/* ── math helpers ────────────────────────────────────────────── */
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (p: number, p0: number, p1: number) => clamp((p - p0) / (p1 - p0));
const smooth = (t: number) => t * t * (3 - 2 * t);

/* ── shared UI bits ──────────────────────────────────────────── */

function PlayGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M8 5.2v13.6L19 12 8 5.2Z" fill="currentColor" />
    </svg>
  );
}

function PlayReelButton({
  onClick,
  className = "",
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="big"
      aria-label="Play showreel"
      className={`group pointer-events-auto flex items-center gap-4 sm:gap-6 ${className}`}
    >
      <span className="font-display text-gradient-chrome text-[clamp(2.25rem,6vw,4.5rem)] leading-none drop-shadow-[0_0_30px_rgba(200,125,232,0.3)]">
        Play
      </span>
      <span className="relative flex h-[clamp(3rem,7vw,5rem)] w-[clamp(3rem,7vw,5rem)] items-center justify-center rounded-full bg-gradient-to-br from-chrome1 to-chrome2 text-bg shadow-[0_0_40px_rgba(200,125,232,0.45)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
        <PlayGlyph className="ml-[0.15em] h-[42%] w-[42%]" />
      </span>
      <span className="font-display text-gradient-chrome text-[clamp(2.25rem,6vw,4.5rem)] leading-none drop-shadow-[0_0_30px_rgba(200,125,232,0.3)]">
        Reel
      </span>
    </button>
  );
}

/** Full-screen lightbox with the full Vimeo reel. Freezes Lenis while open. */
function ReelLightbox({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lenisRef = useLenis();

  useEffect(() => {
    if (!open) return;
    const lenis = lenisRef?.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, lenisRef]);

  if (!open) return null;
  const src = `${site.showreelVimeo}?autoplay=1&title=0&byline=0&portrait=0`;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(14,5,16,0.88)] px-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Showreel"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close showreel"
        data-cursor="big"
        className="absolute top-6 right-6 z-[1] flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(200,125,232,0.35)] bg-[rgba(92,26,122,0.25)] text-chrome1 backdrop-blur-sm transition-colors hover:border-chrome1 hover:text-text"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div
        className="relative aspect-video w-full max-w-[1100px] overflow-hidden rounded-lg border border-[rgba(200,125,232,0.25)] shadow-[0_0_80px_rgba(123,93,232,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={src}
          title="Ingrid Silfverberg showreel"
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  );
}

/* ── reduced-motion / fallback ───────────────────────────────── */

function ShowreelStatic() {
  const [open, setOpen] = useState(false);
  return (
    <section
      id="showreel"
      className="relative overflow-hidden bg-bg2 px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="font-display text-gradient-hero mb-6 text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95]">
          Turning vision
          <br />
          into motion.
        </h2>
        <p className="mb-10 max-w-xl font-mono text-[0.9rem] leading-relaxed text-muted">
          {site.showreelBody}
        </p>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[rgba(200,125,232,0.25)] work-theme-1">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(232,53,154,0.35) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 70% 80%, rgba(123,93,232,0.35) 0%, transparent 70%)",
            }}
          />
          <div className="absolute inset-0 bg-[rgba(14,5,16,0.35)]" aria-hidden />
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayReelButton onClick={() => setOpen(true)} />
          </div>
        </div>
      </div>
      <ReelLightbox open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

/* ── scroll-driven experience ────────────────────────────────── */

function ShowreelScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const motionMorphRef = useRef<MotionMorphHandle>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<HTMLDivElement>(null);
  const lineWrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<ReelLineHandle>(null);
  const reelState = useRef<ReelState>({ ...INITIAL_REEL_STATE });
  const velGateRef = useRef(0);

  const [open, setOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const velocity = useVelocity(scrollYProgress);
  const smoothVel = useSpring(velocity, {
    stiffness: 220,
    damping: 28,
    mass: 0.3,
  });

  const applyProgress = useCallback((p: number) => {
    const stage = stageRef.current;
    const W = stage?.clientWidth ?? window.innerWidth;
    const H = stage?.clientHeight ?? window.innerHeight;

    // Two-stage choreography:
    //  • HOLD (0 → HOLD): the stage is pinned and nothing moves except the line
    //    (drawing 1 → 3) and "into motion" (drifting right + going italic).
    //  • RELEASE (HOLD → 1): everything else — content scrolls up, the card
    //    warps + grows into the centred Play Reel, the line finishes 3 → 7.
    const P3 = 0.392; // point 3 as a fraction of the line's length
    const HOLD = 0.42; // end of the sticky hold
    const p2 = seg(p, HOLD, 1); // release-phase progress (0 during the hold)

    // ── line: 1 → 3 during the hold, 3 → 7 after release (one continuous draw)
    const draw =
      p <= HOLD
        ? P3 * smooth(seg(p, 0.03, HOLD))
        : P3 + (1 - P3) * smooth(seg(p, HOLD, 0.95));
    lineRef.current?.draw(draw);

    // ── "into motion": drift right + crossfade to italic, done by end of hold
    if (line2Ref.current)
      line2Ref.current.style.transform = `translateX(${lerp(0, W * 0.3, smooth(seg(p, 0.06, HOLD * 0.95)))}px)`;
    motionMorphRef.current?.morph(smooth(seg(p, 0.12, HOLD * 0.98)));

    // ── content + line scroll UP, release phase only (held in place until then)
    const scrollUp = smooth(p2) * H * 1.15;
    if (contentRef.current)
      contentRef.current.style.transform = `translateY(${-scrollUp}px)`;
    if (lineWrapRef.current)
      lineWrapRef.current.style.transform = `translateY(${-smooth(p2) * H * 0.95}px)`;

    // ── reel card rect: base right-card (hold) → centred padded card (release)
    const rt = smooth(seg(p2, 0.0, 0.82));
    const w = lerp(W * 0.42, W * 0.86, rt);
    const h = lerp((W * 0.42 * 9) / 16, H * 0.76, rt);
    const cx = lerp(W * 0.72, W * 0.5, rt);
    const cy = lerp(H * 0.64, H * 0.52, rt);
    const radius = lerp(14, 22, rt);

    // ── warp bell: flat during the hold, rises then settles over the release
    const warp = Math.sin(seg(p2, 0.04, 0.96) * Math.PI);

    const st = reelState.current;
    st.warp = warp;
    st.flow = p2;
    st.rectCenter = [cx, cy];
    st.rectSize = [w, h];
    st.radius = radius;

    // velocity warp is gated to the release phase (card stays calm during hold)
    velGateRef.current = smooth(seg(p, HOLD - 0.03, HOLD + 0.08));

    // ── centre vignette on the final card so "Play Reel" reads
    if (scrimRef.current) {
      const sc = scrimRef.current;
      sc.style.left = `${cx - w / 2}px`;
      sc.style.top = `${cy - h / 2}px`;
      sc.style.width = `${w}px`;
      sc.style.height = `${h}px`;
      sc.style.borderRadius = `${radius}px`;
      sc.style.opacity = String(smooth(seg(p2, 0.55, 0.9)));
    }

    // ── Play Reel reveals in the final card
    if (playRef.current) {
      const pr = smooth(seg(p2, 0.6, 0.95));
      playRef.current.style.opacity = String(pr);
      playRef.current.style.transform = `scale(${lerp(0.92, 1, pr)})`;
      playRef.current.style.pointerEvents = p2 > 0.68 ? "auto" : "none";
    }
  }, []);

  useMotionValueEvent(scrollYProgress, "change", applyProgress);
  useMotionValueEvent(smoothVel, "change", (v) => {
    reelState.current.velocity = v * velGateRef.current;
  });

  useEffect(() => {
    applyProgress(scrollYProgress.get());
    const onResize = () => applyProgress(scrollYProgress.get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [applyProgress, scrollYProgress]);

  return (
    <section ref={sectionRef} id="showreel" className="relative h-[440vh]">
      <div
        ref={stageRef}
        className="sticky top-0 h-screen overflow-hidden"
      >
        {/* WebGL reel (shader positions + warps the card) */}
        <ReelCanvas stateRef={reelState} />

        {/* accent line — lowest layer, scrolls up with the text */}
        <div
          ref={lineWrapRef}
          className="pointer-events-none absolute inset-0 z-[1]"
          aria-hidden
        >
          <ReelLine
            ref={lineRef}
            className="h-full w-full overflow-visible"
          />
        </div>

        {/* headline + body */}
        <div
          ref={contentRef}
          className="pointer-events-none absolute top-[17vh] left-[6vw] z-[20] w-[58vw] will-change-transform"
        >
          <h2 className="font-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.92]">
            <span className="text-gradient-hero block will-change-transform">
              Turning vision
            </span>
            <span ref={line2Ref} className="block will-change-transform">
              <span className="text-gradient-hero">into </span>
              <MotionMorph
                ref={motionMorphRef}
                className="inline-block h-[0.74em] w-auto align-baseline"
              />
            </span>
          </h2>
          <p className="font-serif mt-[5vh] max-w-[min(32rem,40vw)] text-[clamp(1.05rem,1.4vw,1.4rem)] leading-[1.4] text-text/80">
            {site.showreelBody}
          </p>
        </div>

        {/* centre vignette (final card) */}
        <div
          ref={scrimRef}
          className="pointer-events-none absolute z-[25]"
          aria-hidden
          style={{
            opacity: 0,
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(14,5,16,0.62) 0%, rgba(14,5,16,0.28) 55%, rgba(14,5,16,0) 100%)",
          }}
        />

        {/* Play Reel reveal */}
        <div
          ref={playRef}
          className="absolute inset-0 z-[30] flex items-center justify-center"
          style={{ opacity: 0, transform: "scale(0.92)", pointerEvents: "none" }}
        >
          <PlayReelButton onClick={() => setOpen(true)} />
        </div>
      </div>

      <ReelLightbox open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

/* ── entry ───────────────────────────────────────────────────── */

export function ShowreelExperience() {
  const reduced = usePrefersReducedMotion();
  return reduced ? <ShowreelStatic /> : <ShowreelScroll />;
}
