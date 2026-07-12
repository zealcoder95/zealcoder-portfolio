import DashboardCard from "./DashboardCard";

export default function StatsGrid({
  updates = [],
}) {
  const countPlatform = (platform) =>
    updates.filter(
      (update) =>
        update.platform === platform
    ).length;

  const visibleUpdates = updates.filter(
    (update) => update.is_visible
  ).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <DashboardCard
        title="All Updates"
        value={updates.length}
        icon="🔥"
        color="#f9731633"
      />

      <DashboardCard
        title="Visible Updates"
        value={visibleUpdates}
        icon="👁"
        color="#22c55e33"
      />

      <DashboardCard
        title="Kaggle"
        value={countPlatform("kaggle")}
        icon="K"
        color="#06b6d433"
      />

      <DashboardCard
        title="Resources"
        value={countPlatform("resource")}
        icon="📚"
        color="#7c3aed33"
      />
    </div>
  );
}