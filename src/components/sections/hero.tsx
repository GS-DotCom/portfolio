import { HeroSceneLoader } from "@/components/hero-scene-loader";
import { Section } from "@/components/section";
import { hero, site } from "@/lib/site";

export function Hero() {
  return (
    <Section
      id="home"
      className="relative isolate flex min-h-[max(100svh,720px)] flex-col overflow-hidden bg-[linear-gradient(to_bottom,var(--hero)_0%,var(--hero)_55%,var(--background)_100%)]"
    >
      <div className="absolute inset-0 -z-10">
        <HeroSceneLoader />
        {/* Foschia calda all'orizzonte e passaggio morbido verso il resto della pagina */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_30%_at_50%_82%,rgb(255_108_42/0.10),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-b from-transparent to-background" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pt-20 pb-48 text-center">
        <h1
          id="home-title"
          className="font-heading text-[16vw] leading-[0.95] font-bold tracking-[0.03em] text-white uppercase [text-shadow:0_6px_40px_rgb(0_0_0/0.35)] sm:text-[9.2vw] sm:leading-none sm:whitespace-nowrap 2xl:text-[10.5rem]"
        >
          {site.name}
        </h1>
        <p className="mt-6 font-mono text-sm font-medium tracking-[0.2em] text-white uppercase sm:mt-10 sm:text-xl">
          {hero.subtitle}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-28 flex flex-col items-center px-4 sm:bottom-48">
        <p className="text-sm font-semibold tracking-[0.12em] text-faint uppercase">
          {hero.technologiesLabel}
        </p>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 sm:gap-x-14">
          {hero.technologies.map((technology) => (
            <li key={technology} className="font-heading text-xl font-semibold text-[#6b6a70] sm:text-[1.6rem]">
              {technology}
            </li>
          ))}
        </ul>
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
