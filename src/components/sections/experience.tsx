import { Section } from "@/components/section";
import { experience } from "@/lib/site";

export function Experience() {
  return (
    <Section id="experience" eyebrow="03 — Esperienza" title="Dove ho lavorato">
      <ol className="relative space-y-10 border-l pl-6 sm:pl-8">
        {experience.map((item) => (
          <li key={`${item.company}-${item.period}`} className="relative">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[calc(1.5rem+4.5px)] size-2 rounded-full bg-foreground ring-4 ring-background sm:-left-[calc(2rem+4.5px)]"
            />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <h3 className="font-heading text-lg font-medium">
                {item.role}{" "}
                <span className="text-muted-foreground">· {item.company}</span>
              </h3>
              <p className="shrink-0 font-mono text-sm text-muted-foreground">
                {item.period}
              </p>
            </div>
            <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
