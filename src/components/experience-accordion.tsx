import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Plus } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";

export type AccordionEntry = {
  title: string;
  place: string;
  period: string;
  description: string;
  tags?: string[];
};

// Barre viola "Ruolo @ Azienda · periodo +" che si aprono sulla descrizione, come nel riferimento
export function ExperienceAccordion({ entries }: { entries: AccordionEntry[] }) {
  return (
    <Accordion className="gap-2.5">
      {entries.map((entry) => (
        <AccordionItem key={`${entry.place}-${entry.period}`} className="not-last:border-b-0">
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex min-h-12 w-full items-center gap-4 rounded-xs bg-bar px-6 py-3 text-left text-[0.95rem] font-semibold text-white transition-colors outline-none hover:bg-[#4d1290] focus-visible:ring-3 focus-visible:ring-ring/60">
              <span className="min-w-0 flex-1">
                {entry.title} <span className="sm:whitespace-nowrap">@ {entry.place}</span>
              </span>
              <span className="shrink-0 whitespace-nowrap">{entry.period}</span>
              <Plus
                aria-hidden="true"
                strokeWidth={1.5}
                className="size-4 shrink-0 sm:ml-4 transition-transform duration-300 group-aria-expanded:rotate-45"
              />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionContent className="px-6 pt-4 pb-3">
            <p className="font-mono text-sm leading-6 text-[#c7c7c9]">{entry.description}</p>
            {entry.tags && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-xs border border-white/15 px-2 py-0.5 font-mono text-xs text-[#c7c7c9]"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
