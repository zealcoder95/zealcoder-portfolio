"use client";

import { useLanguage } from "@/context/LanguageContext";
import ProjectsGrid from "@/components/ProjectsGrid";
import CaseStudies from "@/components/CaseStudies";
import { getCaseStudies } from "@/content/projects";

export default function ProjectsPageContent({ projects = [] }) {
  const { lang } = useLanguage();
  const caseStudies = getCaseStudies();

  const featuredGithubUrls = new Set(
    caseStudies.map((project) => project.links?.github).filter(Boolean)
  );

  const archiveProjects = projects.filter(
    (project) => !featuredGithubUrls.has(project.githubUrl)
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.4em] text-cyan-300/90">
        {lang === "en" ? "Selected work" : "Seçilmiş çalışmalar"}
      </p>

      <h1 className="mb-6 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
        {lang === "en"
          ? "Case studies with a clear point of view."
          : "Net bir bakış açısına sahip vaka çalışmaları."}
      </h1>

      <p className="mb-14 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
        {lang === "en"
          ? "Each featured project connects the question, analytical approach and result. The full GitHub portfolio remains below."
          : "Her öne çıkan proje; soruyu, analitik yaklaşımı ve sonucu bir araya getirir. Tüm GitHub portfolyosu aşağıda yer alır."}
      </p>

      <CaseStudies />

      {archiveProjects.length > 0 && (
        <section className="mt-20 rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-lg shadow-slate-950/30">
          <div className="mb-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-purple-300/90">
              {lang === "en" ? "GitHub archive" : "GitHub arşivi"}
            </p>
            <h2 className="text-3xl font-black text-white sm:text-4xl">
              {lang === "en"
                ? "More experiments and builds."
                : "Diğer deneyler ve çalışmalar."}
            </h2>
          </div>

          <ProjectsGrid projects={archiveProjects} />
        </section>
      )}
    </div>
  );
}
