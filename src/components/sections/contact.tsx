import { Mail } from "lucide-react";

import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Section } from "@/components/section";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="04 — Contatti"
      title="Lavoriamo insieme"
      className="bg-muted/40"
    >
      <Card className="py-10 sm:py-12">
        <CardContent className="flex flex-col items-start gap-6 sm:px-10">
          <p className="max-w-xl text-lg text-pretty text-muted-foreground">
            Stai cercando qualcuno per il tuo team o hai un progetto da
            propormi? Scrivimi, sarò felice di parlarne.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${site.email}`} className={cn(buttonVariants({ size: "lg" }))}>
              <Mail data-icon="inline-start" />
              {site.email}
            </a>
            {site.socials.linkedin && (
              <a
                href={site.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                <LinkedInIcon data-icon="inline-start" />
                LinkedIn
              </a>
            )}
            {site.socials.github && (
              <a
                href={site.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                <GitHubIcon data-icon="inline-start" />
                GitHub
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}
