export interface Project {
  title: string;
  shipDate: string;
  link: string;
  description: string;
  tech: string[];
}

export function getProjects(): Project[] {
  const projectsData = require('../data/projects.json');
  return projectsData;
}

export function getNextProject(): Project | null {
  const projects = getProjects();
  const now = new Date();
  
  const futureProjects = projects.filter(p => new Date(p.shipDate) > now);
  
  if (futureProjects.length === 0) return null;
  
  return futureProjects.reduce((earliest, current) => {
    return new Date(current.shipDate) < new Date(earliest.shipDate) ? current : earliest;
  });
}

export function getCurrentProjectIndex(): number {
  const projects = getProjects();
  const now = new Date();
  
  const currentIndex = projects.findIndex(p => new Date(p.shipDate) > now);
  
  if (currentIndex === -1) return projects.length - 1;
  if (currentIndex === 0) return 0;
  
  return currentIndex - 1;
}


