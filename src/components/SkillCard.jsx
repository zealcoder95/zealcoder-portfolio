export default function SkillCard({ skill }) {
  return (
    <div className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-[0_0_35px_rgba(34,211,238,.14)]">
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl transition group-hover:bg-cyan-400/20" />

      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-2xl font-black">{skill.name}</h3>
          <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-sm font-bold text-cyan-300">
            {skill.level}%
          </span>
        </div>

        <div className="mb-5 h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
            style={{ width: `${skill.level}%` }}
          />
        </div>

        <p className="text-sm leading-6 text-slate-400">
          Notes, projects, exercises and resources will be collected here as this learning path grows.
        </p>
      </div>
    </div>
  );
}