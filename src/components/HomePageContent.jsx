'use client';

import { useLanguage } from '@/context/LanguageContext';
import Hero from '@/components/Hero';
import HomeWork from '@/components/HomeWork';

export default function HomePageContent({ dashboardData }) {
  const { t, lang } = useLanguage();

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-950">
      <Hero t={t} />
      <HomeWork lang={lang} totalProjects={dashboardData?.totalProjects || 0} />
    </main>
  );
}
