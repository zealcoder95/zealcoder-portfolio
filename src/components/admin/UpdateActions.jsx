"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UpdateActions({
  id,
  isVisible,
}) {
  const router = useRouter();

  const [isWorking, setIsWorking] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function changeVisibility() {
    setIsWorking(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        "/api/admin/updates",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            isVisible: !isVisible,
          }),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        window.location.href =
          "/admin/login?next=%2Fadmin%2Fupdates";
        return;
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Visibility could not be changed."
        );
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(
        error?.message ||
          "Bir hata oluştu."
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function deleteUpdate() {
    const confirmed = window.confirm(
      "Bu güncellemeyi kalıcı olarak silmek istediğine emin misin?"
    );

    if (!confirmed) {
      return;
    }

    setIsWorking(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        "/api/admin/updates",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        window.location.href =
          "/admin/login?next=%2Fadmin%2Fupdates";
        return;
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Update could not be deleted."
        );
      }

      router.refresh();
    } catch (error) {
      setErrorMessage(
        error?.message ||
          "Bir hata oluştu."
      );
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-3">
      <div className="flex flex-wrap gap-3">
        
        <Link
          href={`/admin/updates/${id}/edit`}
          className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:bg-cyan-300/20"
        >
          Düzenle
        </Link>

        <button
          type="button"
          onClick={changeVisibility}
          disabled={isWorking}
          className="rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-200 transition hover:bg-amber-300/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isWorking
            ? "İşleniyor..."
            : isVisible
              ? "Gizle"
              : "Göster"}
        </button>

        <button
          type="button"
          onClick={deleteUpdate}
          disabled={isWorking}
          className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2 text-sm font-bold text-red-200 transition hover:bg-red-300/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Sil
        </button>
      </div>

      {errorMessage && (
        <p className="max-w-xs text-right text-xs text-red-300">
          {errorMessage}
        </p>
      )}
    </div>
  );
}