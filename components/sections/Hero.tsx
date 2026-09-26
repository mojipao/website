import Planet from "@/components/Planet";
import Reveal from "@/components/Reveal";
import { links, profile } from "@/lib/content";

export default function Hero() {
  const linkedin = links.find((l) => l.label === "LinkedIn");

  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden pt-24 pb-16">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-12 px-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Reveal>
            <p className="mb-6 flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-dust uppercase">
              <span className="inline-flex size-1.5 rounded-full bg-nebula-cyan shadow-[0_0_10px_var(--color-nebula-cyan)]" />
              {profile.role} · {profile.location}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-5xl font-semibold tracking-[-0.03em] text-balance sm:text-6xl lg:text-7xl">
              {profile.name}
              <span className="text-gradient">.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-dust sm:text-xl">{profile.tagline}</p>
          </Reveal>
          <Reveal delay={240} className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-star px-5 py-2.5 text-sm font-medium text-space-950 transition-transform hover:-translate-y-0.5"
            >
              Get in touch
            </a>
            {linkedin && (
              <a
                href={linkedin.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm font-medium text-star transition-colors hover:border-white/30 hover:bg-white/5"
              >
                LinkedIn
                <ArrowIcon />
              </a>
            )}
          </Reveal>
        </div>

        <Reveal delay={200} className="mx-auto w-full max-w-[340px] lg:max-w-none">
          <Planet className="w-full" />
        </Reveal>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-dust uppercase transition-colors hover:text-star sm:flex"
      >
        Scroll
        <span className="h-8 w-px bg-linear-to-b from-dust to-transparent" aria-hidden />
      </a>
    </section>
  );
}

export function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
