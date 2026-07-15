"use client";

import { useLanguage } from "@/context/LanguageContext";
import About from "@/components/About";
import CareerTimeline from "@/components/CareerTimeline";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <main className="zc-page zc-page--nav-offset">
      <About t={t} />
      <CareerTimeline />
    </main>
  );
}
