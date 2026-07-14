"use client";

import { useLanguage } from "@/context/LanguageContext";
import { projects as caseStudies } from "@/data/projects";

export default function CaseStudies() {
  const { lang } = useLanguage();

  const visible = caseStudies.slice(0, 3);

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {visible.map((project) => (
        <article
          key={project.id}
          className="rounded-[28px] border border-white/10 bg-slate-900/80 p-7 shadow-lg shadow-slate-950/20"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300/90">
            {project.category || "Case Study"}
          </p>

          <h3 className="mb-4 text-2xl font-black text-white">
            {project.title}
          </h3>

          <p className="mb-6 text-sm leading-7 text-slate-300">
            {project.summary}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags?.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex font-semibold text-cyan-300 transition hover:text-white"
            >
              {lang === "en" ? "View project →" : "Projeyi görüntüle →"}
            </a>
          )}
        </article>
      ))}
    </section>
  );
}
