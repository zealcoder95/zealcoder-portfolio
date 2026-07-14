'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero({ t }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),transparent_25%),radial-gradient(circle_at_100%_50%,rgba(139,92,246,0.12),transparent_25%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className={`space-y-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-cyan-300">
              AI · Data · Engineering
            </span>

            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-black leading-tight sm:text-6xl">
                Building clear, professional data products for modern teams.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                {t?.hero?.text ||
                  "I turn data into intelligent insights, clean dashboards, and production-ready analytics for real business impact."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Explore Projects
              </Link>
              <Link
                href="/learning"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10"
              >
                Learning Hub
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-center">
                <p className="text-3xl font-black text-white">4</p>
                <p className="mt-2 text-sm text-slate-400">Featured Case Studies</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-center">
                <p className="text-3xl font-black text-white">100%</p>
                <p className="mt-2 text-sm text-slate-400">Practical Learning</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 text-center">
                <p className="text-3xl font-black text-white">∞</p>
                <p className="mt-2 text-sm text-slate-400">Continuous Growth</p>
              </div>
            </div>
          </div>

          <div className={`relative flex justify-center transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
            <div className="relative flex h-[360px] w-[360px] items-center justify-center rounded-full border border-white/10 bg-slate-900/70 shadow-[0_20px_80px_rgba(14,165,233,0.15)]">
              <img
                src="/assets/zealcoder-logo.png"
                alt="ZealCoder"
                className="h-44 w-44 rounded-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 rounded-full border border-cyan-300/10" />
              <div className="pointer-events-none absolute inset-12 rounded-full border border-purple-400/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}