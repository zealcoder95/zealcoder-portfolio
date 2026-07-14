'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { lang, t } = useLanguage();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-6 py-16 text-white">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-400/5 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Main Content */}
        <div className="grid gap-12 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-full md:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/zealcoder-logo.png"
                alt="ZealCoder"
                className="h-10 w-10 rounded-full"
              />
              <div>
                <p className="text-lg font-black text-cyan-300">ZEALCODER</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest">
                  AI Engineer
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Building intelligent solutions through data, machine learning, and artificial intelligence.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-cyan-300">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/projects" className="text-sm text-slate-400 transition hover:text-cyan-300">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/learning" className="text-sm text-slate-400 transition hover:text-cyan-300">
                  Learning Hub
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-400 transition hover:text-cyan-300">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-400 transition hover:text-cyan-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-purple-300">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/resume" className="text-sm text-slate-400 transition hover:text-purple-300">
                  {lang === 'en' ? 'Resume' : 'Özgeçmiş'}
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="text-sm text-slate-400 transition hover:text-purple-300">
                  {lang === 'en' ? 'Certificates' : 'Sertifikalar'}
                </Link>
              </li>
              <li>
                <Link href="/ai-lab" className="text-sm text-slate-400 transition hover:text-purple-300">
                  AI Lab
                </Link>
              </li>
              <li>
                <a
                  href="/cv.pdf"
                  download="Gizem-Gulcu-CV.pdf"
                  className="text-sm text-slate-400 transition hover:text-purple-300"
                >
                  Download CV
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-blue-300">
              Connect
            </h3>
            <div className="space-y-3">
              <a
                href="https://github.com/zealcoder95"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-blue-300"
              >
                <span>→</span> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/gizemgulcu"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-blue-300"
              >
                <span>→</span> LinkedIn
              </a>
              <a
                href="https://www.kaggle.com/gizemglc"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-blue-300"
              >
                <span>→</span> Kaggle
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

        {/* Bottom */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-center text-sm text-slate-500 md:text-left">
            <p>© {currentYear} Gizem Gülcü. {t?.footer?.built || 'Built with Next.js'}</p>
          </div>
          <div className="flex justify-center gap-6 md:justify-end">
            <button className="text-xs text-slate-500 transition hover:text-slate-300">
              Privacy
            </button>
            <button className="text-xs text-slate-500 transition hover:text-slate-300">
              Terms
            </button>
            <button className="text-xs text-slate-500 transition hover:text-slate-300">
              Sitemap
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}