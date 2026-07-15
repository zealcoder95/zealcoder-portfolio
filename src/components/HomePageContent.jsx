"use client";

import { useLanguage } from "@/context/LanguageContext";
import Hero from "@/components/Hero";
import CurrentFocus from "@/components/CurrentFocus";
import UpdatesSection from "@/components/UpdatesSection";
import HomePreview from "@/components/HomePreview";
import Dashboard from "@/components/Dashboard";

export default function HomePageContent({ dashboardData, updates = [] }) {
  const { t, lang } = useLanguage();

  return (
    <main className="bg-slate-950 text-white">
      <Hero t={t} />
      <CurrentFocus />
      <UpdatesSection updates={updates} />
      <HomePreview />
      <Dashboard lang={lang} data={dashboardData} />
    </main>
  );
}
