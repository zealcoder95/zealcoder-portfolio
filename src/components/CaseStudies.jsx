"use client";

import Link from "next/link";
import { projects as caseStudies } from "@/data/projects";
import { useLanguage } from "@/context/LanguageContext";

const accents = ["from-cyan-400/20 to-blue-600/10", "from-fuchsia-400/20 to-purple-600/10", "from-emerald-400/20 to-cyan-600/10"];

export default function CaseStudies({ compact = false }) {
  const { lang } = useLanguage();
  const studies = compact ? caseStudies.slice(0, 4) : caseStudies;

  return (
    <div className={`grid gap-6 ${compact ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2 xl:grid-cols-4"}`}>
      {studies.map((project, index) => (
        <article key={project.id} className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-cyan-300/40 hover:shadow-[0_0_42px_rgba(34,211,238,0.14)]">
          <div className={`absolute inset-x-0 top-0 h-36 bg-linear-to-br ${accents[index % accents.length]}`} />
          <div className="relative mb-14 flex items-center justify-between">
            <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200 backdrop-blur">
              {project.category[lang]}
            </span>
            <span className="text-3xl text-white/70">0{index + 1}</span>
          </div>

          <h2 className="relative mb-4 text-2xl font-black leading-tight text-white">{project.title[lang]}</h2>
          <p className="relative mb-6 flex-1 text-sm leading-7 text-slate-300">{project.description[lang]}</p>

          <div className="relative mb-7 flex flex-wrap gap-2">
            {project.tech.map((item) => <span key={item} className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">{item}</span>)}
          </div>

          <div className="relative flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold">
            <Link href={`/projects/${project.id}`} className="text-white transition hover:text-cyan-300">
              {lang === "en" ? "Explore case study →" : "Vaka çalışmasını incele →"}
            </Link>
            {project.links.github && <a href={project.links.github} target="_blank" rel="noreferrer" className="text-cyan-300 transition hover:text-white">GitHub ↗</a>}
            {project.links.kaggle && <a href={project.links.kaggle} target="_blank" rel="noreferrer" className="text-purple-300 transition hover:text-white">Kaggle ↗</a>}
          </div>
        </article>
      ))}
    </div>
  );
}
