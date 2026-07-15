"use client";

import { useLanguage } from "@/context/LanguageContext";
import Certificates from "@/components/Certificates";

export default function CertificatesPage() {
  const { lang } = useLanguage();

  return (
    <main className="zc-page zc-page--nav-offset">
      <Certificates lang={lang} />
    </main>
  );
}
