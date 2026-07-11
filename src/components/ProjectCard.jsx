"use client";

export default function ProjectCard({
  title,
  summary,
  category,
  technologies = [],
  skills = [],
  githubUrl,
  kaggleUrl,
  homepage,
  cover,
  featured = false,
  stars = 0,
  lang = "en",
}) {
  const normalizedLanguage =
    String(lang)
      .toLocaleLowerCase("tr")
      .trim();

  const isTurkish =
    normalizedLanguage.startsWith("tr");

  const labels = {
    fallbackCategory: isTurkish
      ? "Proje"
      : "Project",

    featured: isTurkish
      ? "Öne Çıkan"
      : "Featured",

    technologies: isTurkish
      ? "Teknolojiler"
      : "Technologies",

    skills: isTurkish
      ? "Gösterilen Beceriler"
      : "Demonstrated Skills",

    github: isTurkish
      ? "GitHub’da Görüntüle"
      : "View on GitHub",

    kaggle: isTurkish
      ? "Kaggle’da Görüntüle"
      : "View on Kaggle",

    demo: isTurkish
      ? "Canlı Demoyu Aç"
      : "Open Live Demo",
  };

  const visibleTechnologies =
    technologies.slice(0, 7);

  const visibleSkills =
    skills.slice(0, 4);

  return (
    <article className="my-4 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.06]">
      {cover && (
        <img
          src={cover}
          alt={title}
          className="h-44 w-full object-cover"
        />
      )}

      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-purple-300">
              {category ||
                labels.fallbackCategory}
            </p>

            <h3 className="mt-2 text-xl font-black text-white">
              {title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {featured && (
              <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-300">
                {labels.featured}
              </span>
            )}

            {stars > 0 && (
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300">
                ★ {stars}
              </span>
            )}
          </div>
        </div>

        {summary && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
            {summary}
          </p>
        )}

        {visibleTechnologies.length >
          0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              {labels.technologies}
            </p>

            <div className="flex flex-wrap gap-2">
              {visibleTechnologies.map(
                (technology) => (
                  <span
                    key={technology}
                    className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-slate-300"
                  >
                    {technology}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {visibleSkills.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              {labels.skills}
            </p>

            <ul className="space-y-2 text-sm text-slate-300">
              {visibleSkills.map(
                (skill) => (
                  <li
                    key={skill}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-0.5 text-cyan-300">
                      ✓
                    </span>

                    <span>{skill}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="zeal-button-gradient rounded-full px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-1"
            >
              {labels.github}
            </a>
          )}

          {kaggleUrl && (
            <a
              href={kaggleUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-cyan-300/40 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:-translate-y-1 hover:bg-cyan-300/10"
            >
              {labels.kaggle}
            </a>
          )}

          {homepage && (
            <a
              href={homepage}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-purple-300/40 px-4 py-2 text-sm font-bold text-purple-300 transition hover:-translate-y-1 hover:bg-purple-300/10"
            >
              {labels.demo}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}