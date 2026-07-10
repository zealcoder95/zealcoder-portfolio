export default function SectionHeader({ kicker, title, text }) {
  return (
    <div className="mb-16">
      <p className="mb-3 font-bold uppercase tracking-[0.35em] text-cyan-300">
        {kicker}
      </p>

      <h2 className="text-5xl font-black text-white">
        {title}
      </h2>

      {text && (
        <p className="mt-6 max-w-3xl text-slate-300">
          {text}
        </p>
      )}
    </div>
  );
}