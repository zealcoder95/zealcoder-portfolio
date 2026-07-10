"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProjectFilters from "@/components/ProjectFilters";
import { useLanguage } from "@/context/LanguageContext";

export default function ProjectsGrid({ projects }) {
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
        activeCategory === "All" ||
        project.category === activeCategory;

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

      const matchesSearch =
        !query || searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  return (
    <>
      <div className="mb-8 rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 focus-within:border-cyan-300/50">
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
            aria-label={
              lang === "en" ? "Search projects" : "Projelerde ara"
            }
            className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
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
          ? `${filteredProjects.length} project${
              filteredProjects.length === 1 ? "" : "s"
            } found`
          : `${filteredProjects.length} proje bulundu`}
      </p>

      {filteredProjects.length === 0 ? (
        <div className="rounded-[30px] border border-white/10 bg-white/5 p-10 text-center">
          <h2 className="text-2xl font-black text-white">
            {lang === "en"
              ? "No matching projects"
              : "Eşleşen proje bulunamadı"}
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
            {lang === "en"
              ? "Reset filters"
              : "Filtreleri sıfırla"}
          </button>
        </div>
      ) : (
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white/5 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-[0_0_35px_rgba(34,211,238,0.14)]"
            >
              <div className="relative h-52 overflow-hidden border-b border-white/10 bg-slate-900">
                {project.cover ? (
                  <img
                    src={project.cover}
                    alt={`${project.title} project cover`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.32),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.25),transparent_40%)]">
                    <div className="text-center">
                      <p className="text-5xl font-black text-white/10">
                        {"</>"}
                      </p>

                      <p className="mt-3 text-xs font-bold uppercase tracking-[0.3em] text-cyan-300/70">
                        ZealCoder Project
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {project.featured && (
                  <span className="absolute right-4 top-4 rounded-full border border-cyan-300/30 bg-slate-950/80 px-3 py-1 text-xs font-bold text-cyan-300 backdrop-blur-xl">
                    Featured
                  </span>
                )}
              </div>

              <div className="relative flex h-full flex-col p-7">
                <span className="mb-5 w-fit rounded-full border border-purple-300/20 bg-purple-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-purple-300">
                  {project.category}
                </span>

                <h2 className="mb-4 text-2xl font-black capitalize">
                  {project.title}
                </h2>

                <p className="mb-6 flex-1 text-sm leading-7 text-slate-300">
                  {project.summary}
                </p>

                <div className="mb-6 flex flex-wrap gap-2">
                  {project.language && (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300">
                      {project.language}
                    </span>
                  )}

                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mb-6 flex flex-wrap gap-4 text-sm text-slate-400">
                  <span>★ {project.stars}</span>
                  <span>Forks: {project.forks}</span>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-3">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="font-bold text-white transition hover:text-cyan-300"
                  >
                    {lang === "en"
                      ? "Read Summary →"
                      : "Özeti Oku →"}
                  </Link>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-cyan-300 transition hover:text-white"
                  >
                    GitHub →
                  </a>

                  {project.kaggleUrl && (
                    <a
                      href={project.kaggleUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-purple-300 transition hover:text-white"
                    >
                      Kaggle →
                    </a>
                  )}

                  {project.homepage && (
                    <a
                      href={project.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-emerald-300 transition hover:text-white"
                    >
                      {lang === "en"
                        ? "Live Demo →"
                        : "Canlı Demo →"}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}