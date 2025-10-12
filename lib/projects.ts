export interface Project {
  title: string;
  shipDate: string;
  link: string;
  description: string;
  tech: string[];
  hidden: boolean;
}

export function getProjects(): Project[] {
  const projectsData = require("../data/projects.json");
  return projectsData;
}

export function getVisibleProjects(): Project[] {
  const projects = getProjects();
  return projects.filter((p) => !p.hidden);
}

export function getNextProject(): Project | null {
  const projects = getProjects();
  const now = new Date();

  const futureProjects = projects.filter((p) => new Date(p.shipDate) > now);

  if (futureProjects.length === 0) return null;

  return futureProjects.reduce((earliest, current) => {
    return new Date(current.shipDate) < new Date(earliest.shipDate)
      ? current
      : earliest;
  });
}

export function getNextShipDate(): string | null {
  const nextProject = getNextProject();
  return nextProject ? nextProject.shipDate : null;
}

export function getCurrentProjectIndex(): number {
  const projects = getProjects();
  const now = new Date();

  const currentIndex = projects.findIndex((p) => new Date(p.shipDate) > now);

  if (currentIndex === -1) return projects.length - 1;
  if (currentIndex === 0) return 0;

  return currentIndex - 1;
}
