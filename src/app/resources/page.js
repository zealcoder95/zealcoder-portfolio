"use client";

import { useLanguage } from "@/context/LanguageContext";
import Resources from "@/components/Resources";

export default function ResourcesPage() {
  const { lang } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-950 pt-24 text-white">
      <Resources lang={lang} />
    </main>
  );
}