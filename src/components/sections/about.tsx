import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { about } from "@/lib/site";

export function About() {
  return (
    <Section id="about" eyebrow="01 — Chi sono" title="Un po' di me">
      <div className="grid gap-12 md:grid-cols-[3fr_2fr]">
        <div className="space-y-4 text-base leading-7 text-muted-foreground">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="space-y-6">
          {about.skills.map((skill) => (
            <div key={skill.group}>
              <h3 className="text-sm font-medium">{skill.group}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <li key={item}>
                    <Badge variant="secondary">{item}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
