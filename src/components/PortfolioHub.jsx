"use client";

import Link from "next/link";
import { projects } from "@/data/projects";
import { resources } from "@/data/resources";

const profiles = [
  { name: "GitHub", handle: "@zealcoder95", href: "https://github.com/zealcoder95", mark: "GH", tone: "from-violet-500/20 to-slate-900", markTone: "text-slate-200" },
  { name: "Kaggle", handle: "@gizemglc", href: "https://www.kaggle.com/gizemglc", mark: "K", tone: "from-cyan-400/20 to-slate-900", markTone: "text-cyan-300" },
  { name: "LinkedIn", handle: "Gizem Gülcü", href: "https://www.linkedin.com/in/gizemgulcu", mark: "in", tone: "from-blue-500/20 to-slate-900", markTone: "text-blue-300" },
  { name: "Medium", handle: "@zealcoder", href: "https://medium.com/@zealcoder", mark: "M", tone: "from-emerald-500/20 to-slate-900", markTone: "text-emerald-300" },
];

export default function PortfolioHub({ lang }) {
  const tr = lang === "tr";

  return (
    <>
      <section id="featured-projects" className="scroll-mt-20 bg-slate-950 px-6 pb-28 pt-8 text-white">
        <div className="mx-auto max-w-7xl border-t border-white/10 pt-24">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
            <div><p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">{tr ? "Seçilmiş çalışmalar" : "Selected work"}</p><h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight md:text-5xl">{tr ? "Gerçek sorulara, net analizler." : "Clear analysis for real questions."}</h2></div>
            <Link href="/projects" className="rounded-full border border-cyan-300/30 px-5 py-3 text-sm font-bold text-cyan-200 transition hover:bg-cyan-300/10">{tr ? "Tüm projeler" : "All projects"} →</Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {projects.slice(0, 3).map((project, index) => <Link key={project.id} href={`/projects/${project.id}`} className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[0.075]">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />
              <p className="relative text-sm font-black text-cyan-300">0{index + 1}</p><p className="relative mt-7 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{project.category[lang]}</p>
              <h3 className="relative mt-3 text-2xl font-black leading-tight text-white">{project.title[lang]}</h3>
              <div className="relative mt-6 flex flex-wrap gap-2">{project.tech.slice(0, 3).map((item) => <span key={item} className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">{item}</span>)}</div>
              <p className="relative mt-8 font-bold text-cyan-200 transition group-hover:text-white">{tr ? "Vaka çalışmasını incele" : "Explore case study"} →</p>
            </Link>)}
          </div>
        </div>
      </section>

      <section className="bg-[#0b1220] px-6 py-28 text-white">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div><p className="text-sm font-black uppercase tracking-[0.28em] text-purple-300">{tr ? "Öğrenme kütüphanesi" : "Learning library"}</p><h2 className="mt-4 text-4xl font-black leading-tight">{tr ? "Paylaşmak için öğreniyorum." : "Learning, then sharing."}</h2><p className="mt-6 max-w-md leading-8 text-slate-400">{tr ? "Kullandığım notlar, yol haritaları ve güvenilir referanslar; öğrenme sürecini hızlandırmak isteyen herkes için burada." : "Notes, roadmaps and dependable references for anyone building stronger data skills."}</p><Link href="/resources" className="mt-8 inline-flex font-bold text-cyan-300 transition hover:text-white">{tr ? "Tüm kaynaklar" : "Explore the library"} →</Link></div>
          <div className="grid gap-4 sm:grid-cols-3">{resources.map((resource, index) => <a key={resource.title} href={resource.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-purple-300/40 hover:bg-white/[0.07]"><p className="text-sm font-black text-purple-300">0{index + 1}</p><p className="mt-10 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{resource.type[lang]}</p><h3 className="mt-3 text-xl font-black text-white">{resource.title}</h3><p className="mt-6 text-sm font-bold text-cyan-200">{tr ? "Kaynağı aç" : "Open resource"} ↗</p></a>)}</div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-28 text-white">
        <div className="mx-auto max-w-7xl"><div className="mb-12 max-w-2xl"><p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-300">{tr ? "Takipte kal" : "Follow the work"}</p><h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">{tr ? "Çalışmaların yayınlandığı yerler." : "Where the work continues."}</h2><p className="mt-5 leading-8 text-slate-400">{tr ? "Kodlar, notebook'lar, profesyonel gelişmeler ve teknik yazılar tek bir yerde." : "Code, notebooks, professional updates and technical writing—connected in one place."}</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{profiles.map((profile) => <a key={profile.name} href={profile.href} target="_blank" rel="noreferrer" className={`group rounded-2xl border border-white/10 bg-linear-to-br ${profile.tone} p-6 transition hover:-translate-y-1 hover:border-white/30`}><span className={`flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-slate-950/60 text-lg font-black tracking-tight ${profile.markTone}`}>{profile.mark}</span><p className="mt-8 text-xl font-black text-white">{profile.name}</p><p className="mt-1 text-sm text-slate-400">{profile.handle}</p><p className="mt-6 font-bold text-cyan-200 transition group-hover:text-white">{tr ? "Profili aç" : "Visit profile"} ↗</p></a>)}</div></div>
      </section>
    </>
  );
}
