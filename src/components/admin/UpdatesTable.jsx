"use client";

import { useMemo, useState } from "react";

export default function UpdatesTable({
  updates,
  children,
}) {
  const [search, setSearch] = useState("");

  const filteredUpdates = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return updates;
    }

    return updates.filter((update) => {
      return (
        update.title_tr
          ?.toLowerCase()
          .includes(keyword) ||
        update.title_en
          ?.toLowerCase()
          .includes(keyword) ||
        update.description_tr
          ?.toLowerCase()
          .includes(keyword) ||
        update.description_en
          ?.toLowerCase()
          .includes(keyword) ||
        update.platform
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [updates, search]);

  return (
    <>
      <div className="mb-8">
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="🔍 Güncelleme ara..."
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-cyan-400"
        />
      </div>

      {children(filteredUpdates)}
    </>
  );
}