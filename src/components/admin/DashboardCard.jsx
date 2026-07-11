export default function DashboardCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-400/40">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <h2 className="mt-4 text-4xl font-black">
            {value}
          </h2>

        </div>

        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
          style={{
            background: color,
          }}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}