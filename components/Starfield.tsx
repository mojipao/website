"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  base: number;
  phase: number;
  speed: number;
  depth: number;
}

const DENSITY = 1 / 16000; // stars per CSS pixel
const FPS = 24;

/**
 * A sparse, dim starfield behind the page. Stars drift upward at different
 * rates as you scroll, which gives a faint sense of depth. Paced at 24fps,
 * paused when hidden, static under reduced motion.
 */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const time = t / 1000;
      const scroll = reduced ? 0 : window.scrollY;
      ctx.fillStyle = "#ededf0";
      for (const s of stars) {
        const y = (((s.y - scroll * s.depth) % height) + height) % height;
        const twinkle = reduced ? 1 : 0.75 + 0.25 * Math.sin(time * s.speed + s.phase);
        ctx.globalAlpha = s.base * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.round(width * height * DENSITY) }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.35 + depth * 0.8,
          base: 0.12 + depth * 0.4,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.8,
          depth: 0.02 + depth * 0.1,
        };
      });
      draw(performance.now());
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 1000 / FPS) return;
      last = t;
      draw(t);
    };
    const start = () => {
      if (!raf && !reduced && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />;
}
