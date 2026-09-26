"use client";

import { useRef } from "react";
import { profile } from "@/lib/content";
import RevealText from "@/components/ui/RevealText";
import FadeUp from "@/components/ui/FadeUp";
import ZoneLabel from "@/components/ui/ZoneLabel";

export default function Bio() {
  const section = useRef<HTMLElement>(null);

  return (
    <section ref={section} id="about" data-zone className="relative h-[230vh]">
      <div className="sticky top-0 flex h-svh items-center px-6 sm:px-12">
        <div className="mx-auto w-full max-w-5xl">
          <ZoneLabel zone="sunlight" className="mb-10" />
          <RevealText
            text={profile.bio}
            trigger={section}
            start="top top"
            end="65% bottom"
            className="text-glow text-[clamp(1.6rem,3.6vw,3.2rem)] font-semibold leading-[1.18] tracking-[-0.025em] text-white"
          />
          <FadeUp stagger className="mt-14 grid grid-cols-3 gap-6 border-t border-white/15 pt-8 sm:max-w-2xl">
            {profile.stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">{s.value}</p>
                <p className="mt-2 text-xs text-white/60 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
