"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const INPUT_CLASS =
  "mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:bg-black/40";

function getSafeNextPath(value) {
  if (
    typeof value === "string" &&
    value.startsWith("/admin") &&
    !value.startsWith("//") &&
    value !== "/admin/login"
  ) {
    return value;
  }

  return "/admin";
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-950" />}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const supabase =
        createSupabaseBrowserClient();

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (error) {
        throw error;
      }

      if (!data.user || !data.session) {
        throw new Error(
          "Oturum oluşturulamadı."
        );
      }

      const nextPath = getSafeNextPath(
        searchParams.get("next")
      );

      window.location.href = nextPath;
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      setErrorMessage(
        error?.message ===
          "Invalid login credentials"
          ? "E-posta adresi veya şifre yanlış."
          : error?.message ||
              "Giriş yapılamadı."
      );

      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-20 text-white">
      <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-purple-600/20 blur-[110px]" />
      <div className="absolute bottom-[-120px] right-[-120px] h-80 w-80 rounded-full bg-cyan-500/15 blur-[110px]" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:text-white"
        >
          <span>←</span>
          ZealCoder’a dön
        </Link>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-[34px] border border-white/10 bg-white/[0.055] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-9"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-300/30 bg-purple-400/10 text-xl font-black text-purple-200">
            Z
          </div>

          <p className="mt-7 text-xs font-black uppercase tracking-[0.32em] text-cyan-300">
            Güvenli Yönetim Alanı
          </p>

          <h1 className="mt-3 text-3xl font-black">
            ZealCoder Admin
          </h1>

          <p className="mt-3 leading-7 text-slate-400">
            Supabase’te oluşturduğun admin
            hesabıyla giriş yap.
          </p>

          <div className="mt-8 space-y-5">
            <label className="block text-sm font-bold text-slate-300">
              E-posta
              <input
                required
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                className={INPUT_CLASS}
              />
            </label>

            <label className="block text-sm font-bold text-slate-300">
              Şifre
              <input
                required
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
                className={INPUT_CLASS}
              />
            </label>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-2xl border border-red-300/30 bg-red-300/10 px-5 py-4 text-sm font-bold text-red-200">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-purple-600 to-cyan-500 px-6 py-4 font-black text-white transition hover:-translate-y-1 disabled:opacity-50"
          >
            {isSubmitting
              ? "Giriş yapılıyor..."
              : "Admin Paneline Giriş Yap"}
          </button>
        </form>
      </div>
    </main>
  );
}
