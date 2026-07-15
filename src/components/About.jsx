export default function About({ t }) {
  return (
    <section id="about" className="bg-slate-950 px-6 py-28 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.4em] text-cyan-300">
          {t.about.kicker}
        </p>

        <h1 className="mb-10 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
          {t.about.title}
        </h1>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 leading-8 text-slate-300 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
            <p>{t.about.p1}</p>
            <p className="mt-5">{t.about.p2}</p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-purple-300">
              Current Focus
            </p>

            <div className="space-y-5">
              {[
                {
                  title: "Data Science",
                  text: "Cleaning, exploring and analyzing real-world datasets to answer concrete questions.",
                },
                {
                  title: "Machine Learning",
                  text: "Building and evaluating predictive models, from classic regression to ensemble methods.",
                },
                {
                  title: "Power BI & SQL",
                  text: "Turning raw tables into dashboards and queries that support clear, data-driven decisions.",
                },
                {
                  title: "AI Engineering",
                  text: "Exploring LLMs, RAG pipelines and AI agents to build production-ready intelligent systems.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="font-bold text-cyan-300">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-400">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[32px] border border-cyan-300/20 bg-linear-to-r from-purple-500/10 to-cyan-400/10 p-8 backdrop-blur-xl">
          <h2 className="mb-4 text-3xl font-black">
            Building Intelligence. One Project at a Time.
          </h2>
          <p className="max-w-3xl text-slate-300">
            ZealCoder is where I turn learning into projects, projects into experience,
            and experience into a long-term AI Engineering journey.
          </p>
        </div>
      </div>
    </section>
  );
}