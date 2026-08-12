'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import PageHeader from '@/components/admin/PageHeader';
import EntityTable from '@/components/admin/EntityTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import SkillForm from '@/components/admin/forms/SkillForm';

const COLUMNS = [
  {
    key: 'icon',
    label: '',
    render: (row) =>
      row.icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={row.icon} alt="" className="h-8 w-8 rounded-lg object-contain" />
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-panel text-[10px] text-muted">
          —
        </span>
      ),
  },
  { key: 'name', label: 'Nombre' },
  { key: 'category', label: 'Categoría', render: (row) => <Badge>{row.category}</Badge> },
  { key: 'level', label: 'Nivel' },
];

export default function SkillsAdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api.get('/skills'));
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(values) {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (editing) await api.put(`/skills/${editing._id}`, values);
      else await api.post('/skills', values);
      setFormOpen(false);
      await load();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.del(`/skills/${deleteTarget._id}`);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Habilidades"
        description="Se agrupan por categoría cuando el chatbot las muestra."
        onCreate={() => {
          setEditing(null);
          setFormOpen(true);
        }}
        createLabel="Nueva habilidad"
      />

      {errorMsg && <p className="mb-4 text-sm text-danger">{errorMsg}</p>}

      {loading ? (
        <p className="text-sm text-muted">Cargando...</p>
      ) : (
        <EntityTable
          columns={COLUMNS}
          rows={items}
          onEdit={(row) => {
            setEditing(row);
            setFormOpen(true);
          }}
          onDelete={setDeleteTarget}
        />
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Editar habilidad' : 'Nueva habilidad'}>
        <SkillForm initialValue={editing || undefined} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} submitting={submitting} />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Eliminar habilidad"
        description={`¿Eliminar "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
