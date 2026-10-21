import { Palette, Puzzle, Users, type LucideIcon } from "lucide-react";
import Image from "next/image";

import { CopyEmailButton } from "@/components/copy-email-button";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { contact, site, type Strength } from "@/lib/site";
import { cn } from "@/lib/utils";

const icons: Record<Strength["icon"], LucideIcon> = {
  "problem-solving": Puzzle,
  team: Users,
  design: Palette,
};

const colors: Record<Strength["color"], string> = {
  lilac: "bg-quote-lilac",
  blue: "bg-quote-blue",
  violet: "bg-quote-violet",
};

// Il primo riquadro occupa tutta l'altezza, gli altri due si dividono la colonna di destra
const placement = [
  "lg:row-span-2",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-3 lg:row-start-2",
];

const linkClass = "w-fit font-mono text-[1.05rem] font-semibold transition-colors hover:text-cyan";

// Logo PNG del social a sinistra del nome
const socialClass = "flex items-center gap-2.5";

function StrengthCard({ strength, className }: { strength: Strength; className?: string }) {
  const Icon = icons[strength.icon];
  return (
    <figure className={cn("relative flex flex-col p-7 text-white", colors[strength.color], className)}>
      <div className="flex items-start justify-between">
        <span aria-hidden="true" className="h-12 font-serif text-[6.5rem] leading-[0.9] font-bold text-white/45">
          &rdquo;
        </span>
        <span className="flex size-[4.75rem] items-center justify-center rounded-full border-[3px] border-white bg-black/15">
          <Icon aria-hidden="true" strokeWidth={1.5} className="size-8" />
        </span>
      </div>
      <blockquote className="mt-8 text-[0.95rem] leading-5">
        <p>{strength.text}</p>
      </blockquote>
      <figcaption className="mt-6">
        <p className="text-base font-bold">- {strength.title}</p>
        <p className="text-sm font-medium">{strength.source}</p>
      </figcaption>
    </figure>
  );
}

export function Contact() {
  return (
    <Section id="contact" className="bg-contact">
      <div className="mx-auto grid max-w-[1420px] lg:grid-cols-[1fr_364px_444px] lg:grid-rows-[284px_auto]">
        <Reveal className="px-4 py-14 sm:px-6 lg:row-span-2 lg:py-12 lg:pr-10 lg:pl-0">
          <h2 id="contact-title" className="max-w-[21rem] font-heading text-[2.1rem] leading-[1.3] font-bold">
            {contact.title}
          </h2>
          <p className="mt-10 max-w-[22rem] font-mono text-[1.05rem] leading-[1.4] font-semibold">
            {contact.intro}
          </p>

          <p className="mt-16 lg:mt-28">
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent(contact.emailSubject)}`}
              className="marker-underline font-mono text-lg font-medium wrap-anywhere [--marker:#8d47de] sm:text-[1.4rem]"
            >
              {site.email}
            </a>
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            <li>
              <CopyEmailButton email={site.email} className={linkClass} />
            </li>
            {site.socials.linkedin && (
              <li>
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(linkClass, socialClass)}
                >
                  <Image src="/socials/linkedin.png" alt="" width={20} height={20} className="size-5" />
                  LinkedIn
                </a>
              </li>
            )}
            {site.socials.github && (
              <li>
                <a
                  href={site.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(linkClass, socialClass)}
                >
                  <Image src="/socials/github.png" alt="" width={20} height={20} className="size-5" />
                  GitHub
                </a>
              </li>
            )}
          </ul>
        </Reveal>

        {contact.strengths.map((strength, index) => (
          <StrengthCard key={strength.title} strength={strength} className={placement[index]} />
        ))}
      </div>
    </Section>
  );
}
