import Section from './Section';

function formatDate(dateStr) {
  if (!dateStr) return 'Actualidad';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es', { month: 'short', year: 'numeric' });
}

export default function ExperienceBlock({ block }) {
  const items = block.data?.items || [];
  if (items.length === 0) return null;

  return (
    <Section eyebrow="Experiencia profesional">
      <div className="space-y-5">
        {items.map((item, i) => (
          <div key={i} className="border-l-2 border-violet-400/40 pl-4">
            <p className="font-display text-sm font-semibold text-white">
              {item.role} · <span className="font-normal text-white/50">{item.company}</span>
            </p>
            <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-white/35">
              {formatDate(item.startDate)} — {item.isCurrent ? 'Actualidad' : formatDate(item.endDate)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{item.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
