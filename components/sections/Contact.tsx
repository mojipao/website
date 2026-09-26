"use client";

import { links, profile } from "@/lib/content";
import { scrollToTarget } from "@/lib/store";
import FadeUp from "@/components/ui/FadeUp";
import ZoneLabel from "@/components/ui/ZoneLabel";

export default function Contact() {
  return (
    <section
      id="contact"
      data-zone
      className="relative flex min-h-[130vh] flex-col items-center justify-end px-6 pb-12 text-center sm:px-12"
    >
      <div className="flex flex-1 flex-col items-center justify-center pt-[20vh]">
        <FadeUp className="flex flex-col items-center">
          <ZoneLabel zone="hadal" className="mb-10" />
          <h2 className="text-glow text-[clamp(3rem,11vw,9.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-white">
            Let&apos;s
            <br />
            <span className="bg-linear-to-r from-cyan-200 via-teal-200 to-violet-300 bg-clip-text text-transparent">
              connect.
            </span>
          </h2>
          <p className="mt-8 max-w-lg text-balance text-lg text-white/65 sm:text-xl">
            You made it to the bottom of the ocean. Say hello, I&apos;d love to hear from you.
          </p>
        </FadeUp>

        <FadeUp stagger className="mt-14 flex flex-wrap justify-center gap-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="glow-link group flex min-w-56 flex-col items-start rounded-2xl px-6 py-4 text-left"
            >
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-200/70">{l.label}</span>
              <span className="mt-1 text-lg font-medium text-white transition-colors group-hover:text-cyan-100">
                {l.handle}
              </span>
            </a>
          ))}
        </FadeUp>

        <FadeUp className="mt-20">
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="group flex flex-col items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-white/60 transition-colors hover:text-white"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full border border-white/20 text-lg transition-all duration-500 group-hover:-translate-y-1 group-hover:border-cyan-200 group-hover:shadow-[0_0_30px_rgba(103,232,249,0.45)]">
              ↑
            </span>
            Return to surface
          </button>
        </FadeUp>
      </div>

      <footer className="mt-24 flex w-full max-w-5xl flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>Made at the bottom of the ocean.</p>
      </footer>
    </section>
  );
}
