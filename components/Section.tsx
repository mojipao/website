import type { ReactNode } from "react";
import Reveal from "./Reveal";

interface SectionProps {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children: ReactNode;
}

export default function Section({ id, index, eyebrow, title, intro, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="mb-12 sm:mb-16">
          <p className="mb-4 flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-dust uppercase">
            <span className="text-nebula-indigo">{index}</span>
            <span className="h-px w-8 bg-white/15" aria-hidden />
            {eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
          {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-dust">{intro}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
