"use client";

export default function ProjectCard({
  title,
  technologies = [],
  githubUrl,
  kaggleUrl,
  featured = false,
}) {
  return (
    <div className="my-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-purple-300">
            Project
          </p>

          <h3 className="mt-2 text-xl font-black text-white">
            {title}
          </h3>
        </div>

        {featured && (
          <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-300">
            Featured
          </span>
        )}
      </div>

      {technologies.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <span
              key={technology}
              className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300"
            >
              {technology}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-1"
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
      </div>
    </div>
  );
}