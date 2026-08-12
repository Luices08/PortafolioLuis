'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { admin, loading } = useAuth();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !admin && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [loading, admin, isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  if (loading || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="transmission-label">verificando sesión…</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="thin-scroll flex-1 overflow-y-auto px-8 py-8">{children}</main>
    </div>
  );
}
