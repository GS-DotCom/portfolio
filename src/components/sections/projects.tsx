import { ProjectGrid } from "@/components/project-grid";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { projects, projectsSection } from "@/lib/site";

export function Projects() {
  const items = projectsSection.showPlaceholders
    ? projects
    : projects.filter((project) => !project.placeholder);

  return (
    <Section id="projects" className="pt-16 pb-24 sm:pt-20 sm:pb-32">
      <div className="mx-auto max-w-[1146px] px-4 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-6">
          <Reveal>
            <h2
              id="projects-title"
              className="font-heading text-6xl leading-[1.05] font-semibold tracking-tight sm:text-[6.75rem]"
            >
              {projectsSection.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-12 max-w-[26rem] font-mono text-lg leading-[1.2] font-medium">
              {projectsSection.intro}
            </p>
          </Reveal>

          {/* Colonna destra libera: il contenuto è ancora da decidere */}
          <div aria-hidden="true" className="hidden lg:block" />
        </div>

        <Reveal className="mt-24 sm:mt-20">
          <ProjectGrid projects={items} />
        </Reveal>
      </div>
    </Section>
  );
}
