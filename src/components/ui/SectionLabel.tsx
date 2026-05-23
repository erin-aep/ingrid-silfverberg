import type { ReactNode } from "react";

export function SectionLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`mb-3 flex items-center gap-3 text-[0.58rem] tracking-[0.2em] text-chrome2 uppercase ${className}`}
    >
      <span className="text-[0.7rem] text-magenta" aria-hidden>
        ✦
      </span>
      {children}
    </p>
  );
}
