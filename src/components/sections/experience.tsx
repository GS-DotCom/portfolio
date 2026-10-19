import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { education, experience, otherExperience } from "@/lib/site";

type Entry = {
  title: string;
  place: string;
  period: string;
  description: string;
  tags?: string[];
};

export function Experience() {
  return (
    <Section id="experience" eyebrow="03 — Esperienza" title="Dove ho lavorato">
      <ol className="relative space-y-6 border-l pl-6 sm:pl-8">
        {experience.map((item) => (
          <li key={`${item.company}-${item.period}`} className="relative">
            <span
              aria-hidden="true"
              className="absolute top-6.5 -left-[calc(1.5rem+4.5px)] size-2 rounded-full bg-foreground ring-4 ring-background sm:-left-[calc(2rem+4.5px)]"
            />
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 className="font-heading text-lg font-medium">
                    {item.role}{" "}
                    <span className="font-normal text-muted-foreground">· {item.company}</span>
                  </h3>
                  <p className="shrink-0 font-mono text-sm text-muted-foreground">
                    {item.period}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="max-w-2xl text-base leading-7 text-pretty text-muted-foreground">
                  {item.description}
                </p>
                {item.tags && (
                  <ul className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <li key={tag}>
                        <Badge variant="outline">{tag}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>

      <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-10">
        <EntryList
          title="Altre esperienze"
          entries={otherExperience.map((item) => ({
            title: item.role,
            place: item.company,
            period: item.period,
            description: item.description,
          }))}
        />
        <EntryList
          title="Formazione"
          entries={education.map((item) => ({
            title: item.course,
            place: item.school,
            period: item.period,
            description: item.description,
            tags: item.topics,
          }))}
        />
      </div>
    </Section>
  );
}

function EntryList({ title, entries }: { title: string; entries: Entry[] }) {
  return (
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="mt-4 space-y-5">
        {entries.map((entry) => (
          <li key={`${entry.place}-${entry.period}`}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-medium">
                {entry.title}{" "}
                <span className="font-normal text-muted-foreground">· {entry.place}</span>
              </p>
              <p className="shrink-0 font-mono text-sm text-muted-foreground">{entry.period}</p>
            </div>
            <p className="mt-1 text-sm leading-6 text-pretty text-muted-foreground">
              {entry.description}
            </p>
            {entry.tags && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <li key={tag}>
                    <Badge variant="secondary">{tag}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
