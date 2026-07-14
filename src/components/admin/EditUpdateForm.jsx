"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const INPUT_CLASS =
  "mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white shadow-lg outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30";

const LABEL_CLASS =
  "text-sm font-bold uppercase tracking-wide text-slate-300";

const SECTION_TITLE =
  "text-xs font-black uppercase tracking-[0.35em] text-cyan-300";

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

    setForm((current) => ({
      ...current,
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
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          id: update.id,
          ...form,
        }),
      }
    );

    const result =
      await response.json();

    if (response.status === 401) {
      window.location.href =
        "/admin/login?next=%2Fadmin%2Fupdates";
      return;
    }

    if (!response.ok) {
      throw new Error(
        result.error ||
          "Update could not be saved."
      );
    }

    setStatus({
      type: "success",
      message:
        "✅ Update saved successfully. / Güncelleme başarıyla kaydedildi.",
    });

    router.refresh();

    setTimeout(() => {
      router.push(
        "/admin/updates"
      );
    }, 800);
  } catch (error) {
    setStatus({
      type: "error",
      message:
        error?.message ||
        "❌ Something went wrong. / Bir hata oluştu.",
    });
  } finally {
    setIsSubmitting(false);
  }
}
return (
  <form
    onSubmit={handleSubmit}
    className="overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl backdrop-blur-xl"
  >
    <div className="mb-10 border-b border-white/10 pb-8">
      <p className={SECTION_TITLE}>
        Edit Update / Güncelleme Düzenle
      </p>

      <h1 className="mt-3 text-4xl font-black">
        ✏️ Edit Update
      </h1>

      <p className="mt-2 text-lg text-slate-400">
        Güncellemeyi Düzenle
      </p>

      <p className="mt-5 max-w-3xl leading-7 text-slate-500">
        Update both English and Turkish content from a single form.
        <br />
        İngilizce ve Türkçe içerikleri tek ekrandan düzenleyebilirsin.
      </p>
    </div>

    <div className="grid gap-7 md:grid-cols-2"></div>

<label className={LABEL_CLASS}>
  Platform / Platform
  <select
    name="platform"
    value={form.platform}
    onChange={updateField}
    className={INPUT_CLASS}
  >
    <option value="website">ZealCoder</option>
    <option value="github">GitHub</option>
    <option value="medium">Medium</option>
    <option value="kaggle">Kaggle</option>
    <option value="linkedin">LinkedIn</option>
    <option value="resource">Learning Resource</option>
    <option value="certificate">Certificate</option>
  </select>
</label>

<label className={LABEL_CLASS}>
  Action / İşlem
  <select
    name="action"
    value={form.action}
    onChange={updateField}
    className={INPUT_CLASS}
  >
    <option value="added">Added / Eklendi</option>
    <option value="updated">Updated / Güncellendi</option>
    <option value="published">Published / Yayınlandı</option>
    <option value="shared">Shared / Paylaşıldı</option>
    <option value="removed">Removed / Kaldırıldı</option>
  </select>
</label>

<label className={LABEL_CLASS}>
  English Title
  <input
    required
    name="titleEn"
    value={form.titleEn}
    onChange={updateField}
    className={INPUT_CLASS}
    placeholder="Example: AI Portfolio Published"
  />
</label>

<label className={LABEL_CLASS}>
  Turkish Title
  <input
    required
    name="titleTr"
    value={form.titleTr}
    onChange={updateField}
    className={INPUT_CLASS}
    placeholder="Örn: Yapay Zeka Portfolyosu Yayınlandı"
  />
</label>

<label className={`${LABEL_CLASS} md:col-span-2`}>
  English Description
  <textarea
    name="descriptionEn"
    value={form.descriptionEn}
    onChange={updateField}
    rows={5}
    className={INPUT_CLASS}
    placeholder="Describe the update in English..."
  />
</label>

<label className={`${LABEL_CLASS} md:col-span-2`}>
  Turkish Description
  <textarea
    name="descriptionTr"
    value={form.descriptionTr}
    onChange={updateField}
    rows={5}
    className={INPUT_CLASS}
    placeholder="Güncellemeyi Türkçe olarak açıklayın..."
  />
</label>

<label className={LABEL_CLASS}>
  Project / Resource URL
  <input
    required
    name="url"
    value={form.url}
    onChange={updateField}
    className={INPUT_CLASS}
    placeholder="https://..."
  />
</label>

<label className={LABEL_CLASS}>
  Publish Date / Yayın Tarihi
  <input
    type="datetime-local"
    name="publishedAt"
    value={form.publishedAt}
    onChange={updateField}
    className={INPUT_CLASS}
  />
</label>
      {status.message && (
        <div
          className={`mt-8 flex items-center gap-3 rounded-2xl border px-6 py-4 text-sm font-semibold shadow-lg ${
            status.type === "success"
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-red-400/30 bg-red-400/10 text-red-200"
          }`}
        >
          <span className="text-lg">
            {status.type === "success"
              ? "✅"
              : "❌"}
          </span>

          <span>{status.message}</span>
        </div>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">

        <p className="text-sm text-slate-500">
          Changes are saved directly to Supabase.
          <br />
          Değişiklikler doğrudan Supabase veritabanına kaydedilir.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-w-[230px] items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 px-8 py-4 text-base font-black text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <svg
                className="mr-3 h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  opacity=".25"
                />

                <path
                  fill="currentColor"
                  d="M22 12a10 10 0 00-10-10v4a6 6 0 016 6h4z"
                />
              </svg>

              Saving...
            </>
          ) : (
            <>
              💾 Save Changes
              <span className="ml-2 text-white/70">
                / Değişiklikleri Kaydet
              </span>
            </>
          )}
        </button>

      </div>
    </form>
  );
}