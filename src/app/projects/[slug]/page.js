import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getGitHubProject } from "@/lib/github";

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const project = await getGitHubProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 pb-24 pt-32 text-white">
      <article className="mx-auto max-w-5xl">
        <Link
          href="/projects"
          className="mb-10 inline-block font-bold text-cyan-300 transition hover:text-white"
        >
          ← Back to Projects
        </Link>

        <div className="mb-10 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-purple-300/20 bg-purple-400/10 px-4 py-2 text-sm font-bold text-purple-300">
            {project.category}
          </span>

          {project.featured && (
            <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300">
              Featured
            </span>
          )}
        </div>

        <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
          {project.title}
        </h1>

        <p className="mb-8 max-w-4xl text-xl leading-9 text-slate-300">
          {project.summary}
        </p>

        <div className="mb-12 flex flex-wrap gap-3">
          {project.language && (
            <span className="rounded-full bg-white/5 px-4 py-2 text-slate-300">
              {project.language}
            </span>
          )}

          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-cyan-400/10 px-4 py-2 text-cyan-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mb-12 flex flex-wrap gap-5">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 font-bold text-white"
          >
            View on GitHub
          </a>

          {project.kaggleUrl && (
            <a
              href={project.kaggleUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-purple-300/40 px-6 py-3 font-bold text-purple-300"
            >
              View on Kaggle
            </a>
          )}

          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-cyan-300/40 px-6 py-3 font-bold text-cyan-300"
            >
              Live Demo
            </a>
          )}
        </div>

        <section className="rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl md:p-10">
          {project.readme ? (
            <div className="space-y-6 leading-8 text-slate-300">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h2 className="mt-10 text-4xl font-black text-white">
                      {children}
                    </h2>
                  ),

                  h2: ({ children }) => (
                    <h2 className="mt-10 text-3xl font-black text-white">
                      {children}
                    </h2>
                  ),

                  h3: ({ children }) => (
                    <h3 className="mt-8 text-2xl font-bold text-cyan-300">
                      {children}
                    </h3>
                  ),

                  p: ({ children }) => (
                    <p className="leading-8 text-slate-300">{children}</p>
                  ),

                  ul: ({ children }) => (
                    <ul className="list-disc space-y-2 pl-6 text-slate-300">
                      {children}
                    </ul>
                  ),

                  ol: ({ children }) => (
                    <ol className="list-decimal space-y-2 pl-6 text-slate-300">
                      {children}
                    </ol>
                  ),

                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-cyan-300 underline underline-offset-4"
                    >
                      {children}
                    </a>
                  ),

                  img: ({ src, alt }) => {
                    const isAbsolute =
                      src?.startsWith("http://") ||
                      src?.startsWith("https://");

                    const cleanSrc = src?.replace(/^\.\//, "");

                    const imageUrl = isAbsolute
                      ? src
                      : `https://raw.githubusercontent.com/zealcoder95/${project.slug}/${project.defaultBranch}/${cleanSrc}`;

                    return (
                      <img
                        src={imageUrl}
                        alt={alt || project.title}
                        className="my-8 w-full rounded-2xl border border-white/10"
                        loading="lazy"
                      />
                    );
                  },

                  code: ({ children }) => (
                    <code className="rounded bg-black/40 px-2 py-1 text-purple-300">
                      {children}
                    </code>
                  ),

                  pre: ({ children }) => (
                    <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/50 p-5">
                      {children}
                    </pre>
                  ),

                  table: ({ children }) => (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-white/10">
                        {children}
                      </table>
                    </div>
                  ),

                  th: ({ children }) => (
                    <th className="border border-white/10 bg-white/5 p-3 text-left text-cyan-300">
                      {children}
                    </th>
                  ),

                  td: ({ children }) => (
                    <td className="border border-white/10 p-3">
                      {children}
                    </td>
                  ),
                }}
              >
                {project.readme}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-slate-400">
              A detailed README has not been added to this repository yet.
            </p>
          )}
        </section>
      </article>
    </main>
  );
}