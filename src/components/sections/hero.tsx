import Image from "next/image";

import { HeroWaves } from "@/components/hero-waves";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Section } from "@/components/section";
import { hero, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const initials = site.name
  .split(" ")
  .map((word) => word[0])
  .join("");

// Un link social vuoto in site.ts nasconde la relativa icona
const socialLinks = [
  { label: "GitHub", href: site.socials.github, Icon: GitHubIcon },
  { label: "LinkedIn", href: site.socials.linkedin, Icon: LinkedInIcon },
].filter((link) => link.href);

export function Hero() {
  return (
    <Section
      id="home"
      className="relative isolate flex min-h-[max(100svh,720px)] flex-col overflow-hidden bg-[linear-gradient(to_bottom,var(--hero)_0%,var(--hero)_70%,var(--background)_100%)]"
    >
      <div className="absolute inset-0 -z-10">
        <HeroWaves />
        {/* Passaggio morbido verso il resto della pagina */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-b from-transparent to-background" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pt-20 pb-48 text-center">
        {/* Foto e social stanno sopra il nome, allineati alla sua prima lettera come nel riferimento */}
        <div className="flex flex-col items-start">
          <div className="mb-5 flex items-center gap-5">
            {site.photo ? (
              <Image
                src={site.photo}
                alt={`Foto di ${site.name}`}
                width={160}
                height={160}
                priority
                className="size-16 rounded-full object-cover sm:size-20"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-16 items-center justify-center rounded-full bg-[#d9d9d9] font-heading text-xl font-semibold text-[#3b3a40] sm:size-20 sm:text-2xl"
              >
                {initials}
              </span>
            )}
            <ul className="flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="block text-white transition-colors hover:text-lilac"
                  >
                    <Icon className="size-6" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <h1
            id="home-title"
            className="text-left font-heading text-5xl leading-[1.05] font-bold text-white [text-shadow:0_6px_40px_rgb(0_0_0/0.45)] sm:text-7xl sm:whitespace-nowrap xl:text-8xl"
          >
            {site.name}
          </h1>
        </div>
        <p className="mt-6 font-mono text-sm font-medium tracking-[0.2em] text-white uppercase sm:mt-10 sm:text-xl">
          {hero.subtitle}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-28 flex flex-col items-center px-4 sm:bottom-48">
        <p className="text-sm font-semibold tracking-[0.12em] text-faint uppercase">
          {hero.technologiesLabel}
        </p>
        {/* Riga che scorre verso sinistra e sfuma ai lati; si ferma al passaggio del mouse.
            Con movimento ridotto resta ferma e si scorre a mano. */}
        <div className="group mt-4 w-full max-w-4xl overflow-hidden mask-x-from-85% motion-reduce:overflow-x-auto motion-reduce:[scrollbar-width:none]">
          <div className="flex w-max motion-safe:animate-marquee motion-safe:group-hover:[animation-play-state:paused]">
            {[false, true].map((isCopy) => (
              <ul
                key={String(isCopy)}
                aria-hidden={isCopy || undefined}
                className={cn("flex shrink-0 gap-10 pr-10 sm:gap-14 sm:pr-14", isCopy && "motion-reduce:hidden")}
              >
                {hero.technologies.map((technology) => (
                  <li
                    key={technology}
                    className="font-heading text-xl font-semibold whitespace-nowrap text-[#6b6a70] sm:text-[1.6rem]"
                  >
                    {technology}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      {/* Indicatore di scorrimento, al posto dell'animazione Lottie del riferimento */}
      <a
        href="#expertise"
        className="absolute bottom-10 left-1/2 flex sm:bottom-15 h-10 w-7 -translate-x-1/2 justify-center rounded-b-full border-x-2 border-b-2 border-white/80"
      >
        <span className="mt-1 h-2.5 w-0.5 rounded-full bg-violet motion-safe:animate-scroll-hint" />
        <span className="sr-only">Vai alle competenze</span>
      </a>
    </Section>
  );
}
