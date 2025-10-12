"use client";

import { useState } from "react";
import Overlay from "./ascii/Overlay";
import { Project } from "@/lib/projects";
import { getRelativeTime, formatShortDate } from "@/lib/dateUtils";
import { SkeletonLine } from "./ascii/Skeleton";

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const isPast = (shipDate: string) => new Date(shipDate) < new Date();

  return (
    <>
      <div className="space-y-3">
        {projects.map((project, index) => {
          const shipped = isPast(project.shipDate);
          const isHidden = project.hidden;
          const isFuture = !shipped;

          if (isHidden) {
            return (
              <div
                key={project.title}
                className="border-l-2 border-border pl-3 py-2 w-full text-left opacity-50 pointer-events-none"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="text-sm">
                        <SkeletonLine length={18} animated={true} />
                      </div>
                    </div>
                    <p className="text-xs">
                      <SkeletonLine length={24} animated={true} />
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs text-muted-foreground"></span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {isFuture
                        ? getRelativeTime(project.shipDate)
                        : formatShortDate(project.shipDate)}
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <button
              key={project.title}
              onClick={() => setSelectedProject(project)}
              className="border-l-2 border-border pl-3 py-2 hover:border-foreground hover:bg-accent transition-all cursor-pointer group w-full text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-xs ${
                      shipped ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {shipped ? "" : ""}
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {isFuture
                      ? getRelativeTime(project.shipDate)
                      : formatShortDate(project.shipDate)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedProject && !selectedProject.hidden && (
        <Overlay
          onClose={() => setSelectedProject(null)}
          title={selectedProject.title}
          accentColor="purple"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-xs text-muted-foreground mb-2">
                {" "}
                DESCRIPTION
              </h3>
              <p className="text-sm text-foreground">
                {selectedProject.description}
              </p>
            </div>

            {selectedProject.tech.length > 0 && (
              <div>
                <h3 className="text-xs text-muted-foreground mb-2">
                  {" "}
                  TECH STACK
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs text-muted-foreground mb-2"> SHIP DATE</h3>
              <p className="text-sm text-foreground">
                {new Date(selectedProject.shipDate).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    timeZoneName: "short",
                  }
                )}
              </p>
            </div>

            <div>
              <h3 className="text-xs text-muted-foreground mb-2"> STATUS</h3>
              <p className="text-sm text-foreground">
                {isPast(selectedProject.shipDate) ? " SHIPPED" : " UPCOMING"}
              </p>
            </div>

            {isPast(selectedProject.shipDate) && selectedProject.link && (
              <div>
                <h3 className="text-xs text-muted-foreground mb-2"> LINK</h3>
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary text-sm transition-colors underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                >
                  {selectedProject.link}
                </a>
              </div>
            )}
          </div>
        </Overlay>
      )}
    </>
  );
}
