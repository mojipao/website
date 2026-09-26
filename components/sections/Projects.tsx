"use client";

import { useEffect, useRef } from "react";
import Label from "@/components/Label";
import Reveal from "@/components/Reveal";
import { projects } from "@/lib/content";
import { useMediaQuery, useScrollProgress } from "@/lib/useScrollProgress";

const PIN_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

export default function Projects() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pinned = useMediaQuery(PIN_QUERY);
  useScrollProgress(section);

  useEffect(() => {
    const el = section.current;
    const row = track.current;
    if (!el || !row) return;
    if (!pinned) {
      el.style.removeProperty("--dist");
      el.style.removeProperty("height");
      return;
    }
    const measure = () => {
      const dist = Math.max(row.scrollWidth - window.innerWidth, 0);
      el.style.setProperty("--dist", `${dist}px`);
      el.style.height = `${dist + window.innerHeight * 1.15}px`;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  return (
    <section ref={section} id="projects" className="scene relative">
      <div className={pinned ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden" : "py-28"}>
        <div className="mx-auto mb-12 w-full max-w-5xl px-6">
          <Label>Projects</Label>
          <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Things I&apos;ve made.</h2>
        </div>

        <div
          ref={track}
          className={
            pinned
              ? "projects-track flex w-max gap-5 pr-[10vw] pl-[max(1.5rem,calc((100vw-64rem)/2+1.5rem))]"
              : "mx-auto grid max-w-5xl gap-4 px-6"
          }
        >
          {projects.map((project, i) => {
            const Card = project.href ? "a" : "div";
            return (
              <Reveal key={project.name} delay={pinned ? i * 90 : 0}>
                <Card
                  {...(project.href ? { href: project.href, target: "_blank", rel: "noreferrer" } : {})}
                  className={`group flex flex-col justify-between rounded-3xl border border-white/8 bg-surface p-7 transition-colors duration-500 ${
                    project.href ? "hover:border-white/20" : ""
                  } ${pinned ? "h-[min(28rem,62vh)] w-[min(26rem,36vw)]" : "min-h-56"}`}
                >
                  <div className="flex items-center justify-between font-mono text-xs text-faint">
                    <span>{project.year}</span>
                    {project.href && (
                      <span className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        ↗
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium tracking-tight">{project.name}</h3>
                    <p className="mt-3 leading-relaxed text-dust">{project.description}</p>
                    <p className="mt-6 font-mono text-xs text-faint">{project.stack.join("  ·  ")}</p>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
