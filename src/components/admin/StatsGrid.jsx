import DashboardCard from "./DashboardCard";

export default function StatsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <DashboardCard
        title="Projects"
        value="14"
        icon="🚀"
        color="#7c3aed33"
      />

      <DashboardCard
        title="Medium"
        value="9"
        icon="✍️"
        color="#06b6d433"
      />

      <DashboardCard
        title="Learning"
        value="42"
        icon="📚"
        color="#22c55e33"
      />

      <DashboardCard
        title="Updates"
        value="67"
        icon="🔥"
        color="#f9731633"
      />

    </div>
  );
}