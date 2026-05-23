import type { ReactNode } from "react";

export function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`font-display mb-4 text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] text-gradient-chrome ${className}`}
    >
      {children}
    </h2>
  );
}
