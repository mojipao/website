"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDive } from "@/lib/store";
import { ZONE_COUNT, zoneToDepth } from "@/lib/depth";

gsap.registerPlugin(ScrollTrigger);

/**
 * Each `[data-zone]` section maps to one integer zone. The zone value is how far
 * the viewport's center line has travelled through the sections, so the scene
 * always reflects the content currently in view.
 */
function measureZone(sections: HTMLElement[]): number {
  const center = window.innerHeight / 2;
  let z = 0;
  for (let i = 0; i < sections.length; i++) {
    const rect = sections[i].getBoundingClientRect();
    const frac = (center - rect.top) / rect.height;
    if (frac < 0) break;
    z = i + Math.min(frac, 1);
  }
  return Math.min(Math.max(z - 0.5, 0), ZONE_COUNT - 1);
}

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const set = useDive.getState().set;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    set({ reducedMotion });

    let sections = Array.from(document.querySelectorAll<HTMLElement>("[data-zone]"));
    const update = () => {
      const zone = measureZone(sections);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      set({ zone, depth: zoneToDepth(zone), progress: max > 0 ? window.scrollY / max : 0 });
    };
    const refresh = () => {
      sections = Array.from(document.querySelectorAll<HTMLElement>("[data-zone]"));
      update();
    };

    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    if (!reducedMotion) {
      lenis = new Lenis({ duration: 1.25, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      set({ lenis });
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", refresh);
    ScrollTrigger.addEventListener("refresh", refresh);
    refresh();

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", refresh);
      ScrollTrigger.removeEventListener("refresh", refresh);
      gsap.ticker.remove(tick);
      lenis?.destroy();
      set({ lenis: null });
    };
  }, []);

  return <>{children}</>;
}
