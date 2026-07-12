"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const INPUT_CLASS =
  "mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:bg-black/35";

function toDateTimeLocal(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(
    date.getTime() - offset * 60 * 1000
  );

  return localDate.toISOString().slice(0, 16);
}

export default function EditUpdateForm({
  update,
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    platform: update.platform || "website",
    action: update.action || "added",
    titleEn: update.title_en || "",
    titleTr: update.title_tr || "",
    descriptionEn:
      update.description_en || "",
    descriptionTr:
      update.description_tr || "",
    url: update.url || "",
    publishedAt: toDateTimeLocal(
      update.published_at
    ),
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  function updateField(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setStatus({
      type: "",
      message: "",
    });

    try {
      const response = await fetch(
        "/api/admin/updates",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: update.id,
            ...form,
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
            "Güncelleme kaydedilemedi."
        );
      }

      setStatus({
        type: "success",
        message:
          "Güncelleme başarıyla kaydedildi.",
      });

      router.refresh();

      setTimeout(() => {
        router.push("/admin/updates");
      }, 700);
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.message ||
          "Bir hata oluştu.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8"
    >
      <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
        Edit Content
      </p>

      <h1 className="mt-3 text-3xl font-black">
        Güncellemeyi Düzenle
      </h1>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <label className="text-sm font-bold text-slate-300">
          Platform
          <select
            name="platform"
            value={form.platform}
            onChange={updateField}
            className={INPUT_CLASS}
          >
            <option value="website">
              ZealCoder
            </option>
            <option value="github">
              GitHub
            </option>
            <option value="medium">
              Medium
            </option>
            <option value="kaggle">
              Kaggle
            </option>
            <option value="linkedin">
              LinkedIn
            </option>
            <option value="resource">
              Learning Resource
            </option>
            <option value="certificate">
              Certificate
            </option>
          </select>
        </label>

        <label className="text-sm font-bold text-slate-300">
          İşlem
          <select
            name="action"
            value={form.action}
            onChange={updateField}
            className={INPUT_CLASS}
          >
            <option value="added">Eklendi</option>
            <option value="updated">
              Güncellendi
            </option>
            <option value="published">
              Yayımlandı
            </option>
            <option value="shared">
              Paylaşıldı
            </option>
            <option value="removed">
              Kaldırıldı
            </option>
          </select>
        </label>

        <label className="text-sm font-bold text-slate-300">
          İngilizce başlık
          <input
            required
            name="titleEn"
            value={form.titleEn}
            onChange={updateField}
            className={INPUT_CLASS}
          />
        </label>

        <label className="text-sm font-bold text-slate-300">
          Türkçe başlık
          <input
            required
            name="titleTr"
            value={form.titleTr}
            onChange={updateField}
            className={INPUT_CLASS}
          />
        </label>

        <label className="text-sm font-bold text-slate-300 md:col-span-2">
          İngilizce açıklama
          <textarea
            name="descriptionEn"
            value={form.descriptionEn}
            onChange={updateField}
            rows={4}
            className={INPUT_CLASS}
          />
        </label>

        <label className="text-sm font-bold text-slate-300 md:col-span-2">
          Türkçe açıklama
          <textarea
            name="descriptionTr"
            value={form.descriptionTr}
            onChange={updateField}
            rows={4}
            className={INPUT_CLASS}
          />
        </label>

        <label className="text-sm font-bold text-slate-300">
          URL
          <input
            required
            name="url"
            value={form.url}
            onChange={updateField}
            className={INPUT_CLASS}
          />
        </label>

        <label className="text-sm font-bold text-slate-300">
          Yayın tarihi
          <input
            type="datetime-local"
            name="publishedAt"
            value={form.publishedAt}
            onChange={updateField}
            className={INPUT_CLASS}
          />
        </label>
      </div>

      {status.message && (
        <div
          className={`mt-6 rounded-2xl border px-5 py-4 text-sm font-bold ${
            status.type === "success"
              ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
              : "border-red-300/30 bg-red-300/10 text-red-200"
          }`}
        >
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-8 inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-purple-600 to-cyan-500 px-6 py-4 font-black text-white transition hover:-translate-y-1 disabled:opacity-50"
      >
        {isSubmitting
          ? "Kaydediliyor..."
          : "Değişiklikleri Kaydet"}
      </button>
    </form>
  );
}