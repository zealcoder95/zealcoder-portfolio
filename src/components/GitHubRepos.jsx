"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function GitHubRepos() {
  const { lang } = useLanguage();

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRepos() {
      try {
        const response = await fetch(
          "https://api.github.com/users/zealcoder95/repos?sort=updated&per_page=6",
          {
            headers: {
              Accept: "application/vnd.github+json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("GitHub repositories could not be loaded.");
        }

        const data = await response.json();

        setRepos(data.filter((repo) => !repo.fork));
      } catch {
        setError(
          lang === "en"
            ? "GitHub repositories could not be loaded."
            : "GitHub repoları yüklenemedi."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRepos();
  }, [lang]);

  return (
    <section className="bg-slate-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.4em] text-cyan-300">
          GitHub
        </p>

        <h2 className="mb-5 text-4xl font-black md:text-6xl">
          {lang === "en" ? "Latest repositories." : "Son repolarım."}
        </h2>

        <p className="mb-14 max-w-3xl text-slate-300">
          {lang === "en"
            ? "Public repositories fetched directly from my GitHub profile."
            : "GitHub profilimden doğrudan alınan herkese açık repolar."}
        </p>

        {loading && (
          <p className="text-cyan-300">
            {lang === "en"
              ? "Loading GitHub repositories..."
              : "GitHub repoları yükleniyor..."}
          </p>
        )}

        {error && <p className="text-red-300">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <article
                key={repo.id}
                className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-[0_0_35px_rgba(34,211,238,0.14)]"
              >
                <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-purple-500/20" />

                <div className="relative">
                  <h3 className="mb-4 break-words text-2xl font-black">
                    {repo.name}
                  </h3>

                  <p className="mb-6 min-h-20 text-slate-300">
                    {repo.description ||
                      (lang === "en"
                        ? "Project description coming soon."
                        : "Proje açıklaması yakında eklenecek.")}
                  </p>

                  <div className="mb-6 flex flex-wrap gap-3 text-sm">
                    {repo.language && (
                      <span className="rounded-full bg-purple-400/10 px-3 py-1 text-purple-300">
                        {repo.language}
                      </span>
                    )}

                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-300">
                      ★ {repo.stargazers_count}
                    </span>

                    <span className="rounded-full bg-white/5 px-3 py-1 text-slate-300">
                      Forks: {repo.forks_count}
                    </span>
                  </div>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-cyan-300 transition hover:text-white"
                  >
                    {lang === "en"
                      ? "View Repository →"
                      : "Repoyu Gör →"}
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}