"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { getNavigation } from "@/content/settings";

export default function Navbar() {
  const pathname = usePathname();
  const { lang, toggleLang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = getNavigation(lang);
  const active = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
          <img src="/assets/zealcoder-logo.png" alt="ZealCoder" className="h-10 w-10 rounded-full border border-cyan-300/20 object-cover" />
          <span><span className="block text-sm font-black tracking-[0.16em] text-white">ZEALCODER</span><span className="mt-0.5 block text-[10px] font-semibold tracking-[0.12em] text-slate-400">DATA · AI · ENGINEERING</span></span>
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {links.map((link) => <Link key={link.href} href={link.href} className={`rounded-full px-3 py-2 text-sm font-bold transition ${active(link.href) ? "bg-cyan-400/10 text-cyan-300" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>{link.label}</Link>)}
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleLang} className="hidden rounded-full border border-cyan-300/30 px-3 py-2 text-sm font-bold text-cyan-300 transition hover:bg-cyan-300/10 sm:block">{lang === "en" ? "TR" : "EN"}</button>
          <a href="/cv.pdf" download="Gizem-Gulcu-CV.pdf" className="hidden rounded-full bg-linear-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 sm:block">CV ↓</a>
          <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white xl:hidden"><span className="text-xl leading-none">{menuOpen ? "×" : "≡"}</span></button>
        </div>
      </div>

      {menuOpen && <div className="border-t border-white/10 bg-slate-950 px-5 py-4 xl:hidden"><div className="mx-auto flex max-w-7xl flex-col gap-1">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`rounded-xl px-4 py-3 text-sm font-bold ${active(link.href) ? "bg-cyan-400/10 text-cyan-300" : "text-slate-300"}`}>{link.label}</Link>)}<div className="mt-3 flex items-center gap-3"><button type="button" onClick={toggleLang} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-cyan-300">{lang === "en" ? "Türkçe" : "English"}</button><a href="/cv.pdf" download="Gizem-Gulcu-CV.pdf" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950">CV indir</a></div></div></div>}
    </nav>
  );
}
