import { projects, type Project, type ProjectDetails } from "@/lib/site";

export type ProjectWithDetails = Project & { details: ProjectDetails };

export function hasDetails(project: Project): project is ProjectWithDetails {
  return Boolean(project.details) && !project.placeholder;
}

// Indirizzo della pagina di dettaglio; i progetti senza contenuti non ne hanno una
export function projectHref(project: Project) {
  return hasDetails(project) ? `/progetti/${project.id}` : undefined;
}

export const projectsWithDetails = projects.filter(hasDetails);

export function getProject(id: string) {
  return projectsWithDetails.find((project) => project.id === id);
}
