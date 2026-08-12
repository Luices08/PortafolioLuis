'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import ImageUploader from './ImageUploader';

const EMPTY = { name: '', category: 'other', level: 'intermedio', icon: '', iconPublicId: '' };

export default function SkillForm({ initialValue, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ ...EMPTY, ...initialValue });

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // ImageUploader trabaja con arreglos; para un ícono único lo adaptamos
  // a un arreglo de 0 o 1 elemento (mismo patrón que el avatar del perfil).
  const iconAsArray = form.icon ? [{ url: form.icon, publicId: form.iconPublicId }] : [];
  function handleIconChange(images) {
    const img = images[images.length - 1];
    set('icon', img?.url || '');
    set('iconPublicId', img?.publicId || '');
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <ImageUploader images={iconAsArray} onChange={handleIconChange} folder="portfolio-ai/skills" />
      <p className="-mt-2 text-xs text-muted">
        El ícono se usa en el sitio público para mostrar esta tecnología como una tarjeta grande en vez de una
        etiqueta de texto. Si no subes uno, se muestra un monograma de color.
      </p>

      <Input label="Nombre" value={form.name} onChange={(e) => set('name', e.target.value)} required />

      <Select label="Categoría" value={form.category} onChange={(e) => set('category', e.target.value)}>
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
        <option value="database">Bases de datos</option>
        <option value="devops">DevOps</option>
        <option value="ai">IA</option>
        <option value="tools">Herramientas</option>
        <option value="soft-skills">Habilidades blandas</option>
        <option value="other">Otra</option>
      </Select>

      <Select label="Nivel" value={form.level} onChange={(e) => set('level', e.target.value)}>
        <option value="basico">Básico</option>
        <option value="intermedio">Intermedio</option>
        <option value="avanzado">Avanzado</option>
        <option value="experto">Experto</option>
      </Select>

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
