import { Briefcase, GraduationCap } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export type TimelineEntry = {
  title: string;
  place: string;
  period: string;
  description: string;
  tags?: string[];
  kind: "work" | "education";
};

// Linea del tempo verticale come nel riferimento: linea bianca, cerchi viola e schede bianche.
// Da lg le schede si alternano ai due lati con la data di fronte; sotto, una colonna con la linea a sinistra.
export function ExperienceTimeline({
  entries,
  titleAs: Title = "h3",
}: {
  entries: TimelineEntry[];
  titleAs?: "h3" | "h4";
}) {
  return (
    <ol className="relative space-y-10 before:absolute before:inset-y-0 before:left-[22.5px] before:w-[3px] before:bg-white lg:space-y-14 lg:before:left-1/2 lg:before:-translate-x-1/2">
      {entries.map((entry, index) => {
        const onRight = index % 2 === 1;
        const Icon = entry.kind === "education" ? GraduationCap : Briefcase;

        return (
          <Reveal
            key={`${entry.place}-${entry.period}`}
            as="li"
            className="relative flex gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-x-8"
          >
            <span
              aria-hidden="true"
              className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-violet text-white shadow-[0_0_0_4px_#fff] lg:col-start-2 lg:row-start-1 lg:size-15"
            >
              <Icon strokeWidth={2} className="size-5 lg:size-6" />
            </span>

            <article
              className={cn(
                "relative min-w-0 flex-1 rounded-[0.25rem] bg-white px-5 py-5 text-[#272822] sm:px-6 shadow-[0_3px_0_#ddd] lg:row-start-1 lg:self-start",
                onRight ? "lg:col-start-3" : "lg:col-start-1"
              )}
            >
              {/* Freccina verso il cerchio: a sinistra su mobile e per le schede di destra */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-[17px] right-full border-y-[7px] border-r-[7px] border-y-transparent border-r-white lg:top-[23px]",
                  !onRight &&
                    "lg:right-auto lg:left-full lg:border-r-0 lg:border-l-[7px] lg:border-l-white"
                )}
              />
              <p className="mb-2 font-mono text-xs text-[#6b6a70] lg:hidden">{entry.period}</p>
              <Title className="font-heading text-lg leading-snug font-semibold">{entry.title}</Title>
              <p className="text-[0.95rem] font-semibold">{entry.place}</p>
              <p className="mt-3 text-sm leading-6 text-[#3b3a40]">{entry.description}</p>
              {entry.tags && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-xs bg-[#efe8f8] px-2 py-0.5 font-mono text-xs text-[#4b2a78]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <p
              className={cn(
                "hidden font-mono text-sm leading-5 text-[#c7c7c9] lg:row-start-1 lg:block lg:pt-5",
                onRight ? "lg:col-start-1 lg:text-right" : "lg:col-start-3"
              )}
            >
              {entry.period}
            </p>
          </Reveal>
        );
      })}
    </ol>
  );
}
