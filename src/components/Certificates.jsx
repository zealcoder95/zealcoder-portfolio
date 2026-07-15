import { getCertificates } from "@/content/certificates";

export default function Certificates({ lang }) {
  const certificates = getCertificates();
  return (
    <section className="bg-slate-900 px-6 py-24 text-white">
      <div className="zc-container">
        <p className="mb-3 font-bold uppercase tracking-[0.35em] text-cyan-300">
          {lang === "en" ? "Achievements" : "Başarılar"}
        </p>

        <h2 className="mb-16 text-5xl font-black">
          {lang === "en" ? "Certificates & Trainings" : "Sertifikalar & Eğitimler"}
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-purple-400/40"
            >
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-purple-300">
                {item.issuer}
              </p>

              <h3 className="text-2xl font-black">{item.title}</h3>

              <p className="mt-4 text-sm font-medium text-slate-400">
                {item.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
