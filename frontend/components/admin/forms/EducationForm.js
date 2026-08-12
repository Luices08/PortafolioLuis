'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

function toDateInput(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

const EMPTY = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
};

export default function EducationForm({ initialValue, onSubmit, onCancel, submitting }) {
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
      <Input label="Institución" value={form.institution} onChange={(e) => set('institution', e.target.value)} required />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Título / Grado" value={form.degree} onChange={(e) => set('degree', e.target.value)} required />
        <Input label="Área de estudio" value={form.fieldOfStudy} onChange={(e) => set('fieldOfStudy', e.target.value)} />
      </div>

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
        <span className="text-sm text-paper">En curso</span>
      </label>

      <Textarea label="Descripción (opcional)" value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} />

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
