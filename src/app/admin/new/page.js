import Link from "next/link";
import NewUpdateForm from "@/components/admin/NewUpdateForm";

export const metadata = {
  title: "New Update | ZealCoder Admin",
};

export default function NewUpdatePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 pb-16 pt-28 text-white md:pt-32">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:gap-3 hover:text-white"
        >
          <span>←</span>
          Back to Admin
        </Link>

        <div className="mt-10">
          <NewUpdateForm />
        </div>
      </div>
    </main>
  );
}
