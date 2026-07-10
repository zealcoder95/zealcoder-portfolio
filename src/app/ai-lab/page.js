"use client";

import { useLanguage } from "@/context/LanguageContext";
import AILab from "@/components/AILab";

export default function AILabPage() {
  const { lang } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-950 pt-24 text-white">
      <AILab lang={lang} />
    </main>
  );
}