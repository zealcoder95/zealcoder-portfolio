export default function CurrentFocus() {
  return (
    <section className="bg-slate-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl rounded-[36px] border border-cyan-400/20 bg-gradient-to-r from-slate-900 to-slate-950 p-12">

        <p className="mb-3 text-sm font-black uppercase tracking-[0.35em] text-cyan-300">
          CURRENT FOCUS
        </p>

        <h2 className="mb-6 text-5xl font-black">
          Becoming an AI Engineer.
        </h2>

        <p className="max-w-3xl text-lg leading-8 text-slate-300">
          I am currently focused on building production-ready data science
          projects, strengthening my machine learning knowledge and exploring
          modern AI technologies such as LLMs, RAG systems and AI Agents.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {[
            "Python",
            "SQL",
            "Power BI",
            "Machine Learning",
            "Deep Learning",
            "LLMs",
            "RAG",
            "AI Agents",
          ].map((item) => (
            <span
              key={item}
              className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-cyan-300"
            >
              {item}
            </span>
          ))}
        </div>

      </div>
    </section>
  );
}