"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/lib/data";

export function AboutPortrait() {
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-purple-deep via-purple-mid to-magenta">
        <div className="h-[120px] w-[120px] [clip-path:polygon(50%_0%,56%_38%,100%_35%,70%_60%,82%_100%,50%_75%,18%_100%,30%_60%,0%_35%,44%_38%)] bg-gradient-to-br from-chrome1 via-pink to-chrome3 shadow-[0_0_30px_rgba(244,160,200,0.5)]" />
        <p className="px-4 text-center text-[0.5rem] tracking-[0.15em] text-muted uppercase">
          Add {site.aboutPhoto} to show your photo
        </p>
      </div>
    );
  }

  return (
    <Image
      src={site.aboutPhoto}
      alt={`Portrait of ${site.name}`}
      fill
      className="object-cover object-center"
      sizes="(max-width: 768px) 100vw, 480px"
      priority={false}
      onError={() => setUseFallback(true)}
    />
  );
}
