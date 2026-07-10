"use client";

import { useLanguage } from "@/context/LanguageContext";
import About from "@/components/About";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-950 pt-24 text-white">
      <About t={t} />
    </main>
  );
}