"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { lang } = useLanguage();
  const tr = lang === "tr";

  return (
    <footer className="border-t border-white/10 bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 md:flex-row md:items-center md:justify-between">
        <div><p className="text-sm font-black tracking-[0.18em] text-white">ZEALCODER</p><p className="mt-2 text-sm text-slate-500">Data · AI · Engineering</p></div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-400"><Link href="/projects" className="hover:text-cyan-300">{tr ? "Projeler" : "Projects"}</Link><Link href="/resources" className="hover:text-cyan-300">{tr ? "Kaynaklar" : "Resources"}</Link><Link href="/resume" className="hover:text-cyan-300">{tr ? "Özgeçmiş" : "Resume"}</Link><Link href="/contact" className="hover:text-cyan-300">{tr ? "İletişim" : "Contact"}</Link></div>
        <div className="flex gap-4 text-sm font-semibold text-slate-400"><a href="https://github.com/zealcoder95" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a><a href="https://www.kaggle.com/gizemglc" target="_blank" rel="noreferrer" className="hover:text-white">Kaggle</a><a href="https://www.linkedin.com/in/gizemgulcu" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a></div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl border-t border-white/5 pt-6 text-xs text-slate-600">© {new Date().getFullYear()} Gizem Gülcü</p>
    </footer>
  );
}
