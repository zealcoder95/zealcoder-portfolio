"use client";

import Link from "next/link";
import { getHomepageContent } from "@/content/homepage";

const copy = {
  en: {
    focus: "Current Focus", focusTitle: "A platform built in public, through practical work.",
    featured: "Featured Project", featuredTitle: "One question, a careful analysis.", problem: "Problem", impact: "What it delivers", caseStudy: "View Case Study",
    journey: "Learning Journey", journeyTitle: "A direction, not a finished story.",
    writing: "Latest Writing", writingTitle: "Technical writing is taking shape.", writingText: "Notes and articles about data, machine learning and AI Engineering will be shared on Medium as the work develops.", topic: "Topic", reading: "Reading time", writingStatus: "Writing in progress", medium: "Visit Medium",
    resources: "Resources", resourcesTitle: "Useful references for the next step.", resourcesText: "A small, practical library for building stronger foundations.", open: "Open resource",
    lab: "AI Lab", labTitle: "A home for experiments worth documenting.", labText: "This space will collect LLM notes, RAG experiments and agent workflows as they become real, reviewable work.", comingSoon: "Coming Soon", exploreLab: "Explore AI Lab",
    together: "Let's Build Together", togetherTitle: "Open to thoughtful conversations and practical collaboration.", togetherText: "Whether you are hiring, building, learning or exploring, ZealCoder is a place to start a useful conversation.", contact: "Contact", github: "Visit GitHub",
    stages: [
      ["Completed", "Python, SQL, Pandas and data analysis foundations."],
      ["Current", "Machine learning, project documentation and AI Engineering foundations."],
      ["Next", "Deep learning, LLMs, RAG systems and AI agents."],
    ],
  },
  tr: {
    focus: "Mevcut Odak", focusTitle: "Uygulamalı çalışmalarla, açıkça geliştirilen bir platform.",
    featured: "Öne Çıkan Proje", featuredTitle: "Bir soru, dikkatli bir analiz.", problem: "Problem", impact: "Sunduğu değer", caseStudy: "Vaka Çalışmasını Gör",
    journey: "Öğrenme Yolculuğu", journeyTitle: "Tamamlanmış bir hikâye değil, net bir yön.",
    writing: "Son Yazılar", writingTitle: "Teknik yazılar şekilleniyor.", writingText: "Çalışmalar geliştikçe veri, makine öğrenmesi ve AI Engineering üzerine notlar ve yazılar Medium'da paylaşılacak.", topic: "Konu", reading: "Okuma süresi", writingStatus: "Yazım aşamasında", medium: "Medium'u ziyaret et",
    resources: "Kaynaklar", resourcesTitle: "Sonraki adım için faydalı referanslar.", resourcesText: "Daha güçlü temeller kurmak için küçük ve uygulamalı bir kütüphane.", open: "Kaynağı aç",
    lab: "AI Lab", labTitle: "Belgelenmeye değer deneyler için bir alan.", labText: "Bu alan, gerçek ve incelenebilir hâle geldikçe LLM notlarını, RAG deneylerini ve agent iş akışlarını bir araya getirecek.", comingSoon: "Yakında", exploreLab: "AI Lab'i keşfet",
    together: "Birlikte Üretelim", togetherTitle: "Düşünülmüş sohbetlere ve uygulamalı iş birliklerine açığım.", togetherText: "İster işe alım, ister üretim, ister öğrenme veya keşif için burada olun; ZealCoder faydalı bir sohbetin başlangıç noktasıdır.", contact: "İletişime Geç", github: "GitHub'ı ziyaret et",
    stages: [
      ["Tamamlanan", "Python, SQL, Pandas ve veri analizi temelleri."],
      ["Mevcut", "Makine öğrenmesi, proje dokümantasyonu ve AI Engineering temelleri."],
      ["Sıradaki", "Derin öğrenme, LLM'ler, RAG sistemleri ve AI agent'lar."],
    ],
  },
};

function Eyebrow({ children }) {
  return <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">{children}</p>;
}

export default function PortfolioHub({ lang }) {
  const text = copy[lang] || copy.en;
  const { experiments: aiLab, featuredProject, resources } = getHomepageContent();
  const focusItems = [
    { title: text.stages[1][0], description: text.stages[1][1], href: "/learning" },
    { title: lang === "tr" ? "Şu anda geliştiriliyor" : "Currently building", description: lang === "tr" ? "Uygulamalı bir AI öğrenme platformu." : "A practical AI learning platform.", href: "/ai-lab" },
    { title: lang === "tr" ? "Son proje" : "Latest project", description: featuredProject.title[lang], href: `/projects/${featuredProject.id}` },
    { title: lang === "tr" ? "Son yazılar" : "Latest writing", description: lang === "tr" ? "Medium'da teknik notlar hazırlanıyor." : "Technical notes are in progress on Medium.", href: "https://medium.com/@zealcoder", external: true },
  ];

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
          <div><Eyebrow>{text.featured}</Eyebrow><h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{text.featuredTitle}</h2><Link href="/projects" className="mt-8 inline-flex font-bold text-cyan-200 transition hover:text-white">{lang === "tr" ? "Tüm projeler" : "All projects"} →</Link></div>
          <article className="rounded-[28px] border border-white/10 bg-slate-950/50 p-7 md:p-9">
            <p className="text-sm font-bold text-cyan-300">{featuredProject.category[lang]}</p><h3 className="mt-4 text-2xl font-black leading-tight text-white md:text-3xl">{featuredProject.title[lang]}</h3>
            <div className="mt-8 grid gap-6 md:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{text.problem}</p><p className="mt-3 leading-7 text-slate-300">{featuredProject.problem[lang]}</p></div><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{text.impact}</p><p className="mt-3 leading-7 text-slate-300">{featuredProject.outcome[lang]}</p></div></div>
            <div className="mt-8 flex flex-wrap gap-2">{featuredProject.tech.map((tech) => <span key={tech} className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-300">{tech}</span>)}</div>
            <Link href={`/projects/${featuredProject.id}`} className="mt-8 inline-flex rounded-full bg-cyan-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-200">{text.caseStudy}</Link>
          </article>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-24 text-white"><div className="zc-container"><div className="max-w-2xl"><Eyebrow>{text.journey}</Eyebrow><h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{text.journeyTitle}</h2></div><ol className="mt-10 grid gap-4 md:grid-cols-3">{text.stages.map(([stage, description], index) => <li key={stage} className="border-l-2 border-white/10 pl-5 first:border-emerald-300/60 nth-[2]:border-cyan-300/60 last:border-purple-300/60"><p className="text-sm font-bold text-cyan-200">0{index + 1} · {stage}</p><p className="mt-3 leading-7 text-slate-300">{description}</p></li>)}</ol><Link href="/learning" className="mt-10 inline-flex font-bold text-cyan-200 transition hover:text-white">{lang === "tr" ? "Öğrenme yolculuğunu incele" : "Explore the learning journey"} →</Link></div></section>

      <section className="bg-slate-900 px-6 py-24 text-white"><div className="zc-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div><Eyebrow>{text.writing}</Eyebrow><h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{text.writingTitle}</h2><p className="mt-6 max-w-xl leading-8 text-slate-300">{text.writingText}</p></div><a href="https://medium.com/@zealcoder" target="_blank" rel="noreferrer" className="block rounded-[28px] border border-white/10 bg-slate-950/50 p-7 transition hover:border-emerald-300/30 md:p-9"><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Medium</p><h3 className="mt-5 text-2xl font-black text-white">{text.writingStatus}</h3><div className="mt-8 grid gap-4 text-sm sm:grid-cols-2"><div><p className="text-slate-500">{text.topic}</p><p className="mt-1 font-semibold text-slate-200">Data · ML · AI</p></div><div><p className="text-slate-500">{text.reading}</p><p className="mt-1 font-semibold text-slate-200">—</p></div></div><span className="mt-8 inline-flex font-bold text-emerald-200">{text.medium} ↗</span></a></div></section>

      <section className="bg-slate-950 px-6 py-24 text-white"><div className="zc-container"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div className="max-w-2xl"><Eyebrow>{text.resources}</Eyebrow><h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{text.resourcesTitle}</h2><p className="mt-5 leading-8 text-slate-300">{text.resourcesText}</p></div><Link href="/resources" className="font-bold text-cyan-200 transition hover:text-white">{lang === "tr" ? "Tüm kaynaklar" : "All resources"} →</Link></div><div className="mt-10 grid gap-4 md:grid-cols-3">{resources.slice(0, 6).map((resource) => <a key={resource.title} href={resource.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-cyan-300/30 hover:bg-white/[0.05]"><p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-300">{resource.type[lang]}</p><h3 className="mt-4 text-xl font-black text-white">{resource.title}</h3><p className="mt-4 leading-7 text-slate-300">{resource.description[lang]}</p><span className="mt-6 inline-flex text-sm font-bold text-cyan-200 transition group-hover:text-white">{text.open} ↗</span></a>)}</div></div></section>

      <section className="bg-slate-900 px-6 py-24 text-white"><div className="zc-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"><div><p className="inline-flex rounded-full border border-purple-300/30 px-3 py-1 text-xs font-bold text-purple-200">{text.comingSoon}</p><h2 className="mt-5 text-3xl font-black leading-tight md:text-5xl">{text.labTitle}</h2><p className="mt-6 max-w-xl leading-8 text-slate-300">{text.labText}</p><Link href="/ai-lab" className="mt-8 inline-flex font-bold text-cyan-200 transition hover:text-white">{text.exploreLab} →</Link></div><div className="grid gap-3 sm:grid-cols-3">{aiLab.map((item) => <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/50 p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-purple-300">{item.status[lang]}</p><h3 className="mt-4 text-lg font-black text-white">{item.title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{item.description[lang]}</p></div>)}</div></div></section>

      <section className="bg-slate-950 px-6 py-24 text-white"><div className="zc-container border-t border-white/10 pt-16"><div className="max-w-3xl"><Eyebrow>{text.together}</Eyebrow><h2 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{text.togetherTitle}</h2><p className="mt-6 max-w-2xl leading-8 text-slate-300">{text.togetherText}</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/contact" className="inline-flex rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-200">{text.contact}</Link><a href="https://github.com/zealcoder95" target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/15 px-6 py-3 font-bold text-white transition hover:border-cyan-300/50 hover:bg-white/5">{text.github}</a></div></div></div></section>
    </main>
  );
}
