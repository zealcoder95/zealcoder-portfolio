export default function Hero({ t }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 px-6 pt-36 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.25),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.22),transparent_32%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.14),transparent_35%)]" />

      <div className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-400/10" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl items-center gap-16 lg:grid-cols-2">
        <div>
          <p className="mb-5 text-sm font-black uppercase tracking-[0.45em] text-cyan-300">
            ZEALCODER PLATFORM
          </p>

          <h1 className="mb-7 text-5xl font-black leading-tight md:text-7xl">
            Building{" "}
            <span className="bg-linear-to-r/srgb from-purple-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              intelligence
            </span>
            <br />
            one project at a time.
          </h1>

          <p className="mb-8 max-w-2xl text-lg leading-8 text-slate-300">
            {t.hero.text}
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/projects"
              className="rounded-full bg-linear-to-r/srgb from-purple-600 to-cyan-500 px-7 py-4 font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-1"
            >
              {t.hero.projectsButton}
            </a>

            <a
              href="/learning"
              className="rounded-full border border-cyan-300/40 bg-white/5 px-7 py-4 font-bold text-cyan-300 transition hover:-translate-y-1 hover:bg-cyan-300/10"
            >
              {t.hero.learningButton}
            </a>
          </div>
        </div>

        <div className="relative flex flex-col items-center">
          <div className="absolute h-[520px] w-[520px] animate-pulse rounded-full bg-linear-to-r/srgb from-purple-600/25 to-cyan-400/25 blur-3xl" />

          <div className="relative rounded-full border border-cyan-300/20 bg-white/5 p-6 shadow-2xl shadow-cyan-500/20 backdrop-blur-xl">
            <img
              src="/assets/zealcoder-logo.png"
              alt="ZealCoder Logo"
              className="h-80 w-80 rounded-full object-cover drop-shadow-[0_0_45px_rgba(34,211,238,0.38)] transition duration-500 hover:scale-105 md:h-96 md:w-96"
            />
          </div>
        </div>
      </div>
    </section>
  );
}