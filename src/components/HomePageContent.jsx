"use client";

import { useLanguage } from "@/context/LanguageContext";
import Hero from "@/components/Hero";
import PortfolioHub from "@/components/PortfolioHub";
import { getHomepageData } from "@/domain/homepage";

export default function HomePageContent() {
  const { lang } = useLanguage();
  const data = getHomepageData(lang);

  return (
    <main className="bg-slate-950 text-white">
      <Hero data={data.hero} />
      <PortfolioHub data={data} />
    </main>
  );
}
