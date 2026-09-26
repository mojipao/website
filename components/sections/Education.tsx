import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { education, recognition } from "@/lib/content";

export default function Education() {
  return (
    <Section id="education" index="05" eyebrow="Education & recognition" title="Background.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal>
          <div className="card h-full rounded-2xl p-6 sm:p-7">
            <h3 className="font-mono text-xs tracking-[0.2em] text-dust uppercase">Education</h3>
            <ul className="mt-6 space-y-6">
              {education.map((e) => (
                <li key={e.school}>
                  <div className="font-mono text-xs text-dust">{e.period}</div>
                  <div className="mt-1 text-lg font-semibold tracking-tight">{e.school}</div>
                  <div className="text-star/85">{e.degree}</div>
                  <p className="mt-2 text-sm text-dust">{e.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="card h-full rounded-2xl p-6 sm:p-7">
            <h3 className="font-mono text-xs tracking-[0.2em] text-dust uppercase">Recognition</h3>
            <ul className="mt-6 divide-y divide-white/8">
              {recognition.map((r) => (
                <li key={r.title} className="flex items-baseline justify-between gap-6 py-3 first:pt-0 last:pb-0">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-sm text-dust">{r.by}</div>
                  </div>
                  <span className="font-mono text-xs text-dust">{r.year}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
