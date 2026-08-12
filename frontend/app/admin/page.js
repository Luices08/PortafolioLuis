'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/apiClient';
import { FolderKanban, Sparkles, Briefcase, GraduationCap } from 'lucide-react';

const CARDS = [
  { key: 'projects', label: 'Proyectos', href: '/admin/projects', icon: FolderKanban, fetchPath: '/projects/admin/all' },
  { key: 'skills', label: 'Habilidades', href: '/admin/skills', icon: Sparkles, fetchPath: '/skills' },
  { key: 'experience', label: 'Experiencia', href: '/admin/experience', icon: Briefcase, fetchPath: '/experience' },
  { key: 'education', label: 'Educación', href: '/admin/education', icon: GraduationCap, fetchPath: '/education' },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      CARDS.map((c) =>
        api
          .get(c.fetchPath)
          .then((data) => [c.key, Array.isArray(data) ? data.length : 0])
          .catch(() => [c.key, null])
      )
    ).then((entries) => {
      if (cancelled) return;
      setCounts(Object.fromEntries(entries));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <span className="transmission-label text-signal">panel administrativo</span>
      <h1 className="mt-2 font-display text-2xl font-semibold text-paper">Resumen del contenido</h1>
      <p className="mt-1 text-sm text-muted">
        Todo lo que edites aquí se refleja de inmediato en las respuestas del chatbot.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ key, label, href, icon: Icon }) => (
          <Link
            key={key}
            href={href}
            className="group rounded-xl border border-line bg-panel-2 p-5 transition-colors hover:border-signal/40"
          >
            <Icon size={18} className="text-muted group-hover:text-signal" />
            <p className="mt-4 font-display text-3xl font-semibold text-paper">
              {loading ? '—' : counts[key] ?? '—'}
            </p>
            <p className="mt-1 text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
