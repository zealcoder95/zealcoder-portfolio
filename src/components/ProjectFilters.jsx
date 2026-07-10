"use client";

export default function ProjectFilters({
  categories,
  activeCategory,
  onChange,
}) {
  return (
    <div className="mb-10 flex flex-wrap gap-3">
      {categories.map((category) => {
        const active = activeCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              active
                ? "border-cyan-300 bg-cyan-300/10 text-cyan-300"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/40 hover:text-white"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}