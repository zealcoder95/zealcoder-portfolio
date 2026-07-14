"use client";

import { useLanguage } from "@/context/LanguageContext";
import ProjectsGrid from "@/components/ProjectsGrid";
import CaseStudies from "@/components/CaseStudies";

export default function ProjectsPageContent({ projects }) {
  const { lang } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl">
      <p className="mb-3 text-sm font-black uppercase tracking-[0.4em] text-cyan-300">
        {lang === "en" ? "Selected work" : "Seçilmiş çalışmalar"}
      </p>

      <h1 className="mb-6 text-4xl font-black md:text-6xl">
        {lang === "en"
          ? "Case studies with a clear point of view."
          : "Net bir bakış açısına sahip vaka çalışmaları."}
      </h1>

      <p className="mb-12 max-w-3xl leading-8 text-slate-300">
        {lang === "en"
          ? "Each featured project connects the question, analytical approach and result. The full GitHub portfolio remains below."
          : "Her öne çıkan proje; soruyu, analitik yaklaşımı ve sonucu bir araya getirir. Tüm GitHub portfolyosu aşağıda yer alır."}
      </p>

      <CaseStudies />

      <div className="my-20 border-t border-white/10 pt-16">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.4em] text-purple-300">
          {lang === "en" ? "GitHub archive" : "GitHub arşivi"}
        </p>
        <h2 className="mb-5 text-3xl font-black md:text-5xl">
          {lang === "en" ? "More experiments and builds." : "Diğer deneyler ve çalışmalar."}
        </h2>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-[30px] border border-white/10 bg-white/5 p-8">
          <p className="text-slate-300">
            {lang === "en"
              ? "No public portfolio projects could be loaded."
              : "Herkese açık portfolyo projesi yüklenemedi."}
          </p>
        </div>
      ) : (
        <ProjectsGrid projects={projects} />
      )}
    </div>
  );
}
