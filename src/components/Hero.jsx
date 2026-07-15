import Link from "next/link";

export default function Hero({ t }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 px-6 pt-36 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.15),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10" />
      <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-400/10" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl items-center gap-20 lg:grid-cols-2">
        <div>
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-5 py-2 backdrop-blur"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" /><span className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">ZEALCODER PLATFORM</span></div>
          <h1 className="mb-8 text-5xl font-black leading-[1.05] md:text-7xl">Building <span className="zeal-text-gradient">intelligence</span><br />one project at a time.</h1>
          <p className="mb-10 max-w-2xl text-lg leading-8 text-slate-300">{t.hero.text}</p>
          <div className="mb-14 flex flex-wrap gap-4">
            <Link href="/projects" className="zeal-button-gradient rounded-full px-8 py-4 font-bold text-white shadow-xl shadow-cyan-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-cyan-500/40">{t.hero.projectsButton}</Link>
            <Link href="/learning" className="rounded-full border border-cyan-300/30 bg-white/5 px-8 py-4 font-bold text-cyan-300 backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-cyan-400/10">{t.hero.learningButton}</Link>
          </div>
          <div className="grid max-w-xl grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"><h3 className="text-3xl font-black text-cyan-300">4</h3><p className="mt-2 text-sm text-slate-400">Featured Case Studies</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"><h3 className="text-3xl font-black text-purple-300">100%</h3><p className="mt-2 text-sm text-slate-400">Practical Learning</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"><h3 className="text-3xl font-black text-cyan-300">∞</h3><p className="mt-2 text-sm text-slate-400">Continuous Growth</p></div>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="zeal-glow-gradient absolute h-[560px] w-[560px] animate-pulse rounded-full blur-3xl" />
          <div className="absolute h-[520px] w-[520px] animate-[spin_40s_linear_infinite] rounded-full border border-dashed border-cyan-400/20" />
          <div className="absolute h-[420px] w-[420px] animate-[spin_28s_linear_infinite_reverse] rounded-full border border-dashed border-purple-400/20" />
          <div className="relative rounded-full border border-cyan-300/20 bg-white/5 p-6 shadow-[0_0_80px_rgba(34,211,238,0.18)] backdrop-blur-xl"><img src="/assets/zealcoder-logo.png" alt="ZealCoder Logo" className="h-80 w-80 rounded-full object-cover transition duration-500 hover:scale-105 md:h-96 md:w-96" /></div>
          <div className="absolute left-0 top-16 hidden rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-4 backdrop-blur lg:block"><p className="text-xs uppercase tracking-widest text-cyan-300">Focus</p><h4 className="mt-2 font-bold">Artificial Intelligence</h4></div>
          <div className="absolute bottom-16 right-0 hidden rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-4 backdrop-blur lg:block"><p className="text-xs uppercase tracking-widest text-purple-300">Stack</p><h4 className="mt-2 font-bold">Python • ML • Data Science</h4></div>
        </div>
      </div>
    </section>
  );
}
