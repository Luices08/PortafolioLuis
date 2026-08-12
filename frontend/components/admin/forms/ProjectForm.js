'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import TagInput from '@/components/ui/TagInput';
import Button from '@/components/ui/Button';
import ImageUploader from './ImageUploader';

const EMPTY_PROJECT = {
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  status: 'draft',
  featured: false,
  technologies: [],
  categories: [],
  features: [],
  challenges: [],
  solutions: [],
  learnings: [],
  myRole: '',
  duration: '',
  images: [],
  githubUrl: '',
  demoUrl: '',
  videoUrl: '',
};

export default function ProjectForm({ initialValue, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ ...EMPTY_PROJECT, ...initialValue });

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Título" value={form.title} onChange={(e) => set('title', e.target.value)} required />
        <Input
          label="Slug (opcional, se genera del título)"
          value={form.slug}
          onChange={(e) => set('slug', e.target.value)}
          placeholder="mi-proyecto"
        />
      </div>

      <Textarea
        label="Descripción corta (máx. 280 caracteres)"
        value={form.shortDescription}
        onChange={(e) => set('shortDescription', e.target.value)}
        maxLength={280}
        required
        rows={2}
      />

      <Textarea
        label="Descripción completa"
        value={form.fullDescription}
        onChange={(e) => set('fullDescription', e.target.value)}
        required
        rows={4}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select label="Estado" value={form.status} onChange={(e) => set('status', e.target.value)}>
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
        </Select>
        <label className="flex items-center gap-2 self-end pb-2.5">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set('featured', e.target.checked)}
            className="h-4 w-4 rounded border-line bg-panel-2 accent-signal"
          />
          <span className="text-sm text-paper">Destacado</span>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Mi rol" value={form.myRole} onChange={(e) => set('myRole', e.target.value)} />
        <Input label="Duración" value={form.duration} onChange={(e) => set('duration', e.target.value)} placeholder="ej. 3 meses" />
      </div>

      <TagInput label="Tecnologías" value={form.technologies} onChange={(v) => set('technologies', v)} placeholder="React, Node.js..." />
      <TagInput label="Categorías" value={form.categories} onChange={(v) => set('categories', v)} placeholder="Full-Stack, IA..." />
      <TagInput label="Funcionalidades" value={form.features} onChange={(v) => set('features', v)} placeholder="Escribe y presiona Enter" />
      <TagInput label="Desafíos" value={form.challenges} onChange={(v) => set('challenges', v)} placeholder="Escribe y presiona Enter" />
      <TagInput label="Soluciones" value={form.solutions} onChange={(v) => set('solutions', v)} placeholder="Escribe y presiona Enter" />
      <TagInput label="Aprendizajes" value={form.learnings} onChange={(v) => set('learnings', v)} placeholder="Escribe y presiona Enter" />

      <ImageUploader images={form.images} onChange={(v) => set('images', v)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input label="GitHub" value={form.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} placeholder="https://github.com/..." />
        <Input label="Demo" value={form.demoUrl} onChange={(e) => set('demoUrl', e.target.value)} placeholder="https://..." />
        <Input label="Video" value={form.videoUrl} onChange={(e) => set('videoUrl', e.target.value)} placeholder="https://..." />
      </div>

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar proyecto'}
        </Button>
      </div>
    </form>
  );
}
