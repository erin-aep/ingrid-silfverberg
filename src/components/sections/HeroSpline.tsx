"use client";

import { useEffect, useRef } from "react";

const SPLINE_SCRIPT =
  "https://unpkg.com/@splinetool/viewer@1.12.95/build/spline-viewer.js";

const SPLINE_SCENE =
  "https://prod.spline.design/0K1F2NrFx2E9F3Dl/scene.splinecode";

export function HeroSpline() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ensureScript = () => {
      if (document.querySelector(`script[src="${SPLINE_SCRIPT}"]`)) return;
      const script = document.createElement("script");
      script.type = "module";
      script.src = SPLINE_SCRIPT;
      document.body.appendChild(script);
    };

    ensureScript();

    let viewer = container.querySelector("spline-viewer") as HTMLElement | null;
    if (!viewer) {
      viewer = document.createElement("spline-viewer");
      viewer.setAttribute("url", SPLINE_SCENE);
      viewer.className = "hero-spline-viewer";
      container.appendChild(viewer);
    }

    const syncSize = () => {
      const { width, height } = container.getBoundingClientRect();
      viewer.style.width = `${width}px`;
      viewer.style.height = `${height}px`;
    };

    syncSize();

    const resizeObserver = new ResizeObserver(syncSize);
    resizeObserver.observe(container);
    window.addEventListener("resize", syncSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncSize);
    };
  }, []);

  return <div ref={containerRef} className="hero-spline-root" aria-hidden />;
}
