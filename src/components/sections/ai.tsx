import { Sparkles, Terminal } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Section, SectionTitle } from "@/components/section";
import { aiSection } from "@/lib/site";

// Simbolo e colore di ogni riga del finto terminale
const terminalStyles = {
  prompt: { symbol: ">", symbolClass: "text-cyan", textClass: "text-white" },
  reply: { symbol: "●", symbolClass: "text-lilac", textClass: "text-[#c7c7c9]" },
  ok: { symbol: "✓", symbolClass: "text-emerald-400", textClass: "text-[#c7c7c9]" },
} as const;

export function Ai() {
  return (
    <Section id="ai" className="pt-16 pb-24 sm:pt-20 sm:pb-32">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
        <Reveal>
          <SectionTitle id="ai" lines={aiSection.titleLines} />
          <p className="mx-auto mt-8 max-w-[40rem] text-center leading-7 text-[#c7c7c9]">{aiSection.intro}</p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-14">
          {/* Finto terminale: decorativo, il racconto vero è nei passi accanto */}
          <Reveal delay={100}>
            <div
              aria-hidden="true"
              className="overflow-hidden rounded-md border border-white/15 bg-[#0e0e12] shadow-(--card-shadow)"
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="size-3 rounded-full bg-[#ff5f57]" />
                <span className="size-3 rounded-full bg-[#febc2e]" />
                <span className="size-3 rounded-full bg-[#28c840]" />
                <span className="ml-3 flex items-center gap-1.5 font-mono text-xs text-faint">
                  <Terminal className="size-3.5" />
                  claude — portfolio
                </span>
              </div>
              <ul className="space-y-2.5 px-5 py-6 font-mono text-[0.8rem] leading-5">
                {aiSection.terminal.map((line, index) => {
                  const style = terminalStyles[line.kind];
                  return (
                    <li key={index} className="flex gap-3">
                      <span className={style.symbolClass}>{style.symbol}</span>
                      <span className={style.textClass}>{line.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h3 className="flex items-center gap-3 font-heading text-2xl font-semibold">
              <Sparkles aria-hidden="true" strokeWidth={1.5} className="size-6 text-lilac" />
              {aiSection.stepsTitle}
            </h3>
            <ol className="mt-7 space-y-6">
              {aiSection.steps.map((step, index) => (
                <li key={step.title} className="flex gap-5">
                  <span aria-hidden="true" className="font-mono text-2xl leading-7 font-semibold text-violet">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="font-heading text-lg leading-7 font-semibold">{step.title}</h4>
                    <p className="mt-1 text-[0.95rem] leading-6 text-[#c7c7c9]">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal className="mt-20">
          <h3 className="text-center font-heading text-2xl font-semibold sm:text-[1.75rem]">{aiSection.stackTitle}</h3>
          <ul className="mt-8 grid gap-px border border-white/20 bg-white/20 sm:grid-cols-2 lg:grid-cols-5">
            {aiSection.stack.map((item) => (
              <li key={item.name} className="bg-background px-5 py-5">
                <p className="font-heading font-semibold">{item.name}</p>
                <p className="mt-1.5 font-mono text-xs leading-5 text-[#c7c7c9]">{item.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
