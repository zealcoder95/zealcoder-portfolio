function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function RecentActivity({
  updates = [],
}) {
  const recentUpdates = updates.slice(0, 6);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black">
          🔥 Recent Activity
        </h2>

        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-bold text-slate-400">
          {updates.length} records
        </span>
      </div>

      {recentUpdates.length === 0 ? (
        <p className="mt-8 text-slate-400">
          Henüz kayıt bulunmuyor.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {recentUpdates.map((update) => (
            <a
              key={update.id}
              href={update.url}
              target={
                update.url?.startsWith("http")
                  ? "_blank"
                  : undefined
              }
              rel={
                update.url?.startsWith("http")
                  ? "noreferrer"
                  : undefined
              }
              className="block rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:-translate-y-1 hover:border-cyan-300/30"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold capitalize text-cyan-300">
                  {update.platform}
                </span>

                <span className="text-slate-600">
                  •
                </span>

                <span className="capitalize text-slate-500">
                  {update.action}
                </span>

                {!update.is_visible && (
                  <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-0.5 text-amber-200">
                    Hidden
                  </span>
                )}
              </div>

              <h3 className="mt-2 font-bold text-white">
                {update.title_en}
              </h3>

              <time className="mt-2 block text-sm text-slate-500">
                {formatDate(update.published_at)}
              </time>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}