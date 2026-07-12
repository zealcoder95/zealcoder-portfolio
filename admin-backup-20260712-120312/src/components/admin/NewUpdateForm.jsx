"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const INITIAL_FORM = {
  platform: "website",
  action: "added",
  titleEn: "",
  titleTr: "",
  descriptionEn: "",
  descriptionTr: "",
  url: "",
  publishedAt: "",
};

const INPUT_CLASS =
  "mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:bg-black/35";

export default function NewUpdateForm() {
  const router = useRouter();

  const [form, setForm] =
    useState(INITIAL_FORM);

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

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
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (response.status === 401) {
        router.replace("/admin/login");
        router.refresh();
        return;
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Update could not be published."
        );
      }

      setStatus({
        type: "success",
        message:
          "Update published successfully.",
      });

      setForm(INITIAL_FORM);
      router.refresh();
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.message ||
          "Something went wrong.",
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
        Content Manager
      </p>

      <h1 className="mt-3 text-3xl font-black">
        Publish New Update
      </h1>

      <p className="mt-3 text-slate-400">
        The update will be published using your
        authenticated admin session.
      </p>

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
          Action
          <select
            name="action"
            value={form.action}
            onChange={updateField}
            className={INPUT_CLASS}
          >
            <option value="added">Added</option>
            <option value="updated">
              Updated
            </option>
            <option value="published">
              Published
            </option>
            <option value="shared">Shared</option>
            <option value="removed">
              Removed
            </option>
          </select>
        </label>

        <label className="text-sm font-bold text-slate-300">
          English title
          <input
            required
            name="titleEn"
            value={form.titleEn}
            onChange={updateField}
            placeholder="New SQL project published"
            className={INPUT_CLASS}
          />
        </label>

        <label className="text-sm font-bold text-slate-300">
          Turkish title
          <input
            required
            name="titleTr"
            value={form.titleTr}
            onChange={updateField}
            placeholder="Yeni SQL projesi yayımlandı"
            className={INPUT_CLASS}
          />
        </label>

        <label className="text-sm font-bold text-slate-300 md:col-span-2">
          English description
          <textarea
            name="descriptionEn"
            value={form.descriptionEn}
            onChange={updateField}
            rows={4}
            placeholder="Briefly describe the update."
            className={INPUT_CLASS}
          />
        </label>

        <label className="text-sm font-bold text-slate-300 md:col-span-2">
          Turkish description
          <textarea
            name="descriptionTr"
            value={form.descriptionTr}
            onChange={updateField}
            rows={4}
            placeholder="Gelişmeyi kısaca açıklayın."
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
            placeholder="/updates or https://..."
            className={INPUT_CLASS}
          />
        </label>

        <label className="text-sm font-bold text-slate-300">
          Publication date
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
        className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-purple-600 to-cyan-500 px-6 py-4 font-black text-white transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
      >
        {isSubmitting
          ? "Publishing..."
          : "Publish Update"}
      </button>
    </form>
  );
}