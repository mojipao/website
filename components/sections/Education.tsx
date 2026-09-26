import { awards, education } from "@/lib/content";
import FadeUp from "@/components/ui/FadeUp";
import ZoneLabel from "@/components/ui/ZoneLabel";

export default function Education() {
  return (
    <section id="education" data-zone className="relative px-6 py-[28vh] sm:px-12">
      <div className="mx-auto max-w-5xl">
        <FadeUp>
          <ZoneLabel zone="abyss" className="mb-8" />
          <h2 className="text-glow text-[clamp(2.75rem,8vw,7rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white">
            Foundations
            <span className="text-cyan-200">.</span>
          </h2>
        </FadeUp>

        <FadeUp stagger className="mt-20 space-y-6">
          {education.map((e) => (
            <div key={e.school} className="glass-dark rounded-[2rem] p-8 sm:p-12">
              <p className="text-sm font-medium text-cyan-100/60">{e.period}</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">{e.school}</h3>
              <p className="mt-3 text-xl font-medium text-sky-200">{e.degree}</p>
              {e.detail && <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">{e.detail}</p>}
            </div>
          ))}
        </FadeUp>

        <FadeUp className="mt-24">
          <h3 className="text-sm font-medium uppercase tracking-[0.28em] text-white/50">Awards & recognition</h3>
        </FadeUp>
        <FadeUp stagger className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {awards.map((a) => (
            <div key={a.title} className="flex flex-col justify-between gap-1 py-6 sm:flex-row sm:items-baseline">
              <p className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{a.title}</p>
              <p className="text-sm text-white/50 sm:text-base">{a.detail}</p>
            </div>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}
