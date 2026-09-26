import Reveal from "@/components/Reveal";
import { links, profile } from "@/lib/content";

export default function Contact() {
  return (
    <section id="contact" className="flex min-h-svh flex-col justify-center py-28">
      <div className="mx-auto w-full max-w-5xl px-6">
        <Reveal>
          <h2 className="text-[clamp(3rem,10vw,7.5rem)] leading-[0.95] font-semibold tracking-[-0.045em]">
            Let&apos;s talk.
          </h2>
        </Reveal>
        <Reveal delay={120} className="mt-10 max-w-lg text-lg text-dust">
          <p>Open to new roles, collaborations, and good conversations. Email is the best way to reach me.</p>
        </Reveal>
        <Reveal delay={220} className="mt-10">
          <a href={`mailto:${profile.email}`} className="link-underline pb-1 text-2xl font-medium sm:text-3xl">
            {profile.email}
          </a>
        </Reveal>
        <Reveal delay={300} className="mt-12 flex gap-8 text-sm text-dust">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-star">
              {l.label} ↗
            </a>
          ))}
        </Reveal>
      </div>
      <footer className="mx-auto mt-auto w-full max-w-5xl px-6 pt-24 font-mono text-xs text-faint">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </section>
  );
}
