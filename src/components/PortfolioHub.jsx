"use client";

import Link from "next/link";

function Eyebrow({ children }) {
  return <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">{children}</p>;
}

export default function PortfolioHub({ data }) {
  const { aiLabPreview: aiLab, copy: text, currentFocus: focusItems, featuredProject, resourcesPreview: resources, cta, latestWriting } = data;

  return (
    <main>
      <section id="current-focus" className="scroll-mt-20 bg-slate-950 px-6 py-20 text-white md:py-24">
        <div className="zc-container">
          <div className="max-w-2xl"><Eyebrow>{text.focus}</Eyebrow><h2 className="mt-4 text-3xl font-black leading-tight text-white md:text-5xl">{text.focusTitle}</h2></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {focusItems.map((item) => {
              const content = <><h3 className="text-sm font-bold text-cyan-200">{item.title}</h3><p className="mt-4 text-base font-semibold leading-6 text-white">{item.description}</p><span className="mt-6 inline-flex text-sm font-bold text-slate-400 transition group-hover:text-cyan-200">→</span></>;
              const className = "group min-h-48 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition duration-300 hover:border-cyan-300/30 hover:bg-white/[0.05]";
              return item.external ? <a key={item.title} href={item.href} target="_blank" rel="noreferrer" className={className}>{content}</a> : <Link key={item.title} href={item.href} className={className}>{content}</Link>;
            })}
          </div>
        </div>
      </section>

      <section id="featured-projects" className="scroll-mt-20 bg-slate-900 px-6 py-24 text-white">
        <div className="zc-container grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div><Eyebrow>{text.featured}</Eyebrow><h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{text.featuredTitle}</h2><Link href="/projects" className="mt-8 inline-flex font-bold text-cyan-200 transition hover:text-white">{text.allProjects} →</Link></div>
          <article className="rounded-[28px] border border-white/10 bg-slate-950/50 p-7 md:p-9">
            <p className="text-sm font-bold text-cyan-300">{featuredProject.category}</p><h3 className="mt-4 text-2xl font-black leading-tight text-white md:text-3xl">{featuredProject.title}</h3>
            <div className="mt-8 grid gap-6 md:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{text.problem}</p><p className="mt-3 leading-7 text-slate-300">{featuredProject.problem}</p></div><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{text.impact}</p><p className="mt-3 leading-7 text-slate-300">{featuredProject.outcome}</p></div></div>
            <div className="mt-8 flex flex-wrap gap-2">{featuredProject.tech.map((tech) => <span key={tech} className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-300">{tech}</span>)}</div>
            <Link href={`/projects/${featuredProject.id}`} className="mt-8 inline-flex rounded-full bg-cyan-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-200">{text.caseStudy}</Link>
          </article>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-24 text-white"><div className="zc-container"><div className="max-w-2xl"><Eyebrow>{text.journey}</Eyebrow><h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{text.journeyTitle}</h2></div><ol className="mt-10 grid gap-4 md:grid-cols-3">{data.learningPreview.map(({ stage, description }, index) => <li key={stage} className="border-l-2 border-white/10 pl-5 first:border-emerald-300/60 nth-[2]:border-cyan-300/60 last:border-purple-300/60"><p className="text-sm font-bold text-cyan-200">0{index + 1} · {stage}</p><p className="mt-3 leading-7 text-slate-300">{description}</p></li>)}</ol><Link href="/learning" className="mt-10 inline-flex font-bold text-cyan-200 transition hover:text-white">{text.learningLink} →</Link></div></section>

      <section className="bg-slate-900 px-6 py-24 text-white"><div className="zc-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div><Eyebrow>{text.writing}</Eyebrow><h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{text.writingTitle}</h2><p className="mt-6 max-w-xl leading-8 text-slate-300">{text.writingText}</p></div><a href={latestWriting.href} target="_blank" rel="noreferrer" className="block rounded-[28px] border border-white/10 bg-slate-950/50 p-7 transition hover:border-emerald-300/30 md:p-9"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">{latestWriting.platform}</p><h3 className="mt-5 text-2xl font-black text-white">{text.writingStatus}</h3><div className="mt-8 grid gap-4 text-sm sm:grid-cols-2"><div><p className="text-slate-500">{text.topic}</p><p className="mt-1 font-semibold text-slate-200">Data · ML · AI</p></div><div><p className="text-slate-500">{text.reading}</p><p className="mt-1 font-semibold text-slate-200">—</p></div></div><span className="mt-8 inline-flex font-bold text-emerald-200">{text.medium} ↗</span></a></div></section>

      <section className="bg-slate-950 px-6 py-24 text-white"><div className="zc-container"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div className="max-w-2xl"><Eyebrow>{text.resources}</Eyebrow><h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{text.resourcesTitle}</h2><p className="mt-5 leading-8 text-slate-300">{text.resourcesText}</p></div><Link href="/resources" className="font-bold text-cyan-200 transition hover:text-white">{text.allResources} →</Link></div><div className="mt-10 grid gap-4 md:grid-cols-3">{resources.map((resource) => <a key={resource.title} href={resource.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-300/30 hover:bg-white/[0.05]"><p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">{resource.type}</p><h3 className="mt-4 text-xl font-black text-white">{resource.title}</h3><p className="mt-4 leading-7 text-slate-300">{resource.description}</p><span className="mt-6 inline-flex text-sm font-bold text-cyan-200 transition group-hover:text-white">{text.open} ↗</span></a>)}</div></div></section>

      <section className="bg-slate-900 px-6 py-24 text-white"><div className="zc-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"><div><p className="inline-flex rounded-full border border-purple-300/30 px-3 py-1 text-xs font-bold text-purple-200">{text.comingSoon}</p><h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">{text.labTitle}</h2><p className="mt-6 max-w-xl leading-8 text-slate-300">{text.labText}</p><Link href="/ai-lab" className="mt-8 inline-flex font-bold text-cyan-200 transition hover:text-white">{text.exploreLab} →</Link></div><div className="grid gap-3 sm:grid-cols-3">{aiLab.map((item) => <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-purple-300">{item.status}</p><h3 className="mt-4 text-lg font-black text-white">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p></div>)}</div></div></section>

      <section className="bg-slate-950 px-6 py-24 text-white"><div className="zc-container border-t border-white/10 pt-16"><div className="max-w-3xl"><Eyebrow>{text.together}</Eyebrow><h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{text.togetherTitle}</h2><p className="mt-6 max-w-2xl leading-8 text-slate-300">{text.togetherText}</p><div className="mt-9 flex flex-wrap gap-3"><Link href={cta.contactHref} className="inline-flex rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-200">{text.contact}</Link><a href={cta.githubHref} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/15 px-6 py-3 font-bold text-white transition hover:border-cyan-300/50 hover:bg-white/5">{text.github}</a></div></div></div></section>
    </main>
  );
}
