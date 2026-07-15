import { resources } from "@/data/resources";
import SectionHeader from "@/components/SectionHeader";

export default function Resources({ lang }) {
  return (
    <section className="bg-slate-950 px-6 py-24 text-white">
      <div className="zc-container">
        <SectionHeader
          kicker={lang === "en" ? "Resources" : "Kaynaklar"}
          title={lang === "en" ? "Notes, Books & Datasets" : "Notlar, Kitaplar & Datasetler"}
          text={
            lang === "en"
              ? "A growing library of learning materials, project notes and useful resources."
              : "Öğrenme materyalleri, proje notları ve faydalı kaynaklardan oluşan gelişen bir alan."
          }
        />

        <div className="grid gap-6 md:grid-cols-3">
          {resources.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-cyan-400/40"
            >
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
                {item.type[lang]}
              </p>

              <h3 className="mb-4 text-2xl font-black">{item.title}</h3>

              <p className="text-slate-300">{item.description[lang]}</p>

              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex font-bold text-cyan-300 transition hover:text-white"
              >
                {lang === "en" ? "Open resource ↗" : "Kaynağı aç ↗"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
