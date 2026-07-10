import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="max-w-2xl text-center">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.4em] text-cyan-300">
          Error 404
        </p>

        <h1 className="mb-6 text-6xl font-black md:text-8xl">
          Page not found.
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-8 text-slate-300">
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link
          href="/"
          className="inline-block rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 px-7 py-4 font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-1"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}