import { Check } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { Reveal } from "@/components/reveal";
import { contact, type ProjectHighlight as Highlight } from "@/lib/site";

// Le parti tra **…** del paragrafo diventano grassetto, senza bisogno di una libreria Markdown
function withBold(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

// Colori del frammento di codice, come nel terminale della sezione AI:
// parole chiave in viola, stringhe in ciano, commenti in grigio
function highlightCode(snippet: string): ReactNode[] {
  return snippet.split("\n").map((line, lineIndex) => {
    const content = line.trimStart().startsWith("//") ? (
      <span className="text-faint">{line}</span>
    ) : (
      line.split(/("[^"]*"|\bawait\b)/g).map((token, index) => {
        if (token === "await") return <span key={index} className="text-violet">{token}</span>;
        if (token.startsWith('"')) return <span key={index} className="text-cyan">{token}</span>;
        return token;
      })
    );
    return (
      <span key={lineIndex} className="block">
        {content}
      </span>
    );
  });
}

// Sezione "In evidenza" della pagina di un progetto: una funzionalità raccontata come competenza
export function ProjectHighlight({ highlight }: { highlight: Highlight }) {
  const { image, code } = highlight;

  return (
    <section aria-labelledby="highlight-title" className="mt-24 border-t border-white/10 pt-16 sm:mt-32">
      <Reveal>
        <p className="font-mono text-sm font-semibold tracking-[0.12em] text-cyan uppercase">{highlight.eyebrow}</p>
        <h2
          id="highlight-title"
          className="mt-4 max-w-[44rem] font-heading text-[2rem] leading-[1.12] font-semibold tracking-tight text-balance sm:text-[2.75rem]"
        >
          {highlight.title}
        </h2>
        <p className="mt-6 max-w-[44rem] text-[1.05rem] leading-relaxed text-[#c7c7c9]">{withBold(highlight.lead)}</p>
      </Reveal>

      <div className="mt-14 grid items-start gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14">
        <Reveal className="min-w-0">
          <figure>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1146px) 600px, 100vw"
              className="h-auto w-full rounded-sm shadow-[0_0_0_1px_rgb(255_255_255/10%),0_28px_56px_-16px_rgb(0_0_0/60%)]"
            />
            <figcaption className="mt-3 text-[0.8rem] text-muted-foreground">{image.caption}</figcaption>
          </figure>
        </Reveal>

        <Reveal className="min-w-0" delay={100}>
          <h3 className="font-heading text-lg font-semibold">{highlight.rulesTitle}</h3>
          <ul className="mt-5 grid">
            {highlight.rules.map((rule) => (
              <li key={rule.name} className="grid gap-1.5 border-t border-white/15 py-4 last:border-b">
                <span className="text-[0.95rem] font-semibold">
                  {rule.name}
                  {rule.optional && <span className="font-normal text-muted-foreground"> {contact.form.optional}</span>}
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">{rule.text}</p>
                {rule.pattern && (
                  <code className="max-w-full justify-self-start overflow-x-auto border border-white/10 bg-card px-2 py-0.5 font-mono text-[0.8rem] whitespace-nowrap text-cyan">
                    {rule.pattern}
                  </code>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-14">
        <Reveal className="min-w-0">
          <h3 className="font-heading text-lg font-semibold">{code.title}</h3>
          <p className="mt-3.5 text-[0.92rem] leading-relaxed text-muted-foreground">{code.text}</p>
          <div role="img" aria-label={code.label} className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-[#0f0e13]">
            <div aria-hidden="true" className="flex items-center gap-2 border-b border-white/10 px-4 py-3 font-mono text-xs text-faint">
              <span className="size-[11px] rounded-full bg-[#ff5f57]" />
              <span className="size-[11px] rounded-full bg-[#febc2e]" />
              <span className="size-[11px] rounded-full bg-[#28c840]" />
              <span className="ml-1">{code.file}</span>
            </div>
            <pre aria-hidden="true" className="overflow-x-auto px-5 py-4 font-mono text-[0.8rem] leading-[1.7] text-foreground">
              <code>{highlightCode(code.snippet)}</code>
            </pre>
          </div>
        </Reveal>

        <Reveal className="min-w-0" delay={100}>
          <h3 className="font-heading text-lg font-semibold">{highlight.pointsTitle}</h3>
          <ul className="mt-5 grid gap-3.5">
            {highlight.points.map((point) => (
              <li key={point.title} className="grid grid-cols-[22px_1fr] gap-2.5 text-[0.92rem] leading-relaxed text-muted-foreground">
                <Check aria-hidden="true" strokeWidth={2} className="mt-0.5 size-[18px] text-violet" />
                <span>
                  <strong className="font-semibold text-foreground">{point.title}</strong> {point.text}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
