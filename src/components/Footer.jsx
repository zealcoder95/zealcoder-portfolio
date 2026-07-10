"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 px-6 py-12 text-white">
      <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl text-center">
        <h2 className="mb-3 bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-3xl font-black tracking-[0.2em] text-transparent">
          ZEALCODER
        </h2>

        <p className="text-slate-300">
          Building Intelligence. One Project at a Time.
        </p>

        <p className="mt-3 text-sm uppercase tracking-[0.35em] text-slate-500">
          Data • AI • Engineering
        </p>

        <div className="mx-auto my-8 h-px max-w-md bg-white/10" />

        <p className="text-sm text-slate-500">
          © 2026 Gizem Gülcü. {t.footer.built}
        </p>
      </div>
    </footer>
  );
}