"use client";

import { useLanguage } from "@/context/LanguageContext";
import Hero from "@/components/Hero";
import PortfolioHub from "@/components/PortfolioHub";

export default function HomePageContent() {
  const { lang } = useLanguage();

  return (
    <main className="bg-slate-950 text-white">
      <Hero lang={lang} />
      <PortfolioHub lang={lang} />
    </main>
  );
}
