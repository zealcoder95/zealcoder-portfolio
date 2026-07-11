"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const PLATFORM_STYLES = {
  github: {
    label: "GitHub",
    icon: "GH",
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
  website: {
    label: "ZealCoder",
    icon: "Z",
    className:
      "border-pink-400/30 bg-pink-400/10 text-pink-200",
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
      month: "long",
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
    (language === "tr" ? "Yeni gelişme" : "New update")
  );
}

export default function UpdatesPageContent({
  updates = [],
}) {
  const { lang } = useLanguage();
  const language = lang === "tr" ? "tr" : "en";
  const [activePlatform, setActivePlatform] =
    useState("all");

  const copy = {
    tr: {
      eyebrow: "ZEALCODER PLATFORM GÜNLÜĞÜ",
      title: "Tüm Gelişmeler",
      description:
        "Projeler, yazılar, notebook’lar ve ZealCoder platformundaki son değişiklikler.",
      back: "Ana sayfaya dön",
      all: "Tümü",
      empty:
        "Bu kategori için henüz bir gelişme bulunmuyor.",
      open: "İncele",
      live: "Canlı akış",
      total: "gelişme",
    },
    en: {
      eyebrow: "ZEALCODER PLATFORM JOURNAL",
      title: "All Updates",
      description:
        "Projects, articles, notebooks, and the latest changes across the ZealCoder platform.",
      back: "Back to home",
      all: "All",
      empty:
        "There are no updates in this category yet.",
      open: "View",
      live: "Live feed",
      total: "updates",
    },
  };

  const text = copy[language];

  const availablePlatforms = useMemo(() => {
    return [
      ...new Set(
        updates
          .map((update) => update.platform)
          .filter(Boolean)
      ),
    ];
  }, [updates]);

  const filteredUpdates = useMemo(() => {
    if (activePlatform === "all") {
      return updates;
    }

    return updates.filter(
      (update) =>
        update.platform === activePlatform
    );
  }, [activePlatform, updates]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-28 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:gap-3 hover:text-white"
        >
          <span>←</span>
          {text.back}
        </Link>

        <div className="mt-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">
              {text.eyebrow}
            </p>

            <h1 className="mt-4 text-4xl font-black md:text-7xl">
              {text.title}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">
              {text.description}
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-5 py-3">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300" />

            <span className="text-sm font-bold text-emerald-200">
              {text.live}
            </span>

            <span className="text-sm text-emerald-200/60">
              {updates.length} {text.total}
            </span>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActivePlatform("all")}
            className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
              activePlatform === "all"
                ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-200"
                : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
            }`}
          >
            {text.all}
          </button>

          {availablePlatforms.map((platformName) => {
            const platform =
              PLATFORM_STYLES[platformName] ||
              PLATFORM_STYLES.resource;

            return (
              <button
                key={platformName}
                type="button"
                onClick={() =>
                  setActivePlatform(platformName)
                }
                className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                  activePlatform === platformName
                    ? platform.className
                    : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {platform.label}
              </button>
            );
          })}
        </div>

        {filteredUpdates.length === 0 ? (
          <div className="mt-12 rounded-[32px] border border-white/10 bg-white/[0.03] p-10 text-slate-400">
            {text.empty}
          </div>
        ) : (
          <div className="relative mt-14">
            <div className="absolute bottom-0 left-[23px] top-0 hidden w-px bg-linear-to-b from-cyan-300/50 via-purple-400/30 to-transparent md:block" />

            <div className="space-y-5">
              {filteredUpdates.map(
                (update, index) => {
                  const platform =
                    PLATFORM_STYLES[
                      update.platform
                    ] ||
                    PLATFORM_STYLES.resource;

                  return (
                    <article
                      key={update.id}
                      className="group relative md:pl-16"
                    >
                      <div
                        className={`absolute left-0 top-7 z-10 hidden h-12 w-12 items-center justify-center rounded-2xl border text-xs font-black md:flex ${platform.className}`}
                      >
                        {platform.icon}
                      </div>

                      <a
                        href={update.url}
                        target={
                          update.url?.startsWith(
                            "http"
                          )
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          update.url?.startsWith(
                            "http"
                          )
                            ? "noreferrer"
                            : undefined
                        }
                        className="block rounded-[30px] border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.06]"
                      >
                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="font-bold text-slate-200">
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

                            <h2 className="mt-3 text-xl font-black text-white transition group-hover:text-cyan-200 md:text-2xl">
                              {update.title}
                            </h2>

                            {update.description && (
                              <p className="mt-3 max-w-4xl leading-7 text-slate-400">
                                {update.description}
                              </p>
                            )}
                          </div>

                          {index === 0 &&
                            activePlatform === "all" && (
                              <span className="w-fit shrink-0 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-200">
                                New
                              </span>
                            )}
                        </div>

                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-300">
                          {text.open}

                          <span className="transition group-hover:translate-x-1">
                            →
                          </span>
                        </span>
                      </a>
                    </article>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}