"use client";

import { useLanguage } from "@/context/LanguageContext";
import About from "@/components/About";
import CareerTimeline from "@/components/CareerTimeline";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-950 pt-24 text-white">
      <About t={t} />
      <CareerTimeline />
    </main>
  );
}