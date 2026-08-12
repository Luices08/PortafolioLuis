'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import ProfileForm from '@/components/admin/forms/ProfileForm';

export default function ProfileAdminPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    api
      .get('/profile')
      .then(setProfile)
      .catch(() => setProfile(null)) // 404 esperado si aún no existe
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(values) {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const updated = await api.put('/profile', values);
      setProfile(updated);
      setSavedAt(new Date());
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <span className="transmission-label text-signal">documento singleton</span>
      <h1 className="mt-2 font-display text-xl font-semibold text-paper">Perfil</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Esta es la información base que el chatbot usa para presentarte. Solo existe un perfil.
      </p>

      {errorMsg && <p className="mt-4 text-sm text-danger">{errorMsg}</p>}
      {savedAt && !errorMsg && <p className="mt-4 text-sm text-pulse">Perfil guardado correctamente.</p>}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-muted">Cargando...</p>
        ) : (
          <ProfileForm initialValue={profile || undefined} onSubmit={handleSubmit} submitting={submitting} />
        )}
      </div>
    </div>
  );
}
