import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, eyebrow, title, children, className }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-16 py-20 sm:py-24", className)}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="font-mono text-sm text-muted-foreground">{eyebrow}</p>
        <h2
          id={`${id}-title`}
          className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          {title}
        </h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
