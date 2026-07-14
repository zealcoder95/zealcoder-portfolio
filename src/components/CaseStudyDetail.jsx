"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function CaseStudyDetail({ project }) {
  const { lang } = useLanguage();
  const labels = lang === "en"
    ? { back: "Back to projects", eyebrow: "Featured case study", problem: "The question", outcome: "Outcome", stack: "Tools & methods", links: "Project links" }
    : { back: "Projelere dön", eyebrow: "Öne çıkan vaka çalışması", problem: "Problem", outcome: "Çıktı", stack: "Araçlar ve yöntemler", links: "Proje bağlantıları" };

  return (
    <main className="min-h-screen bg-slate-950 px-6 pb-24 pt-32 text-white">
      <article className="mx-auto max-w-5xl">
        <Link href="/projects" className="mb-10 inline-block font-bold text-cyan-300 transition hover:text-white">← {labels.back}</Link>
        <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">{labels.eyebrow}</p>
        <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-purple-300">{project.category[lang]}</p>
        <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">{project.title[lang]}</h1>
        <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-300">{project.description[lang]}</p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-7"><p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">{labels.problem}</p><p className="mt-4 leading-8 text-slate-300">{project.problem[lang]}</p></section>
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-7"><p className="text-sm font-bold uppercase tracking-[0.25em] text-purple-300">{labels.outcome}</p><p className="mt-4 leading-8 text-slate-300">{project.outcome[lang]}</p></section>
        </div>

        <section className="mt-6 rounded-[28px] border border-cyan-300/15 bg-linear-to-r from-cyan-400/10 to-purple-500/10 p-7">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">{labels.stack}</p>
          <div className="mt-5 flex flex-wrap gap-3">{project.tech.map((item) => <span key={item} className="rounded-full border border-cyan-300/20 bg-slate-950/50 px-4 py-2 font-semibold text-cyan-100">{item}</span>)}</div>
        </section>

        <section className="mt-10"><p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-slate-400">{labels.links}</p><div className="flex flex-wrap gap-4">
          {project.links.github && <a href={project.links.github} target="_blank" rel="noreferrer" className="rounded-full bg-linear-to-r from-purple-600 to-cyan-500 px-6 py-3 font-bold">GitHub ↗</a>}
          {project.links.kaggle && <a href={project.links.kaggle} target="_blank" rel="noreferrer" className="rounded-full border border-purple-300/40 px-6 py-3 font-bold text-purple-200 transition hover:bg-purple-400/10">Kaggle Notebook ↗</a>}
        </div></section>
      </article>
    </main>
  );
}
