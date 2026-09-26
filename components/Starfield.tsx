"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  base: number;
  phase: number;
  speed: number;
}

const DENSITY = 1 / 9000; // stars per CSS pixel
const FPS = 24;

/**
 * A fixed, full-viewport starfield drawn on a 2D canvas. Deliberately cheap:
 * a few hundred points, paced at 24fps, paused when the tab is hidden, and
 * static when the user prefers reduced motion.
 */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(width * height * DENSITY);
      stars = Array.from({ length: count }, () => {
        const big = Math.random() < 0.08;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: big ? 1.1 + Math.random() * 0.7 : 0.4 + Math.random() * 0.6,
          base: big ? 0.55 + Math.random() * 0.35 : 0.2 + Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.9,
        };
      });
      draw(performance.now());
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const time = t / 1000;
      for (const s of stars) {
        const twinkle = reduced.matches ? 1 : 0.7 + 0.3 * Math.sin(time * s.speed + s.phase);
        ctx.globalAlpha = s.base * twinkle;
        ctx.fillStyle = "#eef0f8";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 1000 / FPS) return;
      last = t;
      draw(t);
    };

    const start = () => {
      if (!raf && !reduced.matches && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotion = () => {
      stop();
      draw(performance.now());
      start();
    };

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onMotion);
    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotion);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />;
}
