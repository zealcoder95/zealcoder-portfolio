import StatsGrid from "@/components/admin/StatsGrid";
import RecentActivity from "@/components/admin/RecentActivity";
import QuickActions from "@/components/admin/QuickActions";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-4xl font-black md:text-5xl">
              ZealCoder Admin
            </h1>

            <p className="mt-3 text-slate-400">
              Portfolio Control Center
            </p>
          </div>

          <LogoutButton />
        </div>

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