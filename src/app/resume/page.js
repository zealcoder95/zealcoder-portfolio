import Link from "next/link";

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-32 text-white">
      <div className="mx-auto max-w-5xl">

        <p className="mb-3 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
          Resume
        </p>

        <h1 className="mb-10 text-6xl font-black">
          Gizem Gülcü
        </h1>

        <div className="grid gap-8">

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-5 text-2xl font-black">
              Professional Summary
            </h2>

            <p className="leading-8 text-slate-300">
              Electrical and Electronics Engineering graduate building a career
              in Data Science and AI Engineering. Focused on Python, SQL,
              machine learning and practical analytical systems.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-5 text-2xl font-black">
              Core Skills
            </h2>

            <div className="flex flex-wrap gap-3">
              {[
                "Python",
                "SQL",
                "Pandas",
                "NumPy",
                "Power BI",
                "Machine Learning",
                "Git",
                "GitHub",
                "Next.js",
                "React",
                "LLM",
                "RAG"
              ].map(skill => (
                <span
                  key={skill}
                  className="rounded-full bg-cyan-400/10 px-4 py-2 text-cyan-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-5 text-2xl font-black">
              Education
            </h2>

            <p className="text-slate-300">
              Electrical and Electronics Engineering
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-5 text-2xl font-black">
              Portfolio
            </h2>

            <Link
              href="/projects"
              className="font-bold text-cyan-300"
            >
              View Projects →
            </Link>
          </section>

          <section className="text-center">

            <a
              href="/cv.pdf"
              download
              className="inline-flex rounded-full bg-linear-to-r from-purple-600 to-cyan-500 px-8 py-4 font-bold"
            >
              Download CV
            </a>

          </section>

        </div>

      </div>
    </main>
  );
}
