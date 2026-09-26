"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects, skills } from "@/lib/content";
import ZoneLabel from "@/components/ui/ZoneLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function trackGlow(e: React.PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

export default function Projects() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const distance = () => Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth);
        gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.from("[data-project]", {
          opacity: 0,
          y: 60,
          stagger: 0.1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section.current, start: "top 60%" },
        });
      });
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="projects"
      data-zone
      className="relative h-(--track-h) motion-reduce:h-auto"
      style={{ "--track-h": `${(projects.length + 1) * 55 + 100}vh` } as React.CSSProperties}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden motion-reduce:relative motion-reduce:h-auto motion-reduce:py-24">
        <div className="mb-10 px-6 sm:px-12">
          <ZoneLabel zone="midnight" className="mb-6" />
          <h2 className="text-glow text-[clamp(2.5rem,6.5vw,5.75rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white">
            Things I&apos;ve{" "}
            <span className="bg-linear-to-r from-teal-200 via-cyan-300 to-violet-300 bg-clip-text text-transparent">
              made.
            </span>
          </h2>
        </div>

        <div
          ref={track}
          className="flex w-max gap-6 px-6 will-change-transform sm:px-12 motion-reduce:w-auto motion-reduce:flex-col"
        >
          {projects.map((p, i) => (
            <a
              key={p.name}
              href={p.href ?? "#"}
              data-project
              onPointerMove={trackGlow}
              className="biolum-card group relative flex h-[min(58vh,500px)] w-[min(82vw,470px)] shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] p-8 sm:p-10"
            >
              <div>
                <p className="font-mono text-sm text-cyan-200/60">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{p.name}</h3>
                <p className="mt-2 text-lg font-medium text-cyan-100/80">{p.tagline}</p>
                <p className="mt-6 text-base leading-relaxed text-white/65">{p.description}</p>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 text-white transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-cyan-200 group-hover:bg-cyan-200 group-hover:text-slate-950">
                  →
                </span>
              </div>
            </a>
          ))}

          <div
            data-project
            onPointerMove={trackGlow}
            className="biolum-card relative flex h-[min(58vh,500px)] w-[min(82vw,470px)] shrink-0 flex-col justify-between rounded-[2rem] p-8 sm:p-10"
          >
            <div>
              <p className="font-mono text-sm text-cyan-200/60">Toolkit</p>
              <h3 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Skills</h3>
              <p className="mt-2 text-lg font-medium text-cyan-100/80">What I reach for.</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-cyan-200/20 bg-cyan-200/5 px-4 py-2 text-sm text-cyan-50/90"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
