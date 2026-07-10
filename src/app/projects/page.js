import { getGitHubProjects } from "@/lib/github";
import ProjectsPageContent from "@/components/ProjectsPageContent";

export default async function ProjectsPage() {
  const projects = await getGitHubProjects();

  return (
    <main className="min-h-screen bg-slate-950 px-6 pb-24 pt-32 text-white">
      <ProjectsPageContent projects={projects} />
    </main>
  );
}