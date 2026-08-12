function formatDate(dateStr) {
  if (!dateStr) return 'Actualidad';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es', { month: 'short', year: 'numeric' });
}

export default function ExperienceBlock({ data }) {
  const items = data?.items || [];
  if (items.length === 0) return null;

  return (
    <div className="space-y-4 rounded-xl border border-line bg-panel-2 p-4">
      {items.map((item, i) => (
        <div key={i} className="border-l-2 border-signal/40 pl-3">
          <p className="font-display text-sm font-semibold text-paper">
            {item.role} · <span className="text-muted font-normal">{item.company}</span>
          </p>
          <p className="transmission-label mt-0.5">
            {formatDate(item.startDate)} — {item.isCurrent ? 'Actualidad' : formatDate(item.endDate)}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-paper/80">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
