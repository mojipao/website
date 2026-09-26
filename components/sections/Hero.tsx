"use client";

import { useRef, type CSSProperties } from "react";
import { profile } from "@/lib/content";
import { useScrollProgress } from "@/lib/useScrollProgress";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref);

  return (
    <section ref={ref} id="top" className="scene relative h-[160vh]">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div className="hero-copy">
          <h1 className="rise text-[clamp(3.25rem,11vw,8.5rem)] leading-[0.95] font-semibold tracking-[-0.045em]">
            {profile.name}
          </h1>
          <p
            className="rise mt-6 text-lg text-dust sm:text-xl"
            style={{ "--delay": "180ms" } as CSSProperties}
          >
            {profile.school}
          </p>
        </div>

        <div className="horizon" aria-hidden />
      </div>
    </section>
  );
}
