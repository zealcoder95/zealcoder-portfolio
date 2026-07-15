import { getAiLabExperiments } from "@/content/aiLab";
import SectionHeader from "@/components/SectionHeader";

export default function AILab({ lang }) {
  const aiLab = getAiLabExperiments();
  return (
    <section className="bg-slate-900 px-6 py-24 text-white">
      <div className="zc-container">
        <SectionHeader
          kicker={lang === "en" ? "AI Lab" : "AI Laboratuvarı"}
          title={lang === "en" ? "Future Experiments" : "Gelecek Deneyler"}
          text={
            lang === "en"
              ? "A space for future AI Engineering experiments, LLM projects and intelligent systems."
              : "Gelecekteki AI Engineering denemeleri, LLM projeleri ve akıllı sistemler için özel alan."
          }
        />

        <div className="grid gap-6 md:grid-cols-3">
          {aiLab.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-purple-400/20 bg-white/5 p-7 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-cyan-400/40"
            >
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-purple-300">
                {item.status[lang]}
              </p>

              <h3 className="mb-4 text-2xl font-black">{item.title}</h3>

              <p className="text-slate-300">{item.description[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
