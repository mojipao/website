import { create } from "zustand";
import type Lenis from "lenis";

interface DiveState {
  /** Continuous position through the content zones, 0 (surface) to ZONE_COUNT - 1 (trench). */
  zone: number;
  /** Depth in meters derived from `zone`. */
  depth: number;
  /** Overall page scroll progress, 0 to 1. */
  progress: number;
  reducedMotion: boolean;
  lenis: Lenis | null;
  set: (partial: Partial<Omit<DiveState, "set">>) => void;
}

export const useDive = create<DiveState>((set) => ({
  zone: 0,
  depth: 0,
  progress: 0,
  reducedMotion: false,
  lenis: null,
  set: (partial) => set(partial),
}));

export function scrollToTarget(target: string | number) {
  const { lenis } = useDive.getState();
  if (lenis) {
    lenis.scrollTo(target, { duration: typeof target === "number" && target === 0 ? 3.2 : 1.8 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}
