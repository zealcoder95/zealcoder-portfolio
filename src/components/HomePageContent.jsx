'use client';

import { useLanguage } from '@/context/LanguageContext';
import Hero from '@/components/Hero';
import CurrentFocus from '@/components/CurrentFocus';
import UpdatesSection from '@/components/UpdatesSection';
import HomePreview from '@/components/HomePreview';
import Dashboard from '@/components/Dashboard';
import RecruiterPanel from '@/components/RecruiterPanel';

export default function HomePageContent({
  dashboardData,
  updates = [],
}) {
  const { t, lang } = useLanguage();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f1419] via-[#1a1f2e] to-[#0f1419] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24">
        <Hero t={t} />
      </section>

      {/* Recruiter Panel */}
      <section className="relative overflow-hidden py-16">
        <div className="container">
          <RecruiterPanel />
        </div>
      </section>

      {/* Current Focus */}
      <section className="relative overflow-hidden py-16">
        <div className="container">
          <CurrentFocus />
        </div>
      </section>

      {/* Updates Section */}
      <section className="relative overflow-hidden py-16 border-t border-white/5">
        <div className="container">
          <UpdatesSection updates={updates} />
        </div>
      </section>

      {/* Home Preview */}
      <section className="relative overflow-hidden py-16 border-t border-white/5">
        <div className="container">
          <HomePreview />
        </div>
      </section>

      {/* Dashboard */}
      <section className="relative overflow-hidden py-16 border-t border-white/5">
        <div className="container">
          <Dashboard lang={lang} data={dashboardData} />
        </div>
      </section>
    </main>
  );
}