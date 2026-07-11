"use client";

import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-8 py-12 text-white">
      <div className="mx-auto max-w-7xl">

        <h1 className="text-5xl font-black">
          ZealCoder Admin
        </h1>

        <p className="mt-4 text-slate-400">
          Manage portfolio updates from one place.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-4">

          <Link
            href="/admin/new"
            className="rounded-3xl bg-purple-600 p-8 text-center text-xl font-bold transition hover:scale-105"
          >
            ➕
            <br />
            New Update
          </Link>

          <div className="rounded-3xl border border-white/10 p-8">
            <p className="text-5xl">📚</p>

            <p className="mt-5 font-bold">
              Learning Hub
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 p-8">
            <p className="text-5xl">🚀</p>

            <p className="mt-5 font-bold">
              Projects
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 p-8">
            <p className="text-5xl">📈</p>

            <p className="mt-5 font-bold">
              Activity Feed
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}