import { stats } from "@/data/stats";

export default function Dashboard({ lang }) {
  return (
    <section className="bg-slate-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.4em] text-cyan-300">
          ZealCoder Dashboard
        </p>

        <h2 className="mb-14 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
          {lang === "en" ? "Growth tracked like a" : "Gelişim bir"}{" "}
          <span className="bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
            {lang === "en" ? "real product." : "ürün gibi takip edilir."}
          </span>
        </h2>

        <div className="grid gap-6 md:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.label.en}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-cyan-300/40 hover:shadow-[0_0_45px_rgba(34,211,238,0.16)]"
            >
              <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl transition group-hover:bg-cyan-400/20" />

              <p className="relative mb-3 bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-5xl font-black text-transparent">
                {item.value}
              </p>

              <p className="relative text-slate-300">
                {item.label[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}