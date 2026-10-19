import { ArrowUpRight } from "lucide-react";

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
import { projects } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="02 — Progetti"
      title="Lavori selezionati"
      className="bg-muted/40"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.title} className="transition-shadow hover:shadow-md">
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
      </div>
    </Section>
  );
}
