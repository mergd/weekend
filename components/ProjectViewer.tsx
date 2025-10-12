"use client";

import { useState, useEffect } from "react";
import Box from "./ascii/Box";
import Button from "./ascii/Button";
import Overlay from "./ascii/Overlay";
import { Project } from "@/lib/projects";

interface ProjectViewerProps {
  projects: Project[];
  initialIndex: number;
}

export default function ProjectViewer({
  projects,
  initialIndex,
}: ProjectViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showDetails, setShowDetails] = useState(false);
  const currentProject = projects[currentIndex];

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showDetails) return;

      if (e.key === "ArrowLeft" || e.key === "h") {
        setCurrentIndex(
          (prev) => (prev - 1 + projects.length) % projects.length
        );
      } else if (e.key === "ArrowRight" || e.key === "l") {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      } else if (e.key === "d" || e.key === "Enter") {
        setShowDetails(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showDetails, projects.length]);

  const isPast = new Date(currentProject.shipDate) < new Date();

  return (
    <>
      <Box variant="rounded" className="w-full max-w-3xl" accentColor="purple">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              {currentIndex + 1} / {projects.length}
            </div>
            <div>{isPast ? " SHIPPED" : " UPCOMING"}</div>
          </div>

          <div>
            <h2 className="text-lg font-normal mb-2 text-primary">
              {currentProject.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentProject.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentProject.tech.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs border border-border"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="text-xs text-muted-foreground">
            {new Date(currentProject.shipDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <div className="flex gap-2 pt-3">
            <Button onClick={goPrev} variant="secondary" icon="">
              PREV
            </Button>
            <Button onClick={goNext} variant="secondary" icon="">
              NEXT
            </Button>
            <Button
              onClick={() => setShowDetails(true)}
              variant="primary"
              icon=""
            >
              DETAILS
            </Button>
          </div>
        </div>
      </Box>

      {showDetails && (
        <Overlay
          onClose={() => setShowDetails(false)}
          title={currentProject.title}
          accentColor="purple"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-xs text-muted-foreground mb-2">
                {" "}
                DESCRIPTION
              </h3>
              <p className="text-sm text-foreground">
                {currentProject.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs text-muted-foreground mb-2">
                {" "}
                TECH STACK
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentProject.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs text-muted-foreground mb-2"> SHIP DATE</h3>
              <p className="text-sm text-foreground">
                {new Date(currentProject.shipDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  timeZoneName: "short",
                })}
              </p>
            </div>

            <div>
              <h3 className="text-xs text-muted-foreground mb-2"> STATUS</h3>
              <p className="text-sm text-foreground">
                {isPast ? " SHIPPED" : " UPCOMING"}
              </p>
            </div>

            {isPast && (
              <div>
                <h3 className="text-xs text-muted-foreground mb-2"> LINK</h3>
                <a
                  href={currentProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary text-sm transition-colors underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                >
                  {currentProject.link}
                </a>
              </div>
            )}
          </div>
        </Overlay>
      )}
    </>
  );
}
