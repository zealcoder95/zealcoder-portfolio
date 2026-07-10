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
    { href: "/about", label: t.nav.about },
    { href: "/projects", label: t.nav.projects },
    { href: "/learning", label: t.nav.learning },
    { href: "/ai-lab", label: "AI Lab" },
    { href: "/contact", label: t.nav.contact },
  ];

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-slate-950/75 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex min-w-0 items-center gap-3"
        >
          <img
            src="/assets/zealcoder-logo.png"
            alt="ZealCoder"
            className="h-10 w-10 shrink-0 rounded-full transition duration-500 group-hover:rotate-6 group-hover:scale-110 sm:h-12 sm:w-12"
          />

          <div className="min-w-0">
            <h1 className="truncate bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-lg font-black tracking-[0.18em] text-transparent sm:text-2xl sm:tracking-[0.22em]">
              ZEALCODER
            </h1>

            <p className="hidden text-[10px] tracking-[0.28em] text-slate-500 sm:block">
              PERSONAL TECHNOLOGY PLATFORM
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 lg:flex">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-cyan-300/10 text-cyan-300"
                    : "text-slate-300 hover:bg-cyan-300/10 hover:text-cyan-300"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={toggleLang}
            className="rounded-full border border-cyan-300/40 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:bg-cyan-300/10"
          >
            {lang === "en" ? "TR" : "EN"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-cyan-300/40 hover:text-cyan-300 lg:hidden"
        >
          <span className="sr-only">
            {menuOpen ? "Close menu" : "Open menu"}
          </span>

          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 bg-current transition ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />

            <span
              className={`block h-0.5 w-5 bg-current transition ${
                menuOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`block h-0.5 w-5 bg-current transition ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-5 backdrop-blur-2xl lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`rounded-2xl px-4 py-3 text-base font-medium transition ${
                    isActive
                      ? "bg-cyan-300/10 text-cyan-300"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
              <span className="text-sm text-slate-400">
                {lang === "en" ? "Language" : "Dil"}
              </span>

              <button
                type="button"
                onClick={toggleLang}
                className="rounded-full border border-cyan-300/40 px-4 py-2 text-sm font-bold text-cyan-300"
              >
                {lang === "en" ? "TR" : "EN"}
              </button>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
              <a
                href="https://github.com/zealcoder95"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center text-sm text-slate-300"
              >
                GitHub
              </a>

              <a
                href="https://www.kaggle.com/gizemglc"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center text-sm text-slate-300"
              >
                Kaggle
              </a>

              <a
                href="https://www.linkedin.com/in/gizemgulcu"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center text-sm text-slate-300"
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