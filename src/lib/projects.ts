import { projects, type Project, type ProjectDetails } from "@/lib/site";

export type ProjectWithDetails = Project & { details: ProjectDetails };

export function hasDetails(project: Project): project is ProjectWithDetails {
  return Boolean(project.details) && !project.placeholder;
}

export function projectPath(project: ProjectWithDetails) {
  return `/progetti/${project.id}`;
}

// Indirizzo della pagina di dettaglio; i progetti senza contenuti non ne hanno una
export function projectHref(project: Project) {
  return hasDetails(project) ? projectPath(project) : undefined;
}

export const projectsWithDetails = projects.filter(hasDetails);

export function getProject(id: string) {
  return projectsWithDetails.find((project) => project.id === id);
}

// Progetto precedente e successivo nell'ordine di site.ts, a giro (dopo l'ultimo torna il primo).
// Con meno di due progetti non c'è niente da proporre.
export function getAdjacentProjects(id: string) {
  const count = projectsWithDetails.length;
  const index = projectsWithDetails.findIndex((project) => project.id === id);
  if (count < 2 || index === -1) return undefined;
  return {
    previous: projectsWithDetails[(index - 1 + count) % count],
    next: projectsWithDetails[(index + 1) % count],
  };
}
