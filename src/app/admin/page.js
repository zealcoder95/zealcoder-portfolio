import StatsGrid from "@/components/admin/StatsGrid";
import RecentActivity from "@/components/admin/RecentActivity";
import QuickActions from "@/components/admin/QuickActions";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 pb-16 pt-28 text-white md:px-10 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-300">
                Secure Admin Area
              </p>

              <h1 className="mt-3 text-4xl font-black md:text-5xl">
                ZealCoder Admin
              </h1>

              <p className="mt-3 text-slate-400">
                Portfolio Control Center
              </p>
            </div>

            <LogoutButton />
          </div>
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