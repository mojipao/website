import Reveal from "@/components/Reveal";
import { links, profile } from "@/lib/content";
import { ArrowIcon } from "./Hero";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="relative overflow-hidden rounded-3xl border border-white/10 px-6 py-16 text-center sm:px-12 sm:py-24">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 110%, color-mix(in oklab, var(--color-nebula-indigo) 28%, transparent), transparent 70%)",
            }}
            aria-hidden
          />
          <p className="mb-4 flex items-center justify-center gap-3 font-mono text-xs tracking-[0.25em] text-dust uppercase">
            <span className="text-nebula-indigo">06</span>
            <span className="h-px w-8 bg-white/15" aria-hidden />
            Contact
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Let&apos;s build something <span className="text-gradient">worth orbiting</span>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-dust">
            I&apos;m always glad to talk about interesting problems, new roles, or good ideas. The fastest way to reach me
            is email.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-star px-6 py-3 text-sm font-medium text-space-950 transition-transform hover:-translate-y-0.5"
            >
              {profile.email}
            </a>
            {links
              .filter((l) => l.label !== "Email")
              .map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-sm font-medium transition-colors hover:border-white/30 hover:bg-white/5"
                >
                  {l.label}
                  <ArrowIcon />
                </a>
              ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
