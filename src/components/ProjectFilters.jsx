"use client";

export default function ProjectFilters({
  categories,
  activeCategory,
  onChange,
}) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      {categories.map((category) => {
        const active = activeCategory === category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${
              active
                ? "border border-cyan-300 bg-cyan-300/12 text-cyan-200 shadow-sm shadow-cyan-300/10"
                : "border border-white/10 bg-slate-900/80 text-slate-300 hover:border-cyan-300/30 hover:text-white"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
