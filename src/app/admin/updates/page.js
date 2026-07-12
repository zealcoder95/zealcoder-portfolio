import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import UpdateActions from "@/components/admin/UpdateActions";

export const dynamic = "force-dynamic";

const PLATFORM_STYLES = {
  github:
    "border-purple-300/30 bg-purple-400/10 text-purple-200",
  medium:
    "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
  kaggle:
    "border-cyan-300/30 bg-cyan-400/10 text-cyan-200",
  linkedin:
    "border-blue-300/30 bg-blue-400/10 text-blue-200",
  resource:
    "border-amber-300/30 bg-amber-400/10 text-amber-200",
  certificate:
    "border-orange-300/30 bg-orange-400/10 text-orange-200",
  website:
    "border-pink-300/30 bg-pink-400/10 text-pink-200",
};

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminUpdatesPage() {
  const sessionClient =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  if (!user) {
    redirect("/admin/login?next=%2Fadmin%2Fupdates");
  }

  const configuredAdminEmail =
    process.env.ADMIN_EMAIL?.trim().toLowerCase();

  const userEmail =
    user.email?.trim().toLowerCase();

  if (
    !configuredAdminEmail ||
    configuredAdminEmail !== userEmail
  ) {
    redirect("/admin/login");
  }

  const adminClient =
    createSupabaseAdminClient();

  const { data, error } =
    await adminClient
      .from("updates")
      .select("*")
      .order("published_at", {
        ascending: false,
      });

  if (error) {
    console.error(error);
  }

  const updates = data || [];

  const visibleCount = updates.filter(
    (u) => u.is_visible
  ).length;

  const hiddenCount =
    updates.length - visibleCount;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>

            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:text-white"
            >
              ← Dashboard
            </Link>

            <p className="mt-8 text-xs font-black uppercase tracking-[0.32em] text-cyan-300">
              Content Management / İçerik Yönetimi
            </p>

            <h1 className="mt-3 text-5xl font-black">
              Updates
            </h1>

            <p className="mt-4 max-w-2xl text-slate-400 leading-7">
              Tüm içerikleri buradan
              düzenleyebilir, gizleyebilir,
              silebilir veya yeni içerik
              ekleyebilirsin.
            </p>

          </div>

          <Link
            href="/admin/new"
            className="rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-7 py-4 font-black transition hover:-translate-y-1"
          >
            + New Update / Yeni Güncelleme
          </Link>

        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-slate-400">
              Total Updates
            </p>

            <h2 className="mt-4 text-5xl font-black">
              {updates.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-6">
            <p className="text-emerald-200">
              Visible / Yayında
            </p>

            <h2 className="mt-4 text-5xl font-black">
              {visibleCount}
            </h2>
          </div>

          <div className="rounded-3xl border border-amber-300/20 bg-amber-400/10 p-6">
            <p className="text-amber-200">
              Hidden / Gizli
            </p>

            <h2 className="mt-4 text-5xl font-black">
              {hiddenCount}
            </h2>
          </div>

        </section>

        {updates.length === 0 ? (

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-12 text-center">

            <h2 className="text-2xl font-black">
              No Updates Yet
            </h2>

            <p className="mt-4 text-slate-400">
              Henüz herhangi bir içerik
              eklenmedi.
            </p>

          </div>

        ) : (

          <div className="mt-10 space-y-5">

            {updates.map((update) => {

              const platformClass =
                PLATFORM_STYLES[
                  update.platform
                ] ||
                PLATFORM_STYLES.website;

              return (

                <article
                  key={update.id}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-cyan-300/40 hover:bg-white/[0.07]"
                >

                  <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3 text-xs">

                        <span
                          className={`rounded-full border px-3 py-1 font-black capitalize ${platformClass}`}
                        >
                          {update.platform}
                        </span>

                        <span className="capitalize text-slate-400">
                          {update.action}
                        </span>

                        <span className="text-slate-600">
                          •
                        </span>

                        <time className="text-slate-500">
                          {formatDate(update.published_at)}
                        </time>

                        <span
                          className={`rounded-full border px-3 py-1 font-bold ${
                            update.is_visible
                              ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                              : "border-amber-300/20 bg-amber-300/10 text-amber-200"
                          }`}
                        >
                          {update.is_visible
                            ? "Visible"
                            : "Hidden"}
                        </span>

                      </div>

                      <h2 className="mt-4 text-2xl font-black">
                        {update.title_tr ||
                          update.title_en}
                      </h2>

                      {update.description_tr && (
                        <p className="mt-4 leading-7 text-slate-400">
                          {update.description_tr}
                        </p>
                      )}

                      <a
                        href={update.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-block break-all text-cyan-300 hover:text-cyan-200"
                      >
                        {update.url}
                      </a>

                    </div>

                    <UpdateActions
                      id={update.id}
                      isVisible={update.is_visible}
                    />

                  </div>

                </article>

              );

            })}

          </div>

        )}

      </div>
    </main>
  );
}