"use client";

import { useLanguage } from "@/context/LanguageContext";
import Certificates from "@/components/Certificates";

export default function CertificatesPage() {
  const { lang } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-950 pt-24 text-white">
      <Certificates lang={lang} />
    </main>
  );
}