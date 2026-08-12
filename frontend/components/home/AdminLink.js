import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

export default function AdminLink() {
  return (
    <Link
      href="/admin"
      className="glass-pill fixed right-5 top-5 z-30 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-white/40 transition-colors hover:text-white/80"
    >
      <LayoutDashboard size={13} />
      Admin
    </Link>
  );
}
