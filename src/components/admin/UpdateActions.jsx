"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UpdateActions({
  id,
  isVisible,
}) {
  const router = useRouter();

  const [loadingAction, setLoadingAction] =
    useState(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function request(method, body) {
    const response = await fetch(
      "/api/admin/updates",
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const result = await response.json();

    if (response.status === 401) {
      window.location.href =
        "/admin/login?next=%2Fadmin%2Fupdates";
      return false;
    }

    if (!response.ok) {
      throw new Error(
        result.error || "İşlem başarısız."
      );
    }

    return true;
  }

  async function changeVisibility() {
    try {
      setLoadingAction("visibility");
      setErrorMessage("");

      const ok = await request("PATCH", {
        id,
        isVisible: !isVisible,
      });

      if (ok) {
        router.refresh();
      }
    } catch (error) {
      setErrorMessage(
        error?.message ||
          "Bir hata oluştu."
      );
    } finally {
      setLoadingAction(null);
    }
  }

  async function deleteUpdate() {
    const confirmed = window.confirm(
      "⚠️ Bu güncelleme kalıcı olarak silinecek.\n\nDevam etmek istiyor musun?"
    );

    if (!confirmed) return;

    try {
      setLoadingAction("delete");
      setErrorMessage("");

      const ok = await request("DELETE", {
        id,
      });

      if (ok) {
        router.refresh();
      }
    } catch (error) {
      setErrorMessage(
        error?.message ||
          "Bir hata oluştu."
      );
    } finally {
      setLoadingAction(null);
    }
  }

  const disabled =
    loadingAction !== null;

  return (
    <div className="flex flex-col items-end gap-3">

      <div className="flex flex-wrap justify-end gap-3">

        <Link
          href={`/admin/updates/${id}/edit`}
          className="inline-flex min-w-[140px] items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-5 py-2.5 text-sm font-black text-cyan-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-400/20"
        >
          ✏️ Edit / Düzenle
        </Link>

        <button
          type="button"
          onClick={changeVisibility}
          disabled={disabled}
          className="inline-flex min-w-[140px] items-center justify-center rounded-full border border-amber-300/20 bg-amber-400/10 px-5 py-2.5 text-sm font-black text-amber-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300/50 hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "visibility"
            ? "⏳ Saving..."
            : isVisible
            ? "🙈 Hide / Gizle"
            : "👁 Show / Göster"}
        </button>

        <button
          type="button"
          onClick={deleteUpdate}
          disabled={disabled}
          className="inline-flex min-w-[140px] items-center justify-center rounded-full border border-red-300/20 bg-red-400/10 px-5 py-2.5 text-sm font-black text-red-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300/50 hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction === "delete"
            ? "⏳ Deleting..."
            : "🗑 Delete / Sil"}
        </button>

      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-right text-xs font-semibold text-red-300">
          {errorMessage}
        </div>
      )}

    </div>
  );
}