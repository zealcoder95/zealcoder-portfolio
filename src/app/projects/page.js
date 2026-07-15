import { getProjects } from "@/content";
import ProjectsPageContent from "@/components/ProjectsPageContent";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-slate-950 px-6 pb-24 pt-32 text-white">
      <ProjectsPageContent projects={projects} />
    </main>
  );
}
