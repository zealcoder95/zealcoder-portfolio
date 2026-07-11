"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogout() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase.auth.signOut({
        scope: "local",
      });

      if (error) {
        throw error;
      }

      window.location.assign("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);

      setErrorMessage(
        "Çıkış yapılamadı. Sayfayı yenileyip tekrar dene."
      );

      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-full border border-red-300/30 bg-red-300/10 px-5 py-2.5 text-sm font-bold text-red-200 transition hover:border-red-300/50 hover:bg-red-300/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Çıkış yapılıyor..." : "Çıkış Yap"}
      </button>

      {errorMessage && (
        <p className="max-w-xs text-right text-xs text-red-300">
          {errorMessage}
        </p>
      )}
    </div>
  );
}