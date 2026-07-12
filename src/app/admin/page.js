import Link from "next/link";
import { redirect } from "next/navigation";

import LogoutButton from "@/components/admin/LogoutButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const configuredAdminEmail =
    process.env.ADMIN_EMAIL?.trim().toLowerCase();

  const userEmail =
    user.email?.trim().toLowerCase();

  if (
    !configuredAdminEmail ||
    userEmail !== configuredAdminEmail
  ) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const adminClient = createSupabaseAdminClient();

  const [
    { count: totalUpdates },
    { count: visibleUpdates },
    { count: hiddenUpdates },
  ] = await Promise.all([
    adminClient
      .from("updates")
      .select("*", {
        count: "exact",
        head: true,
      }),

    adminClient
      .from("updates")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("is_visible", true),

    adminClient
      .from("updates")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("is_visible", false),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 pb-16 pt-28 text-white md:px-10 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-300">
                Secure Admin Area
              </p>

              <h1 className="mt-3 text-4xl font-black md:text-5xl">
                ZealCoder Admin
              </h1>

              <p className="mt-3 text-slate-400">
                Signed in as {user.email}
              </p>
            </div>

            <LogoutButton />
          </div>
        </header>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">
              Toplam Güncelleme
            </p>

            <h2 className="mt-4 text-5xl font-black">
              {totalUpdates ?? 0}
            </h2>
          </div>

          <div className="rounded-[28px] border border-emerald-400/20 bg-emerald-400/10 p-6">
            <p className="text-sm text-emerald-200">
              Yayında
            </p>

            <h2 className="mt-4 text-5xl font-black">
              {visibleUpdates ?? 0}
            </h2>
          </div>

          <div className="rounded-[28px] border border-amber-400/20 bg-amber-400/10 p-6">
            <p className="text-sm text-amber-200">
              Gizli
            </p>

            <h2 className="mt-4 text-5xl font-black">
              {hiddenUpdates ?? 0}
            </h2>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Link
            href="/admin/new"
            className="rounded-[28px] border border-purple-300/20 bg-purple-400/10 p-8 transition hover:-translate-y-1 hover:border-purple-300/50"
          >
            <p className="text-3xl">＋</p>

            <h2 className="mt-5 text-2xl font-black">
              New Update
            </h2>

            <p className="mt-2 text-slate-400">
              Yeni proje, yazı, kaynak veya platform
              duyurusu ekle.
            </p>
          </Link>

          <Link
            href="/admin/updates"
            className="rounded-[28px] border border-emerald-300/20 bg-emerald-400/10 p-8 transition hover:-translate-y-1 hover:border-emerald-300/50"
          >
            <p className="text-3xl">☷</p>

            <h2 className="mt-5 text-2xl font-black">
              Manage Updates
            </h2>

            <p className="mt-2 text-slate-400">
              Kayıtları görüntüle, düzenle,
              gizle veya sil.
            </p>
          </Link>

          <Link
            href="/updates"
            className="rounded-[28px] border border-cyan-300/20 bg-cyan-400/10 p-8 transition hover:-translate-y-1 hover:border-cyan-300/50"
          >
            <p className="text-3xl">↗</p>

            <h2 className="mt-5 text-2xl font-black">
              Public Updates
            </h2>

            <p className="mt-2 text-slate-400">
              Ziyaretçilerin gördüğü güncellemeleri
              aç.
            </p>
          </Link>
        </section>
      </div>
    </main>
  );
}