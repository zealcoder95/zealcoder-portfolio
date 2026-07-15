import Link from "next/link";

const heroCopy = {
  en: {
    eyebrow: "Gizem Gülcü · AI Engineering Journey",
    title: "Building toward AI Engineering, one real project at a time.",
    journey:
      "From Electrical & Electronics Engineering to programming, data, machine learning and AI Engineering—ZealCoder documents the work, questions and lessons along the way.",
    focusLabel: "Current focus",
    profilesLabel: "Follow the work",
    projectsLabel: "View Projects",
    learningLabel: "Learning Journey",
    continueLabel: "Continue to featured projects",
    status: [
      {
        label: "Currently learning",
        value: "Machine Learning & AI Engineering",
        href: "/learning",
      },
      {
        label: "Currently building",
        value: "A practical AI learning platform",
        href: "/ai-lab",
      },
      {
        label: "Latest project",
        value: "Renewable Energy & Climate Analysis",
        href: "/projects/renewable-energy",
      },
      {
        label: "Latest article",
        value: "Technical notes on Medium",
        href: "https://medium.com/@zealcoder",
        external: true,
      },
    ],
  },
  tr: {
    eyebrow: "Gizem Gülcü · AI Engineering Yolculuğu",
    title: "AI Engineering yolunda, gerçek projelerle ilerliyorum.",
    journey:
      "Elektrik-Elektronik Mühendisliğinden programlama, veri, makine öğrenmesi ve AI Engineering'e uzanan bu yolculuk; yapılan çalışmaları, soruları ve öğrenilenleri belgeliyor.",
    focusLabel: "Mevcut odak",
    profilesLabel: "Çalışmaları takip et",
    projectsLabel: "Projeleri Gör",
    learningLabel: "Öğrenme Yolculuğu",
    continueLabel: "Öne çıkan projelere devam et",
    status: [
      {
        label: "Şu anda öğreniliyor",
        value: "Makine Öğrenmesi ve AI Engineering",
        href: "/learning",
      },
      {
        label: "Şu anda geliştiriliyor",
        value: "Uygulamalı bir AI öğrenme platformu",
        href: "/ai-lab",
      },
      {
        label: "Son proje",
        value: "Yenilenebilir Enerji ve İklim Analizi",
        href: "/projects/renewable-energy",
      },
      {
        label: "Son yazılar",
        value: "Medium'da teknik notlar",
        href: "https://medium.com/@zealcoder",
        external: true,
      },
    ],
  },
};

const profiles = [
  { name: "GitHub", href: "https://github.com/zealcoder95" },
  { name: "Medium", href: "https://medium.com/@zealcoder" },
  { name: "Kaggle", href: "https://www.kaggle.com/gizemglc" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/gizemgulcu" },
];

export default function Hero({ lang }) {
  const copy = heroCopy[lang] || heroCopy.en;

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(34,211,238,0.08),transparent_24%),radial-gradient(circle_at_16%_80%,rgba(139,92,246,0.07),transparent_28%)]"
      />

      <div className="zc-container relative grid min-h-[calc(100svh-4rem)] items-center gap-12 px-6 pb-16 pt-32 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)] lg:gap-20 lg:pb-20">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 sm:text-sm">
            {copy.eyebrow}
          </p>

          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            {copy.title}
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {copy.journey}
          </p>

          <div className="mt-9 flex flex-wrap gap-3" aria-label="Primary actions">
            <Link
              href="/projects"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-200"
            >
              {copy.projectsLabel}
            </Link>
            <Link
              href="/learning"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 py-3 font-bold text-white transition duration-300 hover:border-cyan-300/50 hover:bg-white/5"
            >
              {copy.learningLabel}
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="text-slate-500">{copy.profilesLabel}</span>
            {profiles.map((profile) => (
              <a
                key={profile.name}
                href={profile.href}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-slate-300 underline decoration-white/20 underline-offset-4 transition hover:text-cyan-200 hover:decoration-cyan-300"
              >
                {profile.name}
              </a>
            ))}
          </div>
        </div>

        <aside className="border-t border-white/10 pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0" aria-label={copy.focusLabel}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            {copy.focusLabel}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {copy.status.map((item) => {
              const cardClass = "group block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 hover:border-cyan-300/30 hover:bg-white/[0.05]";
              const content = <><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{item.label}</p><p className="mt-3 text-base font-bold leading-6 text-white transition group-hover:text-cyan-100">{item.value}</p></>;

              return item.external ? (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className={cardClass}>
                  {content}
                </a>
              ) : (
                <Link key={item.label} href={item.href} className={cardClass}>
                  {content}
                </Link>
              );
            })}
          </div>
        </aside>

        <a href="#featured-projects" className="absolute bottom-6 left-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-cyan-200 lg:left-0">
          <span>{copy.continueLabel}</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
