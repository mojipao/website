import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { experience } from "@/lib/content";

export default function Experience() {
  return (
    <Section id="experience" index="02" eyebrow="Experience" title="Where I've been.">
      <ol className="relative border-l border-white/10 pl-8 sm:pl-12">
        {experience.map((job, i) => (
          <Reveal as="li" key={job.company} delay={i * 80} className="relative pb-14 last:pb-0">
            {/* Orbit marker */}
            <span
              className="absolute top-1.5 -left-[calc(2rem+5px)] size-2.5 rounded-full bg-nebula-indigo shadow-[0_0_0_4px_var(--color-space-950),0_0_14px_var(--color-nebula-indigo)] sm:-left-[calc(3rem+5px)]"
              aria-hidden
            />
            <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
              <div className="font-mono text-xs leading-6 tracking-wide text-dust">
                <div>{job.period}</div>
                <div className="text-dust/70">{job.location}</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">
                  {job.role}
                  <span className="text-dust"> · {job.company}</span>
                </h3>
                <p className="mt-2 text-dust">{job.summary}</p>
                <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-star/85">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span className="mt-2.5 size-1 shrink-0 rounded-full bg-dust" aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span key={tag} className="chip rounded-full px-2.5 py-1 font-mono text-[11px] text-dust">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
