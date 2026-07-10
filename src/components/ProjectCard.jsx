import Link from "next/link";

export default function ProjectCard({ project, lang, t }) {
  return (
    <article className="group relative overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-cyan-400/40 hover:shadow-[0_0_45px_rgba(34,211,238,.18)]">
      <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-purple-500/20" />

      <div className="relative">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
          {project.category[lang]}
        </p>

        <h3 className="mb-5 text-3xl font-black leading-tight">
          {project.title[lang]}
        </h3>

        <p className="mb-8 leading-7 text-slate-300">
          {project.description[lang]}
        </p>

        <div className="mb-6 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-purple-300">
            Problem
          </p>
          <p className="text-sm leading-6 text-slate-300">
            {project.problem[lang]}
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
            Outcome
          </p>
          <p className="text-sm leading-6 text-slate-300">
            {project.outcome[lang]}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {project.tech.map((item) => (
            <span
              key={item}
              className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-6">
          <a
            href={project.links.github}
            target="_blank"
            className="font-semibold text-cyan-300 transition hover:text-white"
          >
            {t.projects.github} →
          </a>

          <a
            href={project.links.kaggle}
            target="_blank"
            className="font-semibold text-purple-300 transition hover:text-white"
          >
            {t.projects.kaggle} →
          </a>

          <Link
            href={`/projects/${project.id}`}
            className="font-semibold text-white transition hover:text-cyan-300"
          >
            {lang === "en" ? "View Case Study →" : "Vaka Çalışmasını Gör →"}
          </Link>
        </div>
      </div>
    </article>
  );
}