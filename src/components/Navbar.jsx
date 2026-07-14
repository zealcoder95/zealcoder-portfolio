'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const { lang, toggleLang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: '/about', label: t?.nav?.about || 'About' },
    { href: '/projects', label: t?.nav?.projects || 'Projects' },
    { href: '/learning', label: t?.nav?.learning || 'Learning' },
    { href: '/resume', label: lang === 'en' ? 'Resume' : 'Özgeçmiş' },
    { href: '/certificates', label: lang === 'en' ? 'Certificates' : 'Sertifikalar' },
    { href: '/ai-lab', label: 'AI Lab' },
    { href: '/contact', label: t?.nav?.contact || 'Contact' },
  ];

  function closeMenu() {
    setMenuOpen(false);
  }

  function isLinkActive(href) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-slate-950/95 via-slate-950/90 to-slate-950/95 backdrop-blur-xl shadow-lg shadow-slate-900/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex min-w-0 items-center gap-3 transition-all duration-300"
        >
          <div className="relative h-10 w-10 shrink-0 sm:h-12 sm:w-12">
            <img
              src="/assets/zealcoder-logo.png"
              alt="ZealCoder"
              className="h-full w-full rounded-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-cyan-500/50"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/0 to-purple-400/0 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="min-w-0 hidden sm:block">
            <p className="truncate bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-lg font-black tracking-[0.18em] text-transparent sm:text-xl">
              ZEALCODER
            </p>
            <p className="text-[9px] tracking-[0.28em] text-slate-500">
              AI ENGINEER & DATA SCIENTIST
            </p>
          </div>
          <div className="sm:hidden">
            <p className="text-sm font-black text-cyan-300">ZC</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-1 rounded-full border border-cyan-400/20 bg-gradient-to-r from-white/5 to-blue-400/5 px-2 py-2 xl:flex backdrop-blur">
          {links.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-semibold transition-all duration-300 rounded-full ${
                  active
                    ? 'bg-gradient-to-r from-cyan-400/20 to-blue-400/20 text-cyan-300 shadow-lg shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-cyan-300 hover:bg-cyan-400/10'
                }`}
              >
                {link.label}
                {active && <div className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" />}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLang}
            className="hidden rounded-full border border-cyan-400/30 bg-cyan-400/5 px-4 py-2 text-sm font-bold text-cyan-300 transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-400/15 hover:shadow-lg hover:shadow-cyan-500/20 lg:block"
          >
            {lang === 'en' ? '🇹🇷 TR' : '🇺🇸 EN'}
          </button>

          {/* CV Download - Desktop */}
          <a
            href="/cv.pdf"
            download="Gizem-Gulcu-CV.pdf"
            className="hidden rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-600/50 sm:inline-block"
          >
            Download CV
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 text-cyan-300 transition-all duration-300 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/20 xl:hidden"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 border-t border-cyan-400/20 bg-gradient-to-b from-slate-950/98 via-slate-950/95 to-slate-950/90 px-4 py-6 backdrop-blur-xl xl:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {links.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`rounded-xl px-4 py-3 text-base font-semibold transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-cyan-400/20 to-blue-400/20 text-cyan-300 shadow-lg shadow-cyan-500/20'
                      : 'text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="my-4 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

            {/* Mobile Actions */}
            <div className="flex items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3">
              <span className="text-sm font-semibold text-slate-300">
                {lang === 'en' ? 'Language' : 'Dil'}
              </span>
              <button
                type="button"
                onClick={toggleLang}
                className="rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300 transition-all hover:border-cyan-300/60"
              >
                {lang === 'en' ? '🇹🇷' : '🇺🇸'}
              </button>
            </div>

            <a
              href="/cv.pdf"
              download="Gizem-Gulcu-CV.pdf"
              className="rounded-xl border-2 border-purple-400/30 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 p-4 text-center font-bold text-purple-300 transition-all hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-600/20"
            >
              {lang === 'en' ? '⬇️ Download CV' : '⬇️ CV İndir'}
            </a>

            {/* Social Links */}
            <div className="mt-2 grid grid-cols-3 gap-2">
              <a
                href="https://github.com/zealcoder95"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/10 bg-white/5 p-3 text-center text-xs font-semibold text-slate-300 transition-all hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
              >
                GitHub
              </a>
              <a
                href="https://www.kaggle.com/gizemglc"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/10 bg-white/5 p-3 text-center text-xs font-semibold text-slate-300 transition-all hover:border-blue-400/40 hover:bg-blue-400/10 hover:text-blue-300"
              >
                Kaggle
              </a>
              <a
                href="https://www.linkedin.com/in/gizemgulcu"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/10 bg-white/5 p-3 text-center text-xs font-semibold text-slate-300 transition-all hover:border-purple-400/40 hover:bg-purple-400/10 hover:text-purple-300"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}