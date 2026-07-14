"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import CaseStudies from "@/components/CaseStudies";

export default function HomePreview() {
  const { lang } = useLanguage();

  const highlights = {
    en: [
      {
        label: "Latest Project",
        title: "Renewable Energy & Climate Analysis",
        text: "A data science case study exploring renewable energy, emissions and climate trends.",
      },
      {
        label: "Current Focus",
        title: "Machine Learning & AI Engineering",
        text: "Building strong foundations in ML, data storytelling and intelligent systems.",
      },
      {
        label: "Next Step",
        title: "From Portfolio to Platform",
        text: "Turning ZealCoder into a growing personal technology platform.",
      },
    ],
    tr: [
      {
        label: "Son Proje",
        title: "Yenilenebilir Enerji ve İklim Analizi",
        text: "Yenilenebilir enerji, karbon emisyonu ve iklim trendlerini inceleyen veri bilimi vaka çalışması.",
      },
      {
        label: "Mevcut Odak",
        title: "Machine Learning & AI Engineering",
        text: "ML, veri hikâyeleştirme ve akıllı sistemler üzerine güçlü bir temel inşa ediyorum.",
      },
      {
        label: "Sonraki Adım",
        title: "Portfolyodan Platforma",
        text: "ZealCoder’ı büyüyen kişisel teknoloji platformuna dönüştürüyorum.",
      },
    ],
  };

  const items = highlights[lang];

  return (
    <section className="bg-slate-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.4em] text-cyan-300">
          {lang === "en" ? "Highlights" : "Öne Çıkanlar"}
        </p>

        <h2 className="mb-14 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
          {lang === "en"
            ? "What I’m building, learning and improving."
            : "Ne geliştiriyorum, ne öğreniyorum, nereye ilerliyorum?"}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-cyan-300/40 hover:shadow-[0_0_45px_rgba(34,211,238,0.16)]"
            >
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-purple-500/20" />

              <p className="mb-8 text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
                {item.label}
              </p>

              <h3 className="mb-4 text-2xl font-black">{item.title}</h3>

              <p className="text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-purple-300">{lang === "en" ? "Featured work" : "Öne çıkan çalışmalar"}</p>
              <h3 className="mt-2 text-3xl font-black">{lang === "en" ? "Built around real questions." : "Gerçek sorular etrafında geliştirildi."}</h3>
            </div>
            <Link href="/projects" className="font-bold text-cyan-300 transition hover:text-white">{lang === "en" ? "All projects →" : "Tüm projeler →"}</Link>
          </div>
          <CaseStudies compact />
        </div>
      </div>
    </section>
  );
}
