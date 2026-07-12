export default function QuickActions() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

      <h2 className="text-2xl font-black">
        ⚡ Quick Actions
      </h2>

      <div className="mt-6 grid gap-4">

        <button className="rounded-2xl bg-purple-600 py-4 font-bold">
          + New Update
        </button>

        <button className="rounded-2xl bg-cyan-600 py-4 font-bold">
          + New Medium Article
        </button>

        <button className="rounded-2xl bg-emerald-600 py-4 font-bold">
          + Learning Resource
        </button>

        <button className="rounded-2xl bg-orange-600 py-4 font-bold">
          + Certificate
        </button>

      </div>

    </div>
  );
}