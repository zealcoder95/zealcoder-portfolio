"use client";

export default function ProjectCard({
  title,
  summary,
  category,
  technologies = [],
  githubUrl,
  kaggleUrl,
  homepage,
  cover,
  featured = false,
  stars = 0,
}) {
  return (
    <article className="my-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30">
      {cover && (
        <img
          src={cover}
          alt={title}
          className="h-40 w-full object-cover"
        />
      )}

      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-purple-300">
              {category || "Project"}
            </p>

            <h3 className="mt-2 text-xl font-black text-white">
              {title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {featured && (
              <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-300">
                Featured
              </span>
            )}

            {stars > 0 && (
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">
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

        {technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {technologies.slice(0, 7).map(
              (technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300"
                >
                  {technology}
                </span>
              )
            )}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-linear-to-r from-purple-600 to-cyan-500 px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-1"
            >
              GitHub
            </a>
          )}

          {kaggleUrl && (
            <a
              href={kaggleUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-cyan-300/40 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:-translate-y-1 hover:bg-cyan-300/10"
            >
              Kaggle
            </a>
          )}

          {homepage && (
            <a
              href={homepage}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-purple-300/40 px-4 py-2 text-sm font-bold text-purple-300 transition hover:-translate-y-1 hover:bg-purple-300/10"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}