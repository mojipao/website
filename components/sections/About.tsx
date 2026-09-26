import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { profile } from "@/lib/content";

export default function About() {
  return (
    <Section id="about" index="01" eyebrow="About" title="A short introduction.">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="space-y-5 text-lg leading-relaxed text-dust">
          {profile.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>
        <Reveal delay={120}>
          <dl className="card divide-y divide-white/8 rounded-2xl">
            {profile.facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-6 px-5 py-4">
                <dt className="font-mono text-xs tracking-[0.2em] text-dust uppercase">{fact.label}</dt>
                <dd className="text-right text-sm text-star">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
