"use client";

import Link from "next/link";
import { getCaseStudies } from "@/content/projects";

export default function HomeWork({ lang, totalProjects }) {
  const projects = getCaseStudies();
  const copy = lang === "tr"
    ? { eyebrow: "Seçilmiş çalışmalar", title: "Veriden anlamlı sonuçlara.", all: "Tüm projeleri gör", more: "GitHub’da ek proje" }
    : { eyebrow: "Selected work", title: "From data to useful outcomes.", all: "View all projects", more: "More work on GitHub" };

  return (
    <section className="border-t border-slate-200 bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-700">{copy.eyebrow}</p><h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-5xl">{copy.title}</h2></div><Link href="/projects" className="font-bold text-slate-800 transition hover:text-cyan-700">{copy.all} →</Link></div>
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project, index) => <Link key={project.id} href={`/projects/${project.id}`} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl hover:shadow-slate-200/70"><div className="flex items-start justify-between gap-4"><p className="text-sm font-bold text-cyan-700">0{index + 1}</p><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{project.category[lang]}</span></div><h3 className="mt-10 text-2xl font-black tracking-[-0.025em] text-slate-900">{project.title[lang]}</h3><div className="mt-5 flex flex-wrap gap-2">{project.tech.slice(0, 3).map((item) => <span key={item} className="text-sm text-slate-500">{item}</span>)}</div><p className="mt-6 font-bold text-slate-900 transition group-hover:text-cyan-700">View case study →</p></Link>)}
        </div>
        {totalProjects > 0 && <p className="mt-10 text-sm text-slate-500">{totalProjects} {copy.more.toLowerCase()}.</p>}
      </div>
    </section>
  );
}
