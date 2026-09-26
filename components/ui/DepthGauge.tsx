"use client";

import { useEffect, useRef, useState } from "react";
import { useDive, scrollToTarget } from "@/lib/store";
import { ZONE_COUNT, depthToZone, formatDepth } from "@/lib/depth";

const MARKS = [
  { z: 0, label: "0" },
  { z: 1, label: "200" },
  { z: 2, label: "1k" },
  { z: 3, label: "4k" },
  { z: 4, label: "6k" },
  { z: 5, label: "11k" },
];

/**
 * Reads the dive store through a subscription and writes to the DOM directly,
 * so scrolling never re-renders React for the constantly-changing readout.
 */
export default function DepthGauge() {
  const depthEl = useRef<HTMLSpanElement>(null);
  const mobileDepthEl = useRef<HTMLSpanElement>(null);
  const marker = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const [zoneName, setZoneName] = useState("Surface");
  const [showSurface, setShowSurface] = useState(false);

  useEffect(() => {
    let raf = 0;
    let shown = 0;
    let target = 0;
    const apply = () => {
      shown += (target - shown) * 0.12;
      if (Math.abs(target - shown) < 0.5) shown = target;
      const text = formatDepth(shown);
      if (depthEl.current) depthEl.current.textContent = text;
      if (mobileDepthEl.current) mobileDepthEl.current.textContent = text;
      raf = shown === target ? 0 : requestAnimationFrame(apply);
    };
    const onChange = ({ depth, zone }: { depth: number; zone: number }) => {
      target = depth;
      const pct = (zone / (ZONE_COUNT - 1)) * 100;
      if (marker.current) marker.current.style.top = `${pct}%`;
      if (fill.current) fill.current.style.height = `${pct}%`;
      setZoneName(depthToZone(depth).name);
      setShowSurface(depth > 300);
      if (!raf) raf = requestAnimationFrame(apply);
    };
    onChange(useDive.getState());
    const unsub = useDive.subscribe(onChange);
    return () => {
      unsub();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <aside
        aria-hidden
        className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-4 xl:flex"
      >
        <div className="text-right">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">Depth</p>
          <p className="mt-1 font-mono text-2xl font-medium tabular-nums tracking-tight text-white">
            <span ref={depthEl}>0</span>
            <span className="ml-1 text-sm text-white/60">m</span>
          </p>
          <p className="mt-1 text-[11px] font-medium text-cyan-100/70 transition-all duration-700">{zoneName}</p>
        </div>
        <div className="relative h-[38vh] w-8">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/15" />
          <div
            ref={fill}
            className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-linear-to-b from-cyan-200 to-violet-300 transition-[height] duration-300 ease-out"
          />
          {MARKS.map((m) => (
            <div
              key={m.z}
              className="absolute left-1/2 flex -translate-y-1/2 items-center"
              style={{ top: `${(m.z / (ZONE_COUNT - 1)) * 100}%` }}
            >
              <span className="h-px w-2 -translate-x-1/2 bg-white/40" />
              <span className="ml-1 font-mono text-[9px] text-white/35">{m.label}</span>
            </div>
          ))}
          <div
            ref={marker}
            className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100 shadow-[0_0_16px_4px_rgba(103,232,249,0.7)] transition-[top] duration-300 ease-out"
          />
        </div>
      </aside>

      <div
        aria-hidden
        className="glass pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full px-4 py-2 font-mono text-xs tabular-nums text-white xl:hidden"
      >
        <span ref={mobileDepthEl}>0</span> m · <span className="text-cyan-100/80">{zoneName}</span>
      </div>

      <button
        type="button"
        onClick={() => scrollToTarget(0)}
        aria-label="Return to surface"
        className={`glass fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full text-white transition-all duration-700 hover:shadow-[0_0_24px_rgba(103,232,249,0.5)] md:bottom-8 md:right-8 ${
          showSurface ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        ↑
      </button>
    </>
  );
}
