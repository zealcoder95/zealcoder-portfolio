import Link from "next/link";
import { getSocialLinks } from "@/content/settings";

const heroCopy = {
  en: {
    eyebrow: "Gizem Gülcü · AI Engineering Journey",
    title: "Building toward AI Engineering, one real project at a time.",
    journey:
      "From Electrical & Electronics Engineering to programming, data, machine learning and AI Engineering—ZealCoder documents the work, questions and lessons along the way.",
    profilesLabel: "Follow the work",
    projectsLabel: "View Projects",
    learningLabel: "Learning Journey",
    continueLabel: "Explore current focus",
  },
  tr: {
    eyebrow: "Gizem Gülcü · AI Engineering Yolculuğu",
    title: "AI Engineering yolunda, gerçek projelerle ilerliyorum.",
    journey:
      "Elektrik-Elektronik Mühendisliğinden programlama, veri, makine öğrenmesi ve AI Engineering'e uzanan bu yolculuk; yapılan çalışmaları, soruları ve öğrenilenleri belgeliyor.",
    profilesLabel: "Çalışmaları takip et",
    projectsLabel: "Projeleri Gör",
    learningLabel: "Öğrenme Yolculuğu",
    continueLabel: "Mevcut odağı keşfet",
  },
};

export default function Hero({ lang }) {
  const copy = heroCopy[lang] || heroCopy.en;
  const profiles = getSocialLinks().filter((link) => link.platform !== "email");

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(34,211,238,0.08),transparent_24%),radial-gradient(circle_at_16%_80%,rgba(139,92,246,0.07),transparent_28%)]" />

      <div className="zc-container relative flex min-h-[calc(100svh-4rem)] items-center px-6 pb-16 pt-32 lg:pb-20">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 sm:text-sm">{copy.eyebrow}</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">{copy.title}</h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">{copy.journey}</p>

          <div className="mt-9 flex flex-wrap gap-3" aria-label="Primary actions">
            <Link href="/projects" className="inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-200">{copy.projectsLabel}</Link>
            <Link href="/learning" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 py-3 font-bold text-white transition duration-300 hover:border-cyan-300/50 hover:bg-white/5">{copy.learningLabel}</Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="text-slate-500">{copy.profilesLabel}</span>
              {profiles.map((profile) => <a key={profile.id} href={profile.url} target="_blank" rel="noreferrer" className="font-semibold text-slate-300 underline decoration-white/20 underline-offset-4 transition hover:text-cyan-200 hover:decoration-cyan-300">{profile.label}</a>)}
          </div>
        </div>

        <a href="#current-focus" className="absolute bottom-6 left-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-cyan-200 lg:left-0"><span>{copy.continueLabel}</span><span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
