"use client";

import { useLanguage } from "@/context/LanguageContext";
import AILab from "@/components/AILab";

export default function AILabPage() {
  const { lang } = useLanguage();

  return (
    <main className="zc-page zc-page--nav-offset">
      <AILab lang={lang} />
    </main>
  );
}
