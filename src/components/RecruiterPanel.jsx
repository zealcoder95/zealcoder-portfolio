"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function RecruiterPanel() {
  const { lang } = useLanguage();
  const copy = lang === "en"
    ? {
        kicker: "For teams & recruiters", title: "A practical, analytical teammate.",
        text: "I combine an engineering mindset with data analysis and a habit of documenting the work—not just the result.",
        points: ["Turn ambiguous questions into measurable analyses", "Build clear Python, SQL and dashboard workflows", "Communicate findings through clean, decision-ready stories"],
        primary: "View resume", secondary: "Start a conversation", note: "Open to junior Data Science & AI Engineering opportunities",
      }
    : {
        kicker: "Ekipler ve işe alım uzmanları için", title: "Pratik ve analitik bir ekip arkadaşı.",
        text: "Mühendislik bakış açısını veri analiziyle ve yalnızca sonucu değil süreci de belgeleme alışkanlığıyla birleştiriyorum.",
        points: ["Belirsiz soruları ölçülebilir analizlere dönüştürmek", "Python, SQL ve dashboard iş akışları geliştirmek", "Bulguları karar vermeyi kolaylaştıran hikâyelerle aktarmak"],
        primary: "Özgeçmişi incele", secondary: "İletişime geç", note: "Junior Data Science ve AI Engineering fırsatlarına açığım",
      };

  return (
    <section className="bg-slate-950 px-6 pb-8 pt-24 text-white">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[36px] border border-cyan-300/20 bg-linear-to-br from-cyan-400/10 via-slate-900 to-purple-500/10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="p-8 md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.32em] text-cyan-300">{copy.kicker}</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight md:text-5xl">{copy.title}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{copy.text}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/resume" className="rounded-full bg-white px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-200">{copy.primary}</Link>
            <Link href="/contact" className="rounded-full border border-cyan-300/40 px-6 py-3 font-bold text-cyan-200 transition hover:-translate-y-1 hover:bg-cyan-400/10">{copy.secondary}</Link>
          </div>
        </div>
        <aside className="border-t border-white/10 bg-slate-950/35 p-8 md:p-12 lg:border-l lg:border-t-0">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-200"><span className="h-2 w-2 rounded-full bg-emerald-300" />{copy.note}</div>
          <ul className="space-y-5">{copy.points.map((point, index) => <li key={point} className="flex gap-4 text-slate-200"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-400/15 text-sm font-black text-purple-200">0{index + 1}</span><span className="pt-0.5 leading-6">{point}</span></li>)}</ul>
        </aside>
      </div>
    </section>
  );
}
