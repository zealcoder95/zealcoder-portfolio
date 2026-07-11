"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function CareerTimeline() {
  const { lang } = useLanguage();

  const timeline = [
    {
      year: "2022",
      title: {
        en: "Engineering Foundation",
        tr: "Mühendislik Temeli",
      },
      description: {
        en: "Developed analytical thinking, problem-solving and engineering discipline.",
        tr: "Analitik düşünme, problem çözme ve mühendislik disiplini geliştirdim.",
      },
    },
    {
      year: "2023",
      title: {
        en: "Python & SQL",
        tr: "Python ve SQL",
      },
      description: {
        en: "Started building programming and database foundations through practical exercises.",
        tr: "Uygulamalı çalışmalarla programlama ve veritabanı temellerimi oluşturmaya başladım.",
      },
    },
    {
      year: "2024",
      title: {
        en: "Data Analytics",
        tr: "Veri Analitiği",
      },
      description: {
        en: "Worked with data cleaning, visualization, Power BI and analytical storytelling.",
        tr: "Veri temizleme, görselleştirme, Power BI ve analitik hikâyeleştirme üzerine çalıştım.",
      },
    },
    {
      year: "2025",
      title: {
        en: "Data Science & Machine Learning",
        tr: "Veri Bilimi ve Makine Öğrenmesi",
      },
      description: {
        en: "Built project-based experience with exploratory analysis and machine learning workflows.",
        tr: "Keşifsel veri analizi ve makine öğrenmesi süreçleriyle proje tabanlı deneyim geliştirdim.",
      },
    },
    {
      year: "2026",
      title: {
        en: "AI Engineering Journey",
        tr: "AI Engineering Yolculuğu",
      },
      description: {
        en: "Focusing on LLMs, RAG systems, AI agents and production-ready intelligent applications.",
        tr: "LLM, RAG sistemleri, AI agentları ve üretime hazır akıllı uygulamalara odaklanıyorum.",
      },
    },
  ];

  return (
    <section className="bg-slate-950 px-6 pb-28 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.4em] text-cyan-300">
          {lang === "en" ? "My Journey" : "Yolculuğum"}
        </p>

        <h2 className="mb-14 max-w-3xl text-4xl font-black md:text-6xl">
          {lang === "en"
            ? "From engineering foundations to AI."
            : "Mühendislik temelinden yapay zekâya."}
        </h2>

        <div className="relative">
          <div className="absolute bottom-0 left-5 top-0 w-px bg-linear-to-b from-purple-500 via-cyan-400 to-transparent md:left-1/2" />

          <div className="space-y-10">
            {timeline.map((item, index) => (
              <div
                key={item.year}
                className={`relative grid gap-8 md:grid-cols-2 ${
                  index % 2 === 0 ? "" : "md:[&>div:first-child]:order-2"
                }`}
              >
                <div
                  className={`ml-14 rounded-[28px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/40 md:ml-0 ${
                    index % 2 === 0
                      ? "md:mr-12"
                      : "md:ml-12"
                  }`}
                >
                  <p className="mb-3 text-sm font-black tracking-[0.25em] text-purple-300">
                    {item.year}
                  </p>

                  <h3 className="mb-3 text-2xl font-black">
                    {item.title[lang]}
                  </h3>

                  <p className="leading-7 text-slate-300">
                    {item.description[lang]}
                  </p>
                </div>

                <div className="hidden md:block" />

                <span className="absolute left-2 top-8 h-7 w-7 rounded-full border-4 border-slate-950 bg-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.55)] md:left-1/2 md:-translate-x-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}