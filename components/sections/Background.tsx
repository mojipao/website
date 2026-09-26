import Label from "@/components/Label";
import Logo from "@/components/Logo";
import Reveal from "@/components/Reveal";
import { activities, education, recognition, skills } from "@/lib/content";

export default function Background() {
  return (
    <>
      <section id="education" className="py-28 sm:py-36">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <Label>Education</Label>
            <h2 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Where I study.</h2>
          </Reveal>

          <Reveal delay={100} className="mt-12">
            <div className="rounded-3xl border border-white/8 bg-surface p-7 sm:p-10">
              <div className="flex flex-wrap items-center gap-6">
                <Logo name={education.school} logo={education.logo} size={72} className="rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">{education.school}</h3>
                  <p className="mt-1 text-dust">{education.department}</p>
                </div>
              </div>

              <dl className="mt-10 grid gap-6 border-t border-white/8 pt-8 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="font-mono text-xs tracking-[0.18em] text-faint uppercase">Dates</dt>
                  <dd className="mt-2 text-lg">{education.period}</dd>
                </div>
                {education.degrees.map((d) => (
                  <div key={d.label}>
                    <dt className="font-mono text-xs tracking-[0.18em] text-faint uppercase">{d.label}</dt>
                    <dd className="mt-2 text-lg">{d.value}</dd>
                  </div>
                ))}
                <div>
                  <dt className="font-mono text-xs tracking-[0.18em] text-faint uppercase">Honors</dt>
                  <dd className="mt-2 text-lg">{education.honors}</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="activities" className="pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <Label>Activities</Label>
          </Reveal>
          <ul className="grid gap-4 md:grid-cols-2">
            {activities.map((a, i) => (
              <Reveal as="li" key={a.name} delay={i * 90}>
                <div className="flex h-full items-center gap-5 rounded-3xl border border-white/8 bg-surface p-6 sm:p-7">
                  <Logo name={a.name} logo={a.logo} size={60} className="rounded-2xl" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-medium tracking-tight">{a.role}</h3>
                    <p className="text-dust">{a.name}</p>
                    {a.team && <p className="mt-2 text-sm text-star/70">{a.team}</p>}
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="pt-12 pb-28 sm:pb-36">
        <div className="mx-auto grid max-w-5xl gap-14 px-6 md:grid-cols-2 md:gap-16">
          <Reveal>
            <Label>Recognition</Label>
            <ul className="space-y-3">
              {recognition.map((r) => (
                <li key={r.title} className="flex items-baseline justify-between gap-4">
                  {r.href ? (
                    <a href={r.href} target="_blank" rel="noreferrer" className="group">
                      <span className="link-underline">{r.title}</span> <span className="text-dust">· {r.detail}</span>{" "}
                      <span className="text-faint transition-colors group-hover:text-star">↗</span>
                    </a>
                  ) : (
                    <span>
                      {r.title} <span className="text-dust">· {r.detail}</span>
                    </span>
                  )}
                  <span className="shrink-0 font-mono text-xs text-faint">{r.period}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <Label>Tools</Label>
            <p className="leading-loose text-star/85">{skills.join(", ")}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
