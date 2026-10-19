import { Mail } from "lucide-react";

import { CopyEmailButton } from "@/components/copy-email-button";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Section } from "@/components/section";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { contact, site } from "@/lib/site";
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
        <CardContent className="flex flex-col items-start gap-8 sm:px-10">
          <p className="max-w-xl text-lg text-pretty text-muted-foreground">{contact.intro}</p>

          <div className="grid gap-1.5">
            <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
              {contact.emailLabel}
            </p>
            {/* L'indirizzo si seleziona con un clic, utile se la copia automatica non è disponibile */}
            <p className="text-xl font-medium tracking-tight wrap-anywhere select-all sm:text-3xl">
              {site.email}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent(contact.emailSubject)}`}
              className={cn(buttonVariants({ size: "lg" }))}
            >
              <Mail data-icon="inline-start" />
              Scrivimi
            </a>
            <CopyEmailButton email={site.email} />
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

          {site.available && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <span aria-hidden="true" className="size-2 rounded-full bg-emerald-500" />
              Disponibile per nuove opportunità.
            </p>
          )}
        </CardContent>
      </Card>
    </Section>
  );
}
