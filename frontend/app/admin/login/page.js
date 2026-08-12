'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form.username, form.password);
      router.push('/admin');
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-panel p-6"
      >
        <span className="transmission-label text-signal">acceso administrativo</span>
        <h1 className="mt-2 font-display text-xl font-semibold text-paper">Iniciar sesión</h1>

        <div className="mt-6 space-y-4">
          <Input
            label="Usuario"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            autoFocus
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />
        </div>

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? 'Verificando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  );
}
