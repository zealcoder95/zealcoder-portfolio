"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedText } from "@/lib/i18n";

export default function Hero({ t }) {
  const { lang } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#f7f8fc] px-6 pb-20 pt-36 text-slate-950 sm:pb-28">
      <div className="absolute -right-32 -top-28 h-96 w-96 rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-violet-200/45 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-700/15 bg-white/80 px-3.5 py-2 text-xs font-bold tracking-[0.14em] text-cyan-800 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> AVAILABLE FOR NEW OPPORTUNITIES
            </span>

            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-7xl">
                {getLocalizedText(t?.hero?.title, lang, "Building clear, professional data products for modern teams.")}
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                {getLocalizedText(t?.hero?.text, lang, "I turn data into intelligent insights, clean dashboards, and production-ready analytics for real business impact.")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/projects" className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800">
                {getLocalizedText(t?.hero?.ctaProjects, lang, "Explore Projects")}
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white/70 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white">
                {lang === "tr" ? "İletişime geç" : "Start a conversation"}
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">ZealCoder / workspace</p><p className="mt-1 font-bold text-slate-900">Data to decisions</p></div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Active</span>
              </div>
              <div className="mt-7 grid grid-cols-3 gap-3">
                {[['Python', '01'], ['SQL', '02'], ['ML', '03']].map(([name, number]) => <div key={name} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">{number}</p><p className="mt-6 font-black text-slate-800">{name}</p></div>)}
              </div>
              <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white"><div className="flex items-center justify-between text-xs text-slate-400"><span>SELECTED WORK</span><span>2026</span></div><p className="mt-4 text-xl font-bold leading-tight">Analysis, systems &amp; useful AI.</p><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-3/4 rounded-full bg-cyan-400" /></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
