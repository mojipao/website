"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useDive } from "@/lib/store";
import { diveFrame } from "./diveFrame";

const ACTIVE_FPS = 60;
const IDLE_FPS = 30;
/** How long after the last input the scene keeps rendering at full rate. */
const ACTIVE_HOLD_MS = 1500;
/** Sustained active-period frame rate below this, for this many seconds, demotes quality. */
const OVERLOAD_FPS = 42;
const OVERLOAD_SECONDS = 2;

const INPUT_EVENTS = ["scroll", "wheel", "pointermove", "pointerdown", "touchmove", "keydown", "resize"] as const;

/**
 * Paces the on-demand render loop: full rate while the user interacts or the
 * camera is still settling, half rate at rest, and nothing while the tab is
 * hidden. Reports sustained overload so the scene can drop to its low tier.
 */
export default function FramePacer({ onOverload }: { onOverload: () => void }) {
  const invalidate = useThree((s) => s.invalidate);
  const overload = useRef(onOverload);

  useEffect(() => {
    overload.current = onOverload;
  }, [onOverload]);

  useEffect(() => {
    let raf = 0;
    let lastRender = 0;
    let lastInput = performance.now();
    let hidden = document.hidden;
    let windowStart = performance.now();
    let windowFrames = 0;
    let slowWindows = 0;
    let demoted = false;

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const loop = (now: number) => {
      raf = 0;
      if (hidden) return;

      const settling = Math.abs(useDive.getState().zone - diveFrame.zone) > 0.002;
      const active = settling || now - lastInput < ACTIVE_HOLD_MS;
      // The -1ms tolerance keeps 60Hz displays rendering every frame and 120Hz displays every other one.
      const interval = 1000 / (active ? ACTIVE_FPS : IDLE_FPS) - 1;

      if (now - lastRender >= interval) {
        lastRender = now;
        invalidate();

        if (active) {
          windowFrames++;
          if (now - windowStart >= 1000) {
            const fps = (windowFrames * 1000) / (now - windowStart);
            slowWindows = fps < OVERLOAD_FPS ? slowWindows + 1 : 0;
            if (slowWindows >= OVERLOAD_SECONDS && !demoted) {
              demoted = true;
              overload.current();
            }
            windowStart = now;
            windowFrames = 0;
          }
        } else {
          windowStart = now;
          windowFrames = 0;
          slowWindows = 0;
        }
      }
      schedule();
    };

    const poke = () => {
      lastInput = performance.now();
    };
    const onVisibility = () => {
      hidden = document.hidden;
      if (!hidden) {
        lastInput = performance.now();
        schedule();
      }
    };

    for (const e of INPUT_EVENTS) window.addEventListener(e, poke, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      for (const e of INPUT_EVENTS) window.removeEventListener(e, poke);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [invalidate]);

  return null;
}
