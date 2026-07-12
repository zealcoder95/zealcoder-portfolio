import Link from "next/link";
import { redirect } from "next/navigation";

import NewUpdateForm from "@/components/admin/NewUpdateForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NewUpdatePage() {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/admin/login?next=%2Fadmin%2Fnew"
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

  return (
    <main className="min-h-screen bg-slate-950 px-6 pb-16 pt-28 text-white md:pt-32">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:text-white"
        >
          <span>←</span>
          Admin paneline dön
        </Link>

        <div className="mt-10">
          <NewUpdateForm />
        </div>
      </div>
    </main>
  );
}
