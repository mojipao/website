"use client";

import { useEffect, useSyncExternalStore, type RefObject } from "react";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Writes how far the page has scrolled through `ref` to the CSS variable `--p`:
 * 0 when the element's top meets the viewport top, 1 when its bottom meets the
 * viewport bottom. Pair with a taller section and a sticky child to pin a scene.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia(MOTION_QUERY).matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(Math.max(-rect.top / span, 0), 1) : 0;
      el.style.setProperty("--p", p.toFixed(4));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref]);
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
