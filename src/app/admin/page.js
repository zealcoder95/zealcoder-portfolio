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
    <main className="min-h-screen bg-slate-950 px-6 pb-20 pt-28 text-white md:px-10 md:pt-32">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <section className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">
                ADMIN PANEL
                <span className="mx-2 text-slate-600">/</span>
                YÖNETİM PANELİ
              </p>

              <h1 className="mt-4 text-4xl font-black md:text-6xl">
                ZealCoder Admin
              </h1>

              <p className="mt-5 max-w-3xl leading-8 text-slate-400">
                Manage every project, article and platform update from one place.
                <br />
                <span className="text-slate-500">
                  Tüm projeleri, yazıları ve platform güncellemelerini tek yerden yönet.
                </span>
              </p>

              <div className="mt-6 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 text-sm text-cyan-200">
                Signed in / Giriş yapan:
                <span className="ml-2 font-bold">
                  {user.email}
                </span>
              </div>

            </div>

            <LogoutButton />

          </div>

        </section>

        {/* STATS */}

        <section className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-7 transition hover:border-cyan-300/20">

            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              TOTAL
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Toplam Güncelleme
            </p>

            <h2 className="mt-6 text-5xl font-black">
              {totalUpdates ?? 0}
            </h2>

          </div>

          <div className="rounded-[30px] border border-emerald-400/20 bg-emerald-500/10 p-7 transition hover:border-emerald-300/40">

            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">
              VISIBLE
            </p>

            <p className="mt-1 text-sm text-emerald-300">
              Yayında
            </p>

            <h2 className="mt-6 text-5xl font-black">
              {visibleUpdates ?? 0}
            </h2>

          </div>

          <div className="rounded-[30px] border border-amber-300/20 bg-amber-500/10 p-7 transition hover:border-amber-300/40">

            <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
              HIDDEN
            </p>

            <p className="mt-1 text-sm text-amber-300">
              Gizli
            </p>

            <h2 className="mt-6 text-5xl font-black">
              {hiddenUpdates ?? 0}
            </h2>

          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section className="mt-12">

          <div className="mb-6">

            <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">
              QUICK ACTIONS
              <span className="mx-2 text-slate-600">/</span>
              HIZLI İŞLEMLER
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Manage Your Content
            </h2>

          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            <Link
              href="/admin/new"
              className="group rounded-[30px] border border-purple-300/20 bg-purple-500/10 p-8 transition duration-300 hover:-translate-y-1 hover:border-purple-300/50"
            >
              <div className="text-5xl">＋</div>

              <h3 className="mt-6 text-2xl font-black">
                New Update
              </h3>

              <p className="mt-1 text-slate-300">
                Yeni Güncelleme
              </p>

              <p className="mt-5 leading-7 text-slate-400">
                Publish a new project, article or announcement.
                <br />
                Yeni proje, yazı veya platform duyurusu oluştur.
              </p>

            </Link>

            <Link
              href="/admin/updates"
              className="group rounded-[30px] border border-emerald-300/20 bg-emerald-500/10 p-8 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/50"
            >
              <div className="text-5xl">☷</div>

              <h3 className="mt-6 text-2xl font-black">
                Manage Updates
              </h3>

              <p className="mt-1 text-slate-300">
                Güncellemeleri Yönet
              </p>

              <p className="mt-5 leading-7 text-slate-400">
                Edit, hide, delete or organize every update.
                <br />
                Güncellemeleri düzenle, gizle veya sil.
              </p>

            </Link>

            <Link
              href="/updates"
              className="group rounded-[30px] border border-cyan-300/20 bg-cyan-500/10 p-8 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50"
            >
              <div className="text-5xl">↗</div>

              <h3 className="mt-6 text-2xl font-black">
                Public Updates
              </h3>

              <p className="mt-1 text-slate-300">
                Canlı Sayfa
              </p>

              <p className="mt-5 leading-7 text-slate-400">
                Open the page visitors currently see.
                <br />
                Ziyaretçilerin gördüğü güncellemeleri aç.
              </p>

            </Link>

          </div>

        </section>

      </div>
    </main>
  );
}