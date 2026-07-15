"use client";

import { useLanguage } from "@/context/LanguageContext";
import LearningHub from "@/components/LearningHub";

export default function LearningPage() {
  const { t } = useLanguage();

  return (
    <main className="zc-page zc-page--nav-offset">
      <LearningHub t={t} />
    </main>
  );
}
