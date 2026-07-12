"use client";

import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const [isLoading, setIsLoading] =
    useState(false);

  async function handleLogout() {
    setIsLoading(true);

    const supabase =
      createSupabaseBrowserClient();

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      setIsLoading(false);
      return;
    }

    window.location.href = "/admin/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="rounded-full border border-red-300/30 bg-red-300/10 px-5 py-2.5 text-sm font-bold text-red-200 transition hover:bg-red-300/20 disabled:opacity-50"
    >
      {isLoading
        ? "Çıkış yapılıyor..."
        : "Çıkış Yap"}
    </button>
  );
}
