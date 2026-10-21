import { ExperienceTimeline } from "@/components/experience-timeline";
import { Reveal } from "@/components/reveal";
import { Section, SectionTitle } from "@/components/section";
import { education, experience, experienceSection, otherExperience } from "@/lib/site";

export function Experience() {
  return (
    <Section id="experience" className="pt-12 pb-28 sm:pt-16 sm:pb-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionTitle id="experience" lines={experienceSection.titleLines} />
        </Reveal>

        <div className="mt-14">
          <ExperienceTimeline
            entries={experience.map((item) => ({
              title: item.role,
              place: item.company,
              period: item.period,
              description: item.description,
              tags: item.tags,
              kind: "work",
            }))}
          />
        </div>

        <Reveal className="mt-24">
          <h3 className="text-center font-heading text-2xl font-semibold sm:text-[1.75rem]">
            {experienceSection.otherTitle}
          </h3>
        </Reveal>
        <div className="mt-12">
          <ExperienceTimeline
            titleAs="h4"
            entries={[
              ...education.map((item) => ({
                title: item.course,
                place: item.school,
                period: item.period,
                description: item.description,
                tags: item.topics,
                kind: "education" as const,
              })),
              ...otherExperience.map((item) => ({
                title: item.role,
                place: item.company,
                period: item.period,
                description: item.description,
                kind: "work" as const,
              })),
            ]}
          />
        </div>
      </div>
    </Section>
  );
}
