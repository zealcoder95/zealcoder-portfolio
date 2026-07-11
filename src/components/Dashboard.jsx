export default function Dashboard({
  lang = "en",
  data = {},
}) {
  const language =
    lang === "tr" ? "tr" : "en";

  const {
    totalProjects = 0,
    featuredProjects = 0,
    totalStars = 0,
    languages = [],
    latestProject = null,
  } = data;

  const items = [
    {
      value: totalProjects,
      label: {
        en: "Portfolio Projects",
        tr: "Portfolyo Projeleri",
      },
    },
    {
      value: featuredProjects,
      label: {
        en: "Featured Projects",
        tr: "Öne Çıkan Projeler",
      },
    },
    {
      value: totalStars,
      label: {
        en: "Total GitHub Stars",
        tr: "Toplam GitHub Yıldızı",
      },
    },
    {
      value: languages.length,
      label: {
        en: "Technologies",
        tr: "Teknolojiler",
      },
    },
  ];

  return (
    <section className="bg-slate-950 px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.4em] text-cyan-300">
          ZealCoder Dashboard
        </p>

        <h2 className="mb-14 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
          {language === "en"
            ? "Live data from my"
            : "Canlı veriler doğrudan"}{" "}
          <span className="bg-linear-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
            {language === "en"
              ? "GitHub portfolio."
              : "GitHub portfolyomdan."}
          </span>
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label.en}
              className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl transition duration-500 hover:-translate-y-3 hover:border-cyan-300/40 hover:shadow-[0_0_45px_rgba(34,211,238,0.16)]"
            >
              <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl transition group-hover:bg-cyan-400/20" />

              <p className="relative mb-3 bg-linear-to-r from-purple-400 to-cyan-300 bg-clip-text text-5xl font-black text-transparent">
                {item.value}
              </p>

              <p className="relative text-slate-300">
                {item.label[language]}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.65fr]">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-purple-300">
              {language === "en"
                ? "Technology Distribution"
                : "Teknoloji Dağılımı"}
            </p>

            {languages.length === 0 ? (
              <p className="text-slate-400">
                {language === "en"
                  ? "Language data is not available yet."
                  : "Dil verisi henüz mevcut değil."}
              </p>
            ) : (
              <div className="space-y-6">
                {languages.map((item) => (
                  <div key={item.name}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <span className="font-bold text-white">
                        {item.name}
                      </span>

                      <span className="text-sm text-cyan-300">
                        {item.percentage}%
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-purple-500 to-cyan-400 transition-all duration-700"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <p className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
              {language === "en"
                ? "Latest Project"
                : "Son Proje"}
            </p>

            {latestProject ? (
              <>
                <h3 className="text-2xl font-black text-white">
                  {latestProject.title}
                </h3>

                <p className="mt-4 line-clamp-4 leading-7 text-slate-400">
                  {latestProject.summary ||
                    (language === "en"
                      ? "Project details are available on GitHub."
                      : "Proje ayrıntıları GitHub üzerinde mevcut.")}
                </p>

                {latestProject.githubUrl && (
                  <a
                    href={latestProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 font-bold text-cyan-300 transition hover:gap-3 hover:text-white"
                  >
                    {language === "en"
                      ? "View on GitHub"
                      : "GitHub’da Görüntüle"}
                    <span>→</span>
                  </a>
                )}
              </>
            ) : (
              <p className="text-slate-400">
                {language === "en"
                  ? "No project is available yet."
                  : "Henüz kullanılabilir bir proje bulunmuyor."}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}