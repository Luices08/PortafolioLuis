import { ExternalLink } from 'lucide-react';

export default function LinkBlock({ data }) {
  if (!data?.url) return null;
  return (
    <a
      href={data.url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-panel-2 px-3 py-2 text-sm text-signal hover:border-signal/50"
    >
      <ExternalLink size={14} /> {data.label || data.url}
    </a>
  );
}
