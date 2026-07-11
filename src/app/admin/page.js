import StatsGrid from "@/components/admin/StatsGrid";
import RecentActivity from "@/components/admin/RecentActivity";
import QuickActions from "@/components/admin/QuickActions";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-10 text-white">

      <div className="mx-auto max-w-7xl">

        <h1 className="text-5xl font-black">
          ZealCoder Admin
        </h1>

        <p className="mt-3 text-slate-400">
          Portfolio Control Center
        </p>

        <div className="mt-10">
          <StatsGrid />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">

          <RecentActivity />

          <QuickActions />

        </div>

      </div>

    </main>
  );
}