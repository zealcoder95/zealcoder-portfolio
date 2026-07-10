"use client";

import { useLanguage } from "@/context/LanguageContext";
import ProjectsGrid from "@/components/ProjectsGrid";

export default function ProjectsPageContent({ projects }) {
  const { lang } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl">
      <p className="mb-3 text-sm font-black uppercase tracking-[0.4em] text-cyan-300">
        {lang === "en" ? "GitHub Project Engine" : "GitHub Proje Sistemi"}
      </p>

      <h1 className="mb-6 text-4xl font-black md:text-6xl">
        {lang === "en"
          ? "Projects loaded automatically."
          : "Projeler otomatik olarak yükleniyor."}
      </h1>

      <p className="mb-12 max-w-3xl leading-8 text-slate-300">
        {lang === "en"
          ? "Repository information and summaries are generated from GitHub descriptions and README files. Visit GitHub or Kaggle for full technical details."
          : "Proje bilgileri ve özetleri GitHub açıklamaları ile README dosyalarından otomatik oluşturulur. Tüm teknik ayrıntılar için GitHub veya Kaggle bağlantılarını kullanabilirsiniz."}
      </p>

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