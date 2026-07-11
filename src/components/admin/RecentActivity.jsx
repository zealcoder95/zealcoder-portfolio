const activities = [
  {
    platform: "GitHub",
    title: "SQL Project Updated",
    time: "2 hours ago",
  },
  {
    platform: "Medium",
    title: "New AI Article",
    time: "Yesterday",
  },
  {
    platform: "Learning Hub",
    title: "3 books added",
    time: "2 days ago",
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

      <h2 className="text-2xl font-black">
        🔥 Recent Activity
      </h2>

      <div className="mt-8 space-y-5">

        {activities.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-black/20 p-5"
          >
            <p className="text-cyan-300">
              {item.platform}
            </p>

            <h3 className="mt-2 font-bold">
              {item.title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {item.time}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}