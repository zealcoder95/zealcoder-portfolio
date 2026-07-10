"use client";

import { useLanguage } from "@/context/LanguageContext";
import Contact from "@/components/Contact";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-950 pt-24 text-white">
      <Contact t={t} />
    </main>
  );
}