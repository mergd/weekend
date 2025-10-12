import ProjectList from "@/components/ProjectList";
import CountdownTimer from "@/components/CountdownTimer";
import { getProjects, getNextProject } from "@/lib/projects";
import Box from "@/components/ascii/Box";

export default function Home() {
  const projects = getProjects();
  const nextProject = getNextProject();

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <header className="text-center md:text-right flex flex-col">
            <h1 className="text-lg font-bold mb-1 text-primary">
              WEEKEND PROJECTS
            </h1>
            <p className="text-xs text-muted-foreground">
              A new drop every weekend
            </p>
          </header>
          {nextProject && (
            <CountdownTimer
              targetDate={nextProject.shipDate}
              projectTitle={nextProject.title}
            />
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm text-primary"> ALL DROPS</h2>
            <span className="text-xs text-muted-foreground">
              {projects.length} projects
            </span>
          </div>
          <ProjectList projects={projects} />
        </div>

        <footer className="text-center text-xs text-muted-foreground pt-4">
          <p> Click any project for details</p>
        </footer>
      </div>
    </div>
  );
}
