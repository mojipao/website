"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { profile } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from("[data-hero-eyebrow]", { opacity: 0, y: 16, duration: 1, delay: 0.3 })
          .from(
            "[data-char]",
            { yPercent: 60, opacity: 0, filter: "blur(12px)", duration: 1.3, stagger: 0.035, clearProps: "filter" },
            "<0.1",
          )
          .from("[data-hero-sub]", { opacity: 0, y: 24, filter: "blur(10px)", duration: 1.2 }, "-=0.8")
          .from("[data-hero-cue]", { opacity: 0, duration: 1 }, "-=0.4");

        gsap.to("[data-hero-content]", {
          yPercent: -35,
          scale: 0.9,
          opacity: 0,
          filter: "blur(12px)",
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top top", end: "bottom 20%", scrub: true },
        });
      });
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="top"
      data-zone
      className="relative flex h-svh items-center justify-center overflow-hidden px-6"
    >
      <div data-hero-content className="flex flex-col items-center text-center will-change-transform">
        <p data-hero-eyebrow className="mb-6 text-sm font-medium uppercase tracking-[0.35em] text-white/80">
          {profile.role} · {profile.location}
        </p>
        <h1
          aria-label={profile.name}
          className="text-glow text-[clamp(3.5rem,13vw,11rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-white"
        >
          {profile.name.split(" ").map((word, w) => (
            <span key={w} className="inline-block whitespace-nowrap">
              {word.split("").map((ch, c) => (
                <span key={c} data-char aria-hidden className="inline-block">
                  {ch}
                </span>
              ))}
              {w < profile.name.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
            </span>
          ))}
          <span data-char aria-hidden className="inline-block text-cyan-200">.</span>
        </h1>
        <p
          data-hero-sub
          className="mt-8 max-w-xl text-balance text-lg font-medium text-white/85 sm:text-2xl sm:leading-snug"
        >
          {profile.tagline}
        </p>
      </div>

      <div
        data-hero-cue
        className="absolute bottom-20 left-1/2 md:bottom-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-white/75"
      >
        Scroll to dive
        <span className="relative block h-14 w-px overflow-hidden bg-white/20">
          <span className="animate-dive-cue absolute inset-x-0 top-0 h-1/2 bg-white" />
        </span>
      </div>
    </section>
  );
}
