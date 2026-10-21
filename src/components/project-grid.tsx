"use client";

import { useState } from "react";

import { ProjectCover } from "@/components/project-cover";
import { projectsSection, type Project, type ProjectCategory } from "@/lib/site";
import { cn } from "@/lib/utils";

type Filter = ProjectCategory | "all";

const pad = (value: number) => String(value).padStart(2, "0");

// Filtri e griglia a mosaico. Da lg la griglia ha righe da 12px: una scheda piccola ne occupa 36
// (immagine di 256px, fascia di 140px e 36px di spazio), una grande 52 su due colonne.
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? projects : projects.filter((project) => project.category === filter);

  const filters: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: projectsSection.allLabel, count: projects.length },
    ...projectsSection.categories.map((category) => ({
      value: category,
      label: category,
      count: projects.filter((project) => project.category === category).length,
    })),
  ];

  return (
    <>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-2 text-[0.95rem] font-medium">
        <span className="mr-3 text-[#c7c7c9]">{projectsSection.filterLabel}</span>
        {filters.map((item, index) => (
          <span key={item.value} className="flex items-baseline gap-2">
            <button
              type="button"
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
              className="relative text-[#c7c7c9] transition-colors hover:text-white aria-pressed:text-cyan"
            >
              {item.label}
              <sup className="ml-0.5 text-[0.6rem]">{pad(item.count)}</sup>
            </button>
            {index < filters.length - 1 && (
              <span aria-hidden="true" className="text-[#c7c7c9]">
                /
              </span>
            )}
          </span>
        ))}
      </div>

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-flow-row-dense lg:grid-cols-3 lg:auto-rows-[12px] lg:gap-x-9 lg:gap-y-0">
        {visible.map((project) => {
          const large = project.size === "large";
          return (
            <li
              key={project.id}
              id={`progetto-${project.id}`}
              className={cn(
                "scroll-mt-28 lg:pb-9",
                large ? "sm:col-span-2 lg:row-span-52" : "lg:row-span-36"
              )}
            >
              <article className="group card-float flex h-full flex-col overflow-hidden rounded-sm bg-card">
                <div
                  className={cn(
                    "relative overflow-hidden lg:h-auto lg:flex-1",
                    large ? "h-72 sm:h-96" : "h-60"
                  )}
                >
                  <ProjectCover project={project} index={projects.indexOf(project)} />
                </div>
                <div className="flex h-35 shrink-0 flex-col justify-center px-8 sm:px-11">
                  <h3 className="truncate font-heading text-xl font-semibold">
                    {project.href ? (
                      <a href={project.href} className="after:absolute after:inset-0">
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    {project.placeholder ? `${project.category} · in arrivo` : project.category}
                  </p>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </>
  );
}
