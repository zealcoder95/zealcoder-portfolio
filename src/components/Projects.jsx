import { getCaseStudies } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";
import SectionHeader from "@/components/SectionHeader";

export default function Projects({ t, lang }) {
  const projects = getCaseStudies();
  return (
    <section id="projects" className="bg-slate-950 px-6 py-24 text-white">
      <div className="zc-container">
        <SectionHeader
          kicker={t.projects.kicker}
          title={t.projects.title}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              lang={lang}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
