"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ClapperBoard } from "@/components/sections/services/ClapperBoard";
import { WebIcon } from "@/components/sections/services/WebIcon";
import { EditIcon } from "@/components/sections/services/EditIcon";
import type { Service, ServiceShape } from "@/lib/data";

export function ServiceCard({ service }: { service: Service }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // 3D tilt toward the cursor — same feel as the Case Study media card.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 150, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [9, -9]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), spring);

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  // The lead shape is visible at idle (the centred motif) and travels to its
  // resting spot on hover — no crossfade. The rest scale/fade in. Reduced
  // motion drops the travel and just toggles opacity on the resting layout.
  const shapeBase = reduced
    ? "pointer-events-none absolute block select-none opacity-[var(--io)] transition-opacity duration-500"
    : "pointer-events-none absolute block select-none opacity-[var(--io)] transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform:translate(var(--fx),var(--fy))_scale(var(--is))_rotate(var(--ir))]";
  const shapeHover = reduced
    ? "group-hover/sv:opacity-100"
    : "group-hover/sv:opacity-100 group-hover/sv:[transform:translateZ(var(--z))_scale(var(--hs))_rotate(var(--rot))]";

  const shapeStyle = (s: ServiceShape, i: number): React.CSSProperties =>
    ({
      top: s.top,
      left: s.left,
      right: s.right,
      width: s.width,
      transitionDelay: s.lead ? "0ms" : `${80 + i * 60}ms`,
      "--z": `${s.depth}px`,
      "--rot": `${s.rotate ?? 0}deg`,
      "--ir": s.lead ? "0deg" : `${s.rotate ?? 0}deg`,
      "--hs": `${s.hoverScale ?? 1}`,
      "--fx": s.fromX ?? "0%",
      "--fy": s.fromY ?? "0%",
      "--is": `${s.idleScale ?? 0.5}`,
      "--io": s.lead ? 1 : 0,
    }) as React.CSSProperties;

  return (
    <div className={reduced ? undefined : "[perspective:1100px]"}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        data-cursor="big"
        style={reduced ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group/sv relative aspect-[5/9] will-change-transform"
      >
        {/* Card surface — the only clipped layer, so shapes can float past it. */}
        <div className="absolute inset-0 overflow-hidden rounded-[26px] border border-[rgba(205,129,228,0.16)] bg-[#140a1c] transition-colors duration-500 group-hover/sv:border-[rgba(205,129,228,0.32)] group-hover/sv:bg-[#241138]" />

        {/* Index */}
        <span className="pointer-events-none absolute left-6 top-5 font-display text-[1.9rem] leading-none text-[#6f5486] [transform:translateZ(1px)]">
          {service.number}
        </span>

        {/* Bespoke motifs assemble on hover; other cards use the shape cluster */}
        {service.clapper && <ClapperBoard />}
        {service.web && <WebIcon />}
        {service.edit && <EditIcon />}

        {/* Shapes: the lead one is the idle motif; all settle into the cluster */}
        {!service.clapper && !service.web && !service.edit && service.cluster.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={s.src}
            alt=""
            style={shapeStyle(s, i)}
            className={`${shapeBase} ${shapeHover}`}
          />
        ))}

        {/* Title + description, anchored to the bottom and rising on hover */}
        <div className="absolute inset-x-6 bottom-6 [transform:translateZ(2px)]">
          <h3 className="font-display text-[1.7rem] leading-[1.1] text-chrome1">
            {service.title}
          </h3>
          <p className="max-h-0 overflow-hidden font-mono text-[0.72rem] leading-relaxed text-[#9a89a8] opacity-0 transition-all duration-500 ease-out group-hover/sv:mt-3 group-hover/sv:max-h-40 group-hover/sv:opacity-100">
            {service.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
