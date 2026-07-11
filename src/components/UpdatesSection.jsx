"use client";

import { useLanguage } from "@/context/LanguageContext";

const PLATFORM_STYLES = {
  github: {
    label: "GitHub",
    icon: "⌘",
    className:
      "border-purple-400/30 bg-purple-400/10 text-purple-200",
  },
  medium: {
    label: "Medium",
    icon: "M",
    className:
      "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
  kaggle: {
    label: "Kaggle",
    icon: "K",
    className:
      "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  },
  linkedin: {
    label: "LinkedIn",
    icon: "in",
    className:
      "border-blue-400/30 bg-blue-400/10 text-blue-200",
  },
  resource: {
    label: "Resource",
    icon: "R",
    className:
      "border-amber-400/30 bg-amber-400/10 text-amber-200",
  },
};

function formatDate(value, language) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    language === "tr" ? "tr-TR" : "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function getActionLabel(action, language) {
  const labels = {
    published: {
      tr: "Yayımlandı",
      en: "Published",
    },
    updated: {
      tr: "Güncellendi",
      en: "Updated",
    },
    added: {
      tr: "Eklendi",
      en: "Added",
    },
    removed: {
      tr: "Kaldırıldı",
      en: "Removed",
    },
    shared: {
      tr: "Paylaşıldı",
      en: "Shared",
    },
  };

  return (
    labels[action]?.[language] ||
    (language === "tr"
      ? "Yeni gelişme"
      : "New update")
  );
}

export default function UpdatesSection({
  updates = [],
}) {
  const { lang } = useLanguage();
  const language = lang === "tr" ? "tr" : "en";

  const copy = {
    tr: {
      eyebrow: "PLATFORM GÜNLÜĞÜ",
      title: "Son Gelişmeler",
      description:
        "Yeni projeler, GitHub güncellemeleri ve Medium yazıları.",
      empty:
        "Henüz gösterilecek yeni bir gelişme bulunmuyor.",
      open: "İncele",
      allUpdates: "Tüm gelişmeleri görüntüle",
    },
    en: {
      eyebrow: "PLATFORM JOURNAL",
      title: "Latest Updates",
      description:
        "New projects, GitHub activity, and Medium articles.",
      empty: "There are no recent updates to display.",
      open: "View",
      allUpdates: "View all updates",
    },
  };

  const text = copy[language];

  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.12),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.1),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">
              {text.eyebrow}
            </p>

            <h2 className="mt-4 text-3xl font-black md:text-5xl">
              {text.title}
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-400">
              {text.description}
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-bold text-emerald-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
            Live feed
          </span>
        </div>

        {updates.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-slate-400">
            {text.empty}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {updates.map((update, index) => {
              const platform =
                PLATFORM_STYLES[update.platform] ||
                PLATFORM_STYLES.resource;

              return (
                <a
                  key={update.id}
                  href={update.url}
                  target={
                    update.url?.startsWith("http")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    update.url?.startsWith("http")
                      ? "noreferrer"
                      : undefined
                  }
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.06]"
                >
                  {index === 0 && (
                    <span className="absolute right-4 top-4 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-200">
                      New
                    </span>
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-black ${platform.className}`}
                    >
                      {platform.icon}
                    </div>

                    <div className="min-w-0 pr-12">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-bold text-slate-300">
                          {platform.label}
                        </span>

                        <span className="text-slate-600">
                          •
                        </span>

                        <span className="text-slate-500">
                          {getActionLabel(
                            update.action,
                            language
                          )}
                        </span>

                        <span className="text-slate-600">
                          •
                        </span>

                        <time className="text-slate-500">
                          {formatDate(
                            update.date,
                            language
                          )}
                        </time>
                      </div>

                      <h3 className="mt-3 text-lg font-black text-white transition group-hover:text-cyan-200">
                        {update.title}
                      </h3>

                      {update.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                          {update.description}
                        </p>
                      )}

                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-cyan-300">
                        {text.open}
                        <span className="transition group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}