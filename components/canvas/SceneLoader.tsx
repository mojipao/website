"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useDive } from "@/lib/store";
import { waterColorCss } from "@/lib/depth";

const OceanScene = dynamic(() => import("./OceanScene"), { ssr: false });

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Static gradient that follows the dive depth, used when WebGL or motion is unavailable. */
function StaticOcean() {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const paint = (depth: number) => {
      if (!el.current) return;
      const top = waterColorCss(Math.max(depth - 150, 0));
      const bottom = waterColorCss(depth + 400);
      el.current.style.background = `linear-gradient(180deg, ${top}, ${bottom})`;
    };
    paint(useDive.getState().depth);
    return useDive.subscribe((s) => paint(s.depth));
  }, []);
  return <div ref={el} aria-hidden className="fixed inset-0 -z-10 transition-[background] duration-500" />;
}

export default function SceneLoader() {
  const reducedMotion = useDive((s) => s.reducedMotion);
  const [mode, setMode] = useState<"pending" | "webgl" | "static">("pending");

  useEffect(() => {
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Deferred so the check runs after hydration, never during render.
    const id = requestAnimationFrame(() => setMode(motionOk && hasWebGL() ? "webgl" : "static"));
    return () => cancelAnimationFrame(id);
  }, [reducedMotion]);

  return (
    <>
      <StaticOcean />
      {mode === "webgl" && (
        <div aria-hidden className="animate-scene-in fixed inset-0 -z-10">
          <OceanScene />
        </div>
      )}
    </>
  );
}
