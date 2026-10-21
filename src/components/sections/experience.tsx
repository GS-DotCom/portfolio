import { ExperienceAccordion } from "@/components/experience-accordion";
import { Reveal } from "@/components/reveal";
import { Section, SectionTitle } from "@/components/section";
import { education, experience, experienceSection, otherExperience } from "@/lib/site";

export function Experience() {
  return (
    <Section id="experience" className="pt-12 pb-28 sm:pt-16 sm:pb-36">
      <div className="mx-auto max-w-[660px] px-4 sm:px-0">
        <Reveal>
          <SectionTitle id="experience" lines={experienceSection.titleLines} />
        </Reveal>

        <Reveal delay={100} className="mt-9">
          <ExperienceAccordion
            entries={experience.map((item) => ({
              title: item.role,
              place: item.company,
              period: item.period,
              description: item.description,
              tags: item.tags,
            }))}
          />
        </Reveal>

        <Reveal className="mt-20">
          <h3 className="text-center font-heading text-2xl font-semibold sm:text-[1.75rem]">
            {experienceSection.otherTitle}
          </h3>
          <div className="mt-8">
            <ExperienceAccordion
              entries={[
                ...education.map((item) => ({
                  title: item.course,
                  place: item.school,
                  period: item.period,
                  description: item.description,
                  tags: item.topics,
                })),
                ...otherExperience.map((item) => ({
                  title: item.role,
                  place: item.company,
                  period: item.period,
                  description: item.description,
                })),
              ]}
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
