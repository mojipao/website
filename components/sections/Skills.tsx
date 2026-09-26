import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { skills } from "@/lib/content";

export default function Skills() {
  return (
    <Section id="skills" index="04" eyebrow="Skills" title="What I work with.">
      <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {skills.map((group, i) => (
          <Reveal key={group.group} delay={i * 60}>
            <h3 className="mb-4 font-mono text-xs tracking-[0.2em] text-dust uppercase">{group.group}</h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item} className="chip rounded-full px-3.5 py-1.5 text-sm text-star/90">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
