"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const { lang, toggleLang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { href: "/about", label: t?.nav?.about || "About" },
    { href: "/projects", label: t?.nav?.projects || "Projects" },
    { href: "/learning", label: t?.nav?.learning || "Learning" },
    { href: "/resume", label: lang === "en" ? "Resume" : "Özgeçmiş" },
    { href: "/contact", label: t?.nav?.contact || "Contact" },
  ];
  const active = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">Z</span>
          <span><span className="block text-sm font-black tracking-[0.16em] text-slate-950">ZEALCODER</span><span className="mt-0.5 block text-[10px] font-semibold tracking-[0.12em] text-slate-400">DATA · AI · ENGINEERING</span></span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => <Link key={link.href} href={link.href} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${active(link.href) ? "bg-slate-100 text-slate-950" : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"}`}>{link.label}</Link>)}
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleLang} className="hidden rounded-lg px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 sm:block">{lang === "en" ? "TR" : "EN"}</button>
          <a href="/cv.pdf" download="Gizem-Gulcu-CV.pdf" className="hidden rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 sm:block">CV ↓</a>
          <button type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"><span className="text-xl leading-none">{menuOpen ? "×" : "≡"}</span></button>
        </div>
      </div>

      {menuOpen && <div className="border-t border-slate-100 bg-white px-5 py-4 lg:hidden"><div className="mx-auto flex max-w-6xl flex-col gap-1">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`rounded-lg px-4 py-3 text-sm font-bold ${active(link.href) ? "bg-slate-100 text-slate-950" : "text-slate-600"}`}>{link.label}</Link>)}<div className="mt-3 flex items-center gap-3"><button type="button" onClick={toggleLang} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600">{lang === "en" ? "Türkçe" : "English"}</button><a href="/cv.pdf" download="Gizem-Gulcu-CV.pdf" className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white">CV indir</a></div></div></div>}
    </nav>
  );
}
