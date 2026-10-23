import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProjectHighlight } from "@/components/project-highlight";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { getAdjacentProjects, getProject, projectPath, projectsWithDetails } from "@/lib/projects";
import { projectPage, site } from "@/lib/site";

// Una pagina per ogni progetto con contenuti, generata in fase di build
export function generateStaticParams() {
  return projectsWithDetails.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: PageProps<"/progetti/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${site.name}`,
    description: project.details.description,
  };
}

// Pagina di dettaglio sul modello di tamalsen.dev/project/…: intestazione, descrizione con
// cliente e tecnologie, poi le schermate una sotto l'altra.
// Header, pulsante indietro e footer non dipendono dal progetto e formano la "App Shell"
// condivisa; quello che dipende da params sta dentro Suspense, come chiede il Partial Prefetching.
export default function ProjectPage({ params }: PageProps<"/progetti/[slug]">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 pt-28 pb-24 sm:pt-40 sm:pb-32">
        <div className="mx-auto max-w-[1146px] px-4 sm:px-6">
          <Link
            href="/#projects"
            className="group/back inline-flex items-center gap-3 font-mono text-sm font-semibold text-muted-foreground transition-colors hover:text-cyan"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-card ring-1 ring-white/10 transition-colors group-hover/back:bg-cyan group-hover/back:text-background">
              <ArrowLeft aria-hidden="true" className="size-4" />
            </span>
            {projectPage.backLabel}
          </Link>

          <Suspense fallback={<div aria-hidden="true" className="min-h-screen" />}>
            <ProjectContent params={params} />
          </Suspense>
        </div>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1146px] flex-col gap-1 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
          <p>{projectPage.footerCredits}</p>
          <p>{projectPage.footerRights}</p>
        </div>
      </footer>
    </>
  );
}

async function ProjectContent({ params }: Pick<PageProps<"/progetti/[slug]">, "params">) {
  const { slug } = await params;
  const project = getProject(slug);
  // Con Cache Components non esiste dynamicParams: gli slug sconosciuti finiscono qui
  if (!project) notFound();

  const { details } = project;

  return (
    <>
      <Reveal className="mt-14 sm:mt-20">
        <p className="font-mono text-sm font-semibold tracking-[0.12em] text-cyan uppercase">{project.category}</p>
        <h1 className="mt-4 font-heading text-5xl leading-[1.05] font-semibold tracking-tight sm:text-7xl">
          {project.title}
        </h1>
      </Reveal>

      <nav aria-label={projectPage.breadcrumbLabel} className="mt-10 sm:mt-14">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-muted-foreground">
          <li>
            <Link href="/" className="transition-colors hover:text-cyan">
              {projectPage.breadcrumbHome}
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <ChevronRight aria-hidden="true" className="size-3.5" />
            <Link href="/#projects" className="transition-colors hover:text-cyan">
              {projectPage.breadcrumbProjects}
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <ChevronRight aria-hidden="true" className="size-3.5" />
            <span aria-current="page" className="text-foreground">
              {project.title}
            </span>
          </li>
        </ol>
      </nav>

      <Reveal className="mt-16 grid gap-12 sm:mt-24 lg:grid-cols-12 lg:gap-6">
        <p className="text-[1.05rem] leading-relaxed text-[#c7c7c9] lg:col-span-5">{details.description}</p>

        <div className="lg:col-span-6 lg:col-start-7">
          <dl className="grid grid-cols-2 gap-8">
            <div className="border-t border-white/15 pt-4">
              <dt className="font-heading font-semibold">{projectPage.clientLabel}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{details.client}</dd>
            </div>
            <div className="border-t border-white/15 pt-4">
              <dt className="font-heading font-semibold">{projectPage.technologiesLabel}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{details.technologies.join(", ")}</dd>
            </div>
          </dl>
          {details.url && (
            <a
              href={details.url}
              target="_blank"
              rel="noreferrer"
              className="group/open mt-10 inline-flex items-center gap-2 font-heading font-semibold transition-colors hover:text-cyan"
            >
              {projectPage.openLabel}
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover/open:translate-x-1"
              />
            </a>
          )}
        </div>
      </Reveal>

      {details.highlight && <ProjectHighlight highlight={details.highlight} />}

      <div className="mt-20 space-y-4 sm:mt-28 sm:space-y-6">
        {details.gallery.map((image, index) => (
          <Reveal key={image.src}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1146px) 1098px, 100vw"
              priority={index === 0}
              className="h-auto w-full rounded-sm"
            />
          </Reveal>
        ))}
      </div>

      <AdjacentProjects id={project.id} />
    </>
  );
}

const roundButtonClass =
  "flex size-11 items-center justify-center rounded-full bg-card ring-1 ring-white/10 transition-colors hover:bg-cyan hover:text-background";

// Barra "Progetto successivo", al posto del riquadro fisso "Next Project" del riferimento:
// anteprima e titolo del successivo a sinistra, frecce per precedente e successivo a destra
function AdjacentProjects({ id }: { id: string }) {
  const adjacent = getAdjacentProjects(id);
  if (!adjacent) return null;
  const { previous, next } = adjacent;

  return (
    <nav
      aria-label={projectPage.adjacentLabel}
      className="mt-24 flex flex-col gap-8 border-t border-white/10 pt-12 sm:mt-32 sm:flex-row sm:items-center sm:justify-between sm:pt-16"
    >
      <Link href={projectPath(next)} className="group/next flex items-center gap-6">
        {next.image && (
          <span className="relative hidden aspect-[16/10] w-40 shrink-0 overflow-hidden rounded-sm bg-card sm:block">
            <Image
              src={next.image}
              alt=""
              fill
              sizes="160px"
              className="object-cover object-top transition-transform duration-500 group-hover/next:scale-105"
            />
          </span>
        )}
        <span>
          <span className="block font-mono text-sm font-semibold tracking-[0.12em] text-cyan uppercase">
            {projectPage.nextLabel}
          </span>
          <span className="mt-2 block font-heading text-3xl font-semibold tracking-tight transition-colors group-hover/next:text-cyan sm:text-4xl">
            {next.title}
          </span>
        </span>
      </Link>

      <div className="flex gap-3">
        <Link
          href={projectPath(previous)}
          aria-label={`${projectPage.previousButtonLabel} ${previous.title}`}
          className={roundButtonClass}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </Link>
        <Link
          href={projectPath(next)}
          aria-label={`${projectPage.nextButtonLabel} ${next.title}`}
          className={roundButtonClass}
        >
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </nav>
  );
}
