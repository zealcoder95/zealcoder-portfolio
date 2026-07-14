"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function AnnouncementBar() {
  const { lang } = useLanguage();

  return (
    <div className="border-b border-indigo-500/10 bg-gradient-to-r from-indigo-600/10 via-cyan-500/10 to-purple-600/10">
      <div className="container flex h-10 items-center justify-center px-4 text-center text-xs font-medium tracking-wide text-slate-300">
        <span className="mr-2">🚀</span>

        {lang === "en"
          ? "Open to AI, Machine Learning & Data Science opportunities."
          : "Yapay Zekâ, Makine Öğrenmesi ve Veri Bilimi alanlarında yeni fırsatlara açığım."}
      </div>
    </div>
  );
}