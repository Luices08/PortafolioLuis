export default function Section({ eyebrow, tag, children }) {
  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-violet-300">{eyebrow}</span>
        {tag && (
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-white/50">
            {tag}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
