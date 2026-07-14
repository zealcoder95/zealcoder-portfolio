'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Hero({ t }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 px-6 pt-20 pb-12 text-white md:pt-32">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.25),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.2),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.15),transparent_50%)]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />

      {/* Animated Circles */}
      <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/5 animate-[spin_60s_linear_infinite]" />
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-400/5 animate-[spin_40s_linear_infinite_reverse]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Badge */}
        <div className={`mb-8 inline-flex items-center gap-3 rounded-full border border-cyan-400/30 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 px-6 py-3 backdrop-blur-md transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.4em] text-cyan-300">
            ZealCoder Platform
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Main Heading */}
            <h1 className="mb-8 text-5xl font-black leading-tight md:text-6xl lg:text-7xl">
              Building{" "}
              <span className="relative inline-block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                intelligence
              </span>
              <br />
              one project at a time.
            </h1>

            {/* Description */}
            <p className="mb-12 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              {t?.hero?.text || "I combine data analysis, machine learning and engineering to solve real-world problems. Building projects, sharing knowledge, and growing toward becoming an AI Engineer."}
            </p>

            {/* CTA Buttons */}
            <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/projects"
                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 font-bold text-white shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/50 hover:-translate-y-1 active:translate-y-0"
              >
                <span>{t?.hero?.projectsButton || "Explore Projects"}</span>
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <Link
                href="/learning"
                className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-cyan-400/40 bg-white/5 px-8 py-4 font-bold text-cyan-300 backdrop-blur transition-all duration-300 hover:border-cyan-400/80 hover:bg-cyan-400/10 hover:-translate-y-1 active:translate-y-0"
              >
                <span>{t?.hero?.learningButton || "Learning Hub"}</span>
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div className="group rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-transparent p-6 backdrop-blur transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/15">
                <p className="text-2xl font-black text-cyan-300 md:text-3xl">4</p>
                <p className="mt-2 text-xs text-slate-400 md:text-sm">
                  Featured Case Studies
                </p>
              </div>

              <div className="group rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-400/10 to-transparent p-6 backdrop-blur transition-all duration-300 hover:border-purple-400/40 hover:bg-purple-400/15">
                <p className="text-2xl font-black text-purple-300 md:text-3xl">100%</p>
                <p className="mt-2 text-xs text-slate-400 md:text-sm">
                  Practical Learning
                </p>
              </div>

              <div className="group rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-400/10 to-transparent p-6 backdrop-blur transition-all duration-300 hover:border-blue-400/40 hover:bg-blue-400/15">
                <p className="text-2xl font-black text-blue-300 md:text-3xl">∞</p>
                <p className="mt-2 text-xs text-slate-400 md:text-sm">
                  Continuous Growth
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className={`relative flex items-center justify-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Glow Effect */}
            <div className="absolute h-[600px] w-[600px] bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />

            {/* Rotating Rings */}
            <div className="absolute h-[580px] w-[580px] animate-[spin_50s_linear_infinite] rounded-full border border-dashed border-cyan-400/15" />
            <div className="absolute h-[450px] w-[450px] animate-[spin_35s_linear_infinite_reverse] rounded-full border border-dashed border-purple-400/15" />
            <div className="absolute h-[320px] w-[320px] animate-[spin_25s_linear_infinite] rounded-full border border-dashed border-blue-400/15" />

            {/* Logo Container */}
            <div className="relative rounded-full border border-cyan-300/30 bg-gradient-to-br from-white/10 to-white/5 p-8 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl transition-all duration-500 hover:shadow-cyan-500/40 hover:border-cyan-300/50">
              <img
                src="/assets/zealcoder-logo.png"
                alt="ZealCoder Logo"
                className="h-64 w-64 rounded-full object-cover transition-all duration-500 hover:scale-110 md:h-72 md:w-72"
              />
            </div>

            {/* Info Cards */}
            <div className="absolute left-0 top-1/4 hidden rounded-xl border border-cyan-400/20 bg-slate-900/60 px-6 py-4 backdrop-blur-md lg:block animate-[float_6s_ease-in-out_infinite]">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Focus
              </p>
              <h4 className="mt-2 font-semibold text-white">
                Artificial Intelligence
              </h4>
            </div>

            <div className="absolute bottom-1/4 right-0 hidden rounded-xl border border-purple-400/20 bg-slate-900/60 px-6 py-4 backdrop-blur-md lg:block animate-[float_6s_ease-in-out_infinite_reverse]">
              <p className="text-xs font-bold uppercase tracking-wider text-purple-300">
                Stack
              </p>
              <h4 className="mt-2 font-semibold text-white">
                Python • ML • Data Science
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}