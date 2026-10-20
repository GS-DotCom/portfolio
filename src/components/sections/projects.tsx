import { ArrowUpRight, Hammer } from "lucide-react";

import { GitHubIcon } from "@/components/icons";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { projects, projectsSection } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Projects() {
  // Con l'elenco vuoto il segnaposto resta comunque, per non lasciare una griglia vuota
  const showComingSoon = projectsSection.showComingSoon || projects.length === 0;

  return (
    <Section
      id="projects"
      eyebrow="02 — Progetti"
      title={projectsSection.title}
      className="bg-muted/40"
    >
      <p className="-mt-4 mb-10 max-w-2xl leading-7 text-muted-foreground">
        {projectsSection.intro}
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.title} className="card-float">
            <CardHeader>
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <CardDescription className="leading-6">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <ul className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li key={tag}>
                    <Badge variant="outline">{tag}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
            {(project.href || project.repo) && (
              <CardFooter className="gap-2">
                {project.href && (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    Demo
                    <ArrowUpRight data-icon="inline-end" />
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                  >
                    <GitHubIcon data-icon="inline-start" />
                    Codice
                  </a>
                )}
              </CardFooter>
            )}
          </Card>
        ))}
        {showComingSoon && (
          <Card className="min-h-48 justify-center border-2 border-dashed border-border bg-transparent text-center ring-0">
            <CardHeader className="justify-items-center gap-2">
              <Hammer aria-hidden className="mb-2 size-6 text-muted-foreground" />
              <CardTitle className="text-lg">{projectsSection.comingSoon.title}</CardTitle>
              <CardDescription className="max-w-xs leading-6">
                {projectsSection.comingSoon.description}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </Section>
  );
}
