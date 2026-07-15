"use client";

import { useLanguage } from "@/context/LanguageContext";
import Resources from "@/components/Resources";

export default function ResourcesPage() {
  const { lang } = useLanguage();

  return (
    <main className="zc-page zc-page--nav-offset">
      <Resources lang={lang} />
    </main>
  );
}
