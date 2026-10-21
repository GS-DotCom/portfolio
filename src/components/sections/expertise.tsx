import { Database, Monitor, Network, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";

import { Reveal } from "@/components/reveal";
import { Section, SectionTitle } from "@/components/section";
import { expertise, type ExpertiseItem } from "@/lib/site";

const icons: Record<ExpertiseItem["icon"], LucideIcon> = {
  web: Monitor,
  database: Database,
  network: Network,
};

// Frammento di codice decorativo sotto al riquadro, come nel riferimento (testo nostro)
const codeLines: { indent: number; parts: [string, string][] }[] = [
  { indent: 0, parts: [["tag", '<html lang="it">']] },
  { indent: 1, parts: [["tag", "<head>"]] },
  {
    indent: 2,
    parts: [
      ["tag", "<meta "],
      ["attr", 'name="viewport" content="width=device-width, initial-scale=1.0"'],
      ["tag", ">"],
    ],
  },
  { indent: 2, parts: [["tag", "<title>"], ["text", "Cosa faccio"], ["tag", "</title>"]] },
  { indent: 1, parts: [["tag", "</head>"]] },
  { indent: 1, parts: [["tag", "<body>"]] },
  { indent: 2, parts: [["tag", "<h1>"], ["text", "Codice, reti e un pizzico di design"], ["tag", "</h1>"]] },
  { indent: 2, parts: [["tag", "<p>"]] },
  { indent: 3, parts: [["text", "Prima scrivo il codice, poi controllo"]] },
  { indent: 3, parts: [["text", "che il firewall lo lasci passare."]] },
  { indent: 2, parts: [["tag", "</p>"]] },
  { indent: 2, parts: [["tag", "<span>"]] },
  { indent: 3, parts: [["text", 'Ah, quasi dimenticavo: "Ciao mondo!"']] },
  { indent: 2, parts: [["tag", "</span>"]] },
  { indent: 1, parts: [["tag", "</body>"]] },
  { indent: 0, parts: [["tag", "</html>"]] },
];

const codeColors: Record<string, string> = {
  tag: "text-[#7a2f3a]",
  attr: "text-[#2f6b4a]",
  text: "text-[#55545a]",
};

export function Expertise() {
  return (
    <Section id="expertise" className="relative pt-28 pb-10 sm:pt-36">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
        <Reveal>
          <SectionTitle id="expertise" lines={[expertise.title]} />
        </Reveal>

        <Reveal delay={100} className="relative z-10 mt-12 sm:mt-14">
          <ul className="grid border-2 border-white/60 bg-background md:grid-cols-3">
            {expertise.items.map((item) => {
              const Icon = icons[item.icon];
              return (
                <li
                  key={item.title}
                  className="border-white/60 px-7 pt-10 pb-12 not-last:border-b-2 md:not-last:border-r-2 md:not-last:border-b-0"
                >
                  <div className="flex items-start gap-4">
                    <Icon aria-hidden="true" strokeWidth={1.25} className="mt-0.5 size-10 shrink-0" />
                    <h3 className="font-heading text-2xl leading-7 font-semibold">
                      <span
                        className="marker-underline"
                        style={{ "--marker": `var(--${item.color})` } as CSSProperties}
                      >
                        {item.title}
                      </span>
                      <span className="block">{item.subtitle}</span>
                    </h3>
                  </div>
                  <div className="mt-6 font-mono text-xs text-faint">
                    <span aria-hidden="true">{"<h3>"}</span>
                    <p className="my-2 ml-3.5 border-l border-white/30 pl-4 text-[0.9rem] leading-5 text-foreground">
                      {item.description}
                    </p>
                    <span aria-hidden="true">{"</h3>"}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>

      <pre
        aria-hidden="true"
        className="pointer-events-none mx-auto -mt-2 hidden w-fit font-mono text-[0.7rem] leading-4 select-none md:block"
      >
        {codeLines.map((line, index) => (
          <div key={index} className="border-l border-white/5" style={{ paddingLeft: `${line.indent * 1.25}rem` }}>
            {line.parts.map(([kind, text], partIndex) => (
              <span key={partIndex} className={codeColors[kind]}>
                {text}
              </span>
            ))}
          </div>
        ))}
      </pre>
    </Section>
  );
}
