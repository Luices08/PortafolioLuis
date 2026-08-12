import { ExternalLink } from 'lucide-react';

export default function LinkBlock({ block }) {
  const data = block.data;
  if (!data?.url) return null;

  const rawUrl = String(data.url).trim();
  const href = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="glass-pill inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-violet-200 hover:border-violet-300/40"
    >
      <ExternalLink size={14} /> {data.label || data.url}
    </a>
  );
}
