"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] =
    useState(false);

  async function handleLogout() {
    setIsLoading(true);

    try {
      const supabase =
        createSupabaseBrowserClient();

      await supabase.auth.signOut();

      router.replace("/admin/login");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
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