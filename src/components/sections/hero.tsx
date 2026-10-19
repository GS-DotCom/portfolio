import { ArrowRight, MapPin } from "lucide-react";

import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_top,black_30%,transparent_70%)] bg-size-[48px_48px]"
      />
      <div className="mx-auto flex max-w-5xl flex-col items-start px-4 pt-24 pb-20 sm:px-6 sm:pt-32 sm:pb-28">
        <div className="flex flex-wrap items-center gap-2">
          {site.available && (
            <Badge variant="outline" className="gap-1.5 bg-background">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Disponibile per nuove opportunità
            </Badge>
          )}
          <Badge variant="outline" className="bg-background">
            <MapPin data-icon="inline-start" />
            {site.location}
          </Badge>
        </div>

        <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Ciao, sono {site.name}.
          <span className="block text-muted-foreground">{site.role}.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">
          {site.description}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a href="#projects" className={cn(buttonVariants({ size: "lg" }))}>
            Vedi i progetti
            <ArrowRight data-icon="inline-end" />
          </a>
          <a href="#contact" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Contattami
          </a>
          <div className="ml-1 flex items-center gap-1">
            {site.socials.github && (
              <a
                href={site.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }))}
              >
                <GitHubIcon />
                <span className="sr-only">GitHub</span>
              </a>
            )}
            {site.socials.linkedin && (
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }))}
              >
                <LinkedInIcon />
                <span className="sr-only">LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
