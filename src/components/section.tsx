import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

// Ogni sezione disegna il proprio titolo con id `${id}-title`; scroll-mt compensa l'header fisso
export function Section({ id, children, className }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-20", className)}>
      {children}
    </section>
  );
}

// Titolo centrato delle sezioni, in Poppins semibold come nel riferimento
export function SectionTitle({
  id,
  lines,
  className,
}: {
  id: string;
  lines: string[];
  className?: string;
}) {
  return (
    <h2
      id={`${id}-title`}
      className={cn(
        "text-center font-heading text-4xl leading-[1.12] font-semibold tracking-tight sm:text-[3.6rem]",
        className
      )}
    >
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h2>
  );
}
