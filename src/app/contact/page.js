"use client";

import { useLanguage } from "@/context/LanguageContext";
import Contact from "@/components/Contact";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <main className="zc-page zc-page--nav-offset">
      <Contact t={t} />
    </main>
  );
}
