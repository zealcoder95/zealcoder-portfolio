import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminPageHeader({
  href = "/admin",
  eyebrowEn,
  eyebrowTr,
  titleEn,
  titleTr,
  descriptionEn,
  descriptionTr,
}) {
  return (
    <header className="mb-12">
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-cyan-300 hover:text-white transition"
      >
        <ArrowLeft size={18} />
        <span>
          Back to Admin
          <span className="mx-2 opacity-40">/</span>
          Admin Paneline Dön
        </span>
      </Link>

      <div className="mt-8">
        <p className="text-xs font-black tracking-[0.32em] uppercase text-cyan-300">
          {eyebrowEn}
          <span className="mx-2 opacity-50">/</span>
          {eyebrowTr}
        </p>

        <h1 className="mt-3 text-5xl font-black leading-tight">
          {titleEn}
          <br />
          <span className="text-slate-300">
            {titleTr}
          </span>
        </h1>

        {(descriptionEn || descriptionTr) && (
          <p className="mt-5 max-w-3xl text-slate-400 leading-8">
            {descriptionEn}
            <br />
            <span className="text-slate-500">
              {descriptionTr}
            </span>
          </p>
        )}
      </div>
    </header>
  );
}