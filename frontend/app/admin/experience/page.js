'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import PageHeader from '@/components/admin/PageHeader';
import EntityTable from '@/components/admin/EntityTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Modal from '@/components/ui/Modal';
import ExperienceForm from '@/components/admin/forms/ExperienceForm';

function formatDate(value) {
  if (!value) return 'Actualidad';
  return new Date(value).toLocaleDateString('es', { month: 'short', year: 'numeric' });
}

const COLUMNS = [
  { key: 'role', label: 'Rol' },
  { key: 'company', label: 'Empresa' },
  {
    key: 'period',
    label: 'Periodo',
    render: (row) => `${formatDate(row.startDate)} — ${row.isCurrent ? 'Actualidad' : formatDate(row.endDate)}`,
  },
];

export default function ExperienceAdminPage() {
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
      setItems(await api.get('/experience'));
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
      if (editing) await api.put(`/experience/${editing._id}`, values);
      else await api.post('/experience', values);
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
      await api.del(`/experience/${deleteTarget._id}`);
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
        title="Experiencia"
        description="Historial laboral que el chatbot puede citar cuando le pregunten por tu trayectoria."
        onCreate={() => {
          setEditing(null);
          setFormOpen(true);
        }}
        createLabel="Nueva experiencia"
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

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Editar experiencia' : 'Nueva experiencia'} widthClass="max-w-xl">
        <ExperienceForm initialValue={editing || undefined} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} submitting={submitting} />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Eliminar experiencia"
        description={`¿Eliminar "${deleteTarget?.role} en ${deleteTarget?.company}"?`}
      />
    </div>
  );
}
