"use client";

import { useEffect, useRef, type RefObject } from "react";
import { Mesh, Plane, Program, Renderer, Texture } from "ogl";
import { VERT, FRAG } from "./shaders";
import { site } from "@/lib/data";

/** Live values the parent writes every scroll frame; the GL loop reads them. */
export type ReelState = {
  warp: number; // 0..1 bell curve (wave amplitude)
  flow: number; // 0..1 monotonic release progress (advances the wave)
  velocity: number; // signed scroll velocity
  rectCenter: [number, number]; // card centre, stage CSS px (origin top-left)
  rectSize: [number, number]; // card w,h in stage CSS px
  radius: number; // corner radius in px
};

export const INITIAL_REEL_STATE: ReelState = {
  warp: 0,
  flow: 0,
  velocity: 0,
  rectCenter: [0, 0],
  rectSize: [10, 10],
  radius: 16,
};

// Brand palette (0..1): --pink, --chrome3, --chrome2
const COL_A = [0.91, 0.21, 0.6];
const COL_B = [0.48, 0.36, 0.91];
const COL_C = [0.78, 0.49, 0.91];

export function ReelCanvas({ stateRef }: { stateRef: RefObject<ReelState> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement as HTMLElement;

    const renderer = new Renderer({
      canvas,
      alpha: true,
      premultipliedAlpha: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const geometry = new Plane(gl, {
      width: 2,
      height: 2,
      widthSegments: 64,
      heightSegments: 48,
    });

    // Video texture — gradient fallback until (and unless) the file loads.
    const texture = new Texture(gl, {
      generateMipmaps: false,
      flipY: true,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
    });
    const video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.src = site.showreelVideo;
    let hasVideo = 0;
    let texAspect = 16 / 9;
    video.addEventListener("canplay", () => {
      texAspect = (video.videoWidth || 16) / (video.videoHeight || 9);
      video.play().then(() => {
        hasVideo = 1;
      }).catch(() => {
        hasVideo = 0;
      });
    });
    video.addEventListener("error", () => {
      hasVideo = 0;
    });
    video.load();

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      transparent: true,
      cullFace: false,
      uniforms: {
        uResolution: { value: [container.clientWidth, container.clientHeight] },
        uRectCenter: { value: INITIAL_REEL_STATE.rectCenter.slice() },
        uRectSize: { value: INITIAL_REEL_STATE.rectSize.slice() },
        uWarp: { value: 0 },
        uFlow: { value: 0 },
        uVelocity: { value: 0 },
        uTime: { value: 0 },
        uTexture: { value: texture },
        uHasVideo: { value: 0 },
        uTexAspect: { value: texAspect },
        uRadius: { value: 16 },
        uColorA: { value: COL_A },
        uColorB: { value: COL_B },
        uColorC: { value: COL_C },
      },
    });
    program.setBlendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(container);

    let raf = 0;
    const start = performance.now();
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const s = stateRef.current;
      const u = program.uniforms;
      u.uTime.value = (t - start) / 1000;
      u.uWarp.value = s.warp;
      u.uFlow.value = s.flow;
      u.uVelocity.value = s.velocity;
      u.uRectCenter.value = s.rectCenter;
      u.uRectSize.value = s.rectSize;
      u.uRadius.value = s.radius;
      u.uHasVideo.value = hasVideo;
      u.uTexAspect.value = texAspect;
      if (hasVideo && video.readyState >= video.HAVE_CURRENT_DATA) {
        texture.image = video;
        texture.needsUpdate = true;
      }
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      video.pause();
      video.removeAttribute("src");
      video.load();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [stateRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[2] h-full w-full"
      aria-hidden
    />
  );
}
