"use client";

import { useLanguage } from "@/context/LanguageContext";

import Hero from "@/components/Hero";
import CurrentFocus from "@/components/CurrentFocus";
import HomePreview from "@/components/HomePreview";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const { t, lang } = useLanguage();

  return (
    <main className="bg-slate-950 text-white">
      <Hero t={t} />
      <CurrentFocus />
      <HomePreview />
      <Dashboard lang={lang} />
    </main>
  );
}