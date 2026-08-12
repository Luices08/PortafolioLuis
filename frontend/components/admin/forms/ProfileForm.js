'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import ImageUploader from './ImageUploader';

const EMPTY = {
  fullName: '',
  title: '',
  bio: '',
  shortBio: '',
  location: '',
  email: '',
  avatarUrl: '',
  avatarPublicId: '',
  resumeUrl: '',
  availableForWork: true,
  socialLinks: { github: '', linkedin: '', twitter: '', website: '' },
};

export default function ProfileForm({ initialValue, onSubmit, submitting }) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...initialValue,
    socialLinks: { ...EMPTY.socialLinks, ...(initialValue?.socialLinks || {}) },
  });

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function setSocial(field, value) {
    setForm((f) => ({ ...f, socialLinks: { ...f.socialLinks, [field]: value } }));
  }

  // El uploader de imágenes trabaja con arreglos; para el avatar (una sola
  // imagen) lo adaptamos a un arreglo de 0 o 1 elemento.
  const avatarAsArray = form.avatarUrl ? [{ url: form.avatarUrl, publicId: form.avatarPublicId }] : [];
  function handleAvatarChange(images) {
    const img = images[images.length - 1];
    set('avatarUrl', img?.url || '');
    set('avatarPublicId', img?.publicId || '');
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <ImageUploader images={avatarAsArray} onChange={handleAvatarChange} folder="portfolio-ai/profile" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Nombre completo" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} required />
        <Input label="Título profesional" value={form.title} onChange={(e) => set('title', e.target.value)} required placeholder="ej. Full-Stack Developer" />
      </div>

      <Textarea label="Biografía completa" value={form.bio} onChange={(e) => set('bio', e.target.value)} required rows={5} />
      <Textarea
        label="Bio corta (usada como respuesta rápida del chat y en el hero)"
        value={form.shortBio}
        onChange={(e) => set('shortBio', e.target.value)}
        rows={2}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Ubicación" value={form.location} onChange={(e) => set('location', e.target.value)} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
      </div>

      <Input label="URL del CV (PDF)" value={form.resumeUrl} onChange={(e) => set('resumeUrl', e.target.value)} />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.availableForWork}
          onChange={(e) => set('availableForWork', e.target.checked)}
          className="h-4 w-4 rounded border-line bg-panel-2 accent-signal"
        />
        <span className="text-sm text-paper">Disponible para nuevos proyectos</span>
      </label>

      <div className="border-t border-line pt-4">
        <p className="transmission-label mb-3">Redes sociales</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="GitHub" value={form.socialLinks.github} onChange={(e) => setSocial('github', e.target.value)} />
          <Input label="LinkedIn" value={form.socialLinks.linkedin} onChange={(e) => setSocial('linkedin', e.target.value)} />
          <Input label="Twitter / X" value={form.socialLinks.twitter} onChange={(e) => setSocial('twitter', e.target.value)} />
          <Input label="Sitio web" value={form.socialLinks.website} onChange={(e) => setSocial('website', e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end border-t border-line pt-4">
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar perfil'}
        </Button>
      </div>
    </form>
  );
}
