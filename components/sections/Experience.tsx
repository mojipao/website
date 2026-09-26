"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { experience } from "@/lib/content";
import FadeUp from "@/components/ui/FadeUp";
import ZoneLabel from "@/components/ui/ZoneLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STACK_OFFSET = 28;

export default function Experience() {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          const scrollTrigger = {
            trigger: next,
            start: "top bottom",
            end: () => `top ${window.innerHeight * 0.14 + (i + 1) * STACK_OFFSET}px`,
            scrub: true,
            invalidateOnRefresh: true,
          };
          gsap.to(card.querySelector("[data-dim]"), { opacity: 0.65, ease: "none", scrollTrigger });
          gsap.to(card.firstElementChild, { scale: 0.92, ease: "none", scrollTrigger });
        });
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} id="experience" data-zone className="relative px-6 pb-[30vh] pt-[20vh] sm:px-12">
      <div className="mx-auto max-w-5xl">
        <FadeUp className="mb-[18vh]">
          <ZoneLabel zone="twilight" className="mb-8" />
          <h2 className="text-glow text-[clamp(2.75rem,8vw,7rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white">
            Where I&apos;ve
            <br />
            <span className="bg-linear-to-r from-cyan-200 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              been.
            </span>
          </h2>
        </FadeUp>

        <div className="relative">
          {experience.map((role, i) => (
            <div
              key={`${role.company}-${i}`}
              data-card
              className="sticky mb-[35vh] last:mb-0"
              style={{ top: `calc(14vh + ${i * STACK_OFFSET}px)` }}
            >
              <article className="glass-card relative origin-top overflow-hidden rounded-[2rem] p-8 will-change-transform sm:p-12">
                <div data-dim className="pointer-events-none absolute inset-0 z-10 bg-[#030a16] opacity-0" />
                <div className="relative grid gap-8 md:grid-cols-[1fr_1.35fr] md:gap-14">
                  <header>
                    <p className="text-sm font-medium tracking-wide text-cyan-100/70">{role.period}</p>
                    <h3 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl">
                      {role.title}
                    </h3>
                    <p className="mt-2 text-lg font-medium text-sky-200">{role.company}</p>
                    {role.location && <p className="mt-1 text-sm text-white/50">{role.location}</p>}
                  </header>
                  <ul className="space-y-5">
                    {role.highlights.map((h) => (
                      <li key={h} className="flex gap-4 text-base leading-relaxed text-white/80 sm:text-lg">
                        <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(165,243,252,0.9)]" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
