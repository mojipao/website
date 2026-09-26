import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import { projects } from "@/lib/content";
import { ArrowIcon } from "./Hero";

export default function Projects() {
  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Projects"
      title="Things I've made."
      intro="A few selected pieces of work. Each one taught me something."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.name} delay={i * 70} className={project.featured ? "sm:col-span-2" : ""}>
            <a
              href={project.href}
              className={`card group flex h-full flex-col rounded-2xl p-6 hover:-translate-y-0.5 sm:p-7 ${
                project.featured ? "lg:grid lg:grid-cols-[1fr_1.2fr] lg:gap-10" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-dust">
                  <span>{project.year}</span>
                  <span className="inline-flex size-7 items-center justify-center rounded-full border border-white/10 text-star transition-colors group-hover:border-nebula-indigo/50 group-hover:bg-nebula-indigo/15">
                    <ArrowIcon />
                  </span>
                </div>
                <h3 className={`mt-6 font-semibold tracking-tight ${project.featured ? "text-2xl sm:text-3xl" : "text-xl"}`}>
                  {project.name}
                </h3>
              </div>
              <div className={project.featured ? "lg:flex lg:flex-col lg:justify-end" : ""}>
                <p className="mt-3 leading-relaxed text-dust">{project.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="chip rounded-full px-2.5 py-1 font-mono text-[11px] text-dust">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
