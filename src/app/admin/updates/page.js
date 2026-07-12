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

  if (Number.isNaN(date.getTime())) {
    return "";
  }

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
    redirect(
      "/admin/login?next=%2Fadmin%2Fupdates"
    );
  }

  const configuredAdminEmail =
    process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

  const userEmail = user.email
    ?.trim()
    .toLowerCase();

  if (
    !configuredAdminEmail ||
    userEmail !== configuredAdminEmail
  ) {
    redirect("/admin/login");
  }

  const adminClient =
    createSupabaseAdminClient();

  const { data, error } = await adminClient
    .from("updates")
    .select("*")
    .order("published_at", {
      ascending: false,
    })
    .limit(100);

  if (error) {
    console.error(
      "Admin updates page error:",
      error
    );
  }

  const updates = data || [];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:text-white"
            >
              <span>←</span>
              Admin paneline dön
            </Link>

            <p className="mt-10 text-xs font-black uppercase tracking-[0.32em] text-cyan-300">
              Content Management
            </p>

            <h1 className="mt-3 text-4xl font-black md:text-6xl">
              Tüm Güncellemeler
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-slate-400">
              Supabase üzerinde kayıtlı tüm platform
              gelişmelerini buradan yönetebilirsin.
            </p>
          </div>

          <Link
            href="/admin/new"
            className="inline-flex w-fit items-center justify-center rounded-full bg-linear-to-r from-purple-600 to-cyan-500 px-6 py-3 font-black text-white transition hover:-translate-y-1"
          >
            + Yeni Güncelleme
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-300">
            Toplam: {updates.length}
          </span>

          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-200">
            Görünür:{" "}
            {
              updates.filter(
                (update) => update.is_visible
              ).length
            }
          </span>

          <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-200">
            Gizli:{" "}
            {
              updates.filter(
                (update) => !update.is_visible
              ).length
            }
          </span>
        </div>

        {updates.length === 0 ? (
          <div className="mt-10 rounded-[32px] border border-white/10 bg-white/[0.04] p-10 text-slate-400">
            Henüz güncelleme kaydı bulunmuyor.
          </div>
        ) : (
          <div className="mt-10 space-y-4">
            {updates.map((update) => {
              const platformClass =
                PLATFORM_STYLES[
                  update.platform
                ] ||
                PLATFORM_STYLES.website;

              return (
                <article
                  key={update.id}
                  className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 transition hover:border-cyan-300/25"
                >
                  <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
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
                          {formatDate(
                            update.published_at
                          )}
                        </time>

                        <span
                          className={`rounded-full border px-3 py-1 font-bold ${
                            update.is_visible
                              ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                              : "border-amber-300/20 bg-amber-300/10 text-amber-200"
                          }`}
                        >
                          {update.is_visible
                            ? "Görünür"
                            : "Gizli"}
                        </span>
                      </div>

                      <h2 className="mt-4 text-xl font-black text-white md:text-2xl">
                        {update.title_tr ||
                          update.title_en}
                      </h2>

                      {update.description_tr && (
                        <p className="mt-3 max-w-4xl leading-7 text-slate-400">
                          {update.description_tr}
                        </p>
                      )}

                      <p className="mt-4 break-all text-sm text-cyan-300">
                        {update.url}
                      </p>
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