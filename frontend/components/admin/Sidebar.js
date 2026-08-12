'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Briefcase,
  GraduationCap,
  UserCircle,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Proyectos', icon: FolderKanban },
  { href: '/admin/skills', label: 'Habilidades', icon: Sparkles },
  { href: '/admin/experience', label: 'Experiencia', icon: Briefcase },
  { href: '/admin/education', label: 'Educación', icon: GraduationCap },
  { href: '/admin/profile', label: 'Perfil', icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-line bg-panel">
      <div className="px-5 py-6">
        <span className="transmission-label text-signal">panel administrativo</span>
        <p className="mt-1 truncate font-display text-sm font-semibold text-paper">
          {admin?.username || 'admin'}
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                active ? 'bg-signal/10 text-signal' : 'text-muted hover:bg-panel-2 hover:text-paper'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-line px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted hover:bg-panel-2 hover:text-paper"
        >
          <ExternalLink size={16} />
          Ver sitio público
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted hover:bg-danger/10 hover:text-danger"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
