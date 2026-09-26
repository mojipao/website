import Label from "@/components/Label";
import Logo from "@/components/Logo";
import Reveal from "@/components/Reveal";
import { experience } from "@/lib/content";

export default function Experience() {
  return (
    <section id="experience" className="py-28 sm:py-40">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 md:grid-cols-[15rem_1fr] md:gap-16">
        <div className="md:sticky md:top-28 md:self-start">
          <Label>Work</Label>
          <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Where I&apos;ve been.</h2>
        </div>

        <ol>
          {experience.map((job) => (
            <Reveal
              as="li"
              key={job.company}
              className="flex gap-5 border-t border-white/8 py-9 first:border-t-0 first:pt-0 md:first:pt-3"
            >
              <Logo name={job.company} logo={job.logo} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="text-lg font-medium tracking-tight">{job.role}</h3>
                  <span className="font-mono text-xs text-faint">{job.period}</span>
                </div>
                <p className="text-dust">{job.company}</p>
                <p className="mt-3 leading-relaxed text-star/80">{job.summary}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
