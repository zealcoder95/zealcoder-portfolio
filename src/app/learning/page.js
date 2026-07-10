"use client";

import { useLanguage } from "@/context/LanguageContext";
import LearningHub from "@/components/LearningHub";

export default function LearningPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-950 pt-24 text-white">
      <LearningHub t={t} />
    </main>
  );
}