"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProjectFilters from "@/components/ProjectFilters";
import { useLanguage } from "@/context/LanguageContext";

export default function ProjectsGrid({ projects = [] }) {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      projects.map((project) => project.category).filter(Boolean)
    );
    return ["All", ...Array.from(uniqueCategories)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("tr");

    return projects.filter((project) => {
      const matchesCategory =
        activeCategory === "All" || project.category === activeCategory;

      const searchableText = [
        project.title,
        project.summary,
        project.description,
        project.category,
        project.language,
        ...(project.tags || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("tr");

      return !query || searchableText.includes(query);
    });
  }, [projects, activeCategory, searchQuery]);

  return (
    <>
      <div className="mb-8 rounded-3xl border border-white/10 bg-slate-900/70 p-4 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/80 px-5 py-4">
          <span className="text-lg text-cyan-300">⌕</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={
              lang === "en"
                ? "Search projects, technologies or categories..."
                : "Proje, teknoloji veya kategori ara..."
            }
            aria-label={lang === "en" ? "Search projects" : "Projelerde ara"}
            className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="rounded-full px-3 py-1 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              {lang === "en" ? "Clear" : "Temizle"}
            </button>
          )}
        </div>
      </div>

      <ProjectFilters
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      <p className="mb-6 text-sm text-slate-400">
        {lang === "en"
          ? `${filteredProjects.length} project${filteredProjects.length === 1 ? "" : "s"} found`
          : `${filteredProjects.length} proje bulundu`}
      </p>

      {filteredProjects.length === 0 ? (
        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-10 text-center">
          <h2 className="text-2xl font-black text-white">
            {lang === "en" ? "No matching projects" : "Eşleşen proje bulunamadı"}
          </h2>
          <p className="mt-3 text-slate-400">
            {lang === "en"
              ? "Try a different keyword or category."
              : "Farklı bir anahtar kelime veya kategori deneyin."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
            }}
            className="mt-6 rounded-full border border-cyan-300/40 px-5 py-3 font-bold text-cyan-300 transition hover:bg-cyan-300/10"
          >
            {lang === "en" ? "Reset filters" : "Filtreleri sıfırla"}
          </button>
        </div>
      ) : (
        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_20px_60px_rgba(14,165,233,0.12)]"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="rounded-full border border-white/10 bg-slate-800/80 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                  {project.category || "Project"}
                </span>
                {project.featured && (
                  <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                    Featured
                  </span>
                )}
              </div>

              <h2 className="mb-4 text-2xl font-semibold text-white">{project.title}</h2>

              <p className="mb-6 flex-1 text-sm leading-7 text-slate-300">
                {project.summary}
              </p>

              <div className="mb-5 flex flex-wrap gap-2">
                {project.language && (
                  <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300">
                    {project.language}
                  </span>
                )}
                {project.tags?.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mb-6 grid gap-3 text-sm text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Stars</span>
                  <span>{project.stars || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Forks</span>
                  <span>{project.forks || 0}</span>
                </div>
              </div>

              <div className="mt-auto flex flex-wrap gap-3">
                <Link
                  href={`/projects/${project.slug}`}
                  className="font-semibold text-cyan-300 transition hover:text-white"
                >
                  {lang === "en" ? "Read Summary →" : "Özeti Oku →"}
                </Link>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-slate-300 transition hover:text-cyan-200"
                >
                  GitHub →
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}