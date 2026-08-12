'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import TagInput from '@/components/ui/TagInput';
import Button from '@/components/ui/Button';

function toDateInput(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

const EMPTY = {
  company: '',
  role: '',
  location: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  technologies: [],
};

export default function ExperienceForm({ initialValue, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...initialValue,
    startDate: toDateInput(initialValue?.startDate),
    endDate: toDateInput(initialValue?.endDate),
  });

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ ...form, endDate: form.isCurrent ? null : form.endDate || null });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Empresa" value={form.company} onChange={(e) => set('company', e.target.value)} required />
        <Input label="Rol" value={form.role} onChange={(e) => set('role', e.target.value)} required />
      </div>

      <Input label="Ubicación" value={form.location} onChange={(e) => set('location', e.target.value)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Fecha de inicio" type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} required />
        <Input
          label="Fecha de fin"
          type="date"
          value={form.endDate}
          onChange={(e) => set('endDate', e.target.value)}
          disabled={form.isCurrent}
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.isCurrent}
          onChange={(e) => set('isCurrent', e.target.checked)}
          className="h-4 w-4 rounded border-line bg-panel-2 accent-signal"
        />
        <span className="text-sm text-paper">Trabajo actual</span>
      </label>

      <Textarea label="Descripción" value={form.description} onChange={(e) => set('description', e.target.value)} required rows={3} />

      <TagInput label="Tecnologías" value={form.technologies} onChange={(v) => set('technologies', v)} />

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
