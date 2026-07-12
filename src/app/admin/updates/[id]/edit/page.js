import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import EditUpdateForm from "@/components/admin/EditUpdateForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function EditUpdatePage({
  params,
}) {
  const { id } = await params;

  const sessionClient =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  if (!user) {
    redirect(
      `/admin/login?next=${encodeURIComponent(
        `/admin/updates/${id}/edit`
      )}`
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

  const { data: update, error } =
    await adminClient
      .from("updates")
      .select("*")
      .eq("id", id)
      .single();

  if (error || !update) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/updates"
          className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:text-white"
        >
          <span>←</span>
          Güncellemelere dön
        </Link>

        <div className="mt-10">
          <EditUpdateForm update={update} />
        </div>
      </div>
    </main>
  );
}