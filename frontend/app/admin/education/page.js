'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import PageHeader from '@/components/admin/PageHeader';
import EntityTable from '@/components/admin/EntityTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Modal from '@/components/ui/Modal';
import EducationForm from '@/components/admin/forms/EducationForm';

function formatDate(value) {
  if (!value) return 'Actualidad';
  return new Date(value).toLocaleDateString('es', { month: 'short', year: 'numeric' });
}

const COLUMNS = [
  { key: 'degree', label: 'Título / Grado' },
  { key: 'institution', label: 'Institución' },
  {
    key: 'period',
    label: 'Periodo',
    render: (row) => `${formatDate(row.startDate)} — ${row.isCurrent ? 'Actualidad' : formatDate(row.endDate)}`,
  },
];

export default function EducationAdminPage() {
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
      setItems(await api.get('/education'));
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
      if (editing) await api.put(`/education/${editing._id}`, values);
      else await api.post('/education', values);
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
      await api.del(`/education/${deleteTarget._id}`);
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
        title="Educación"
        description="Formación académica que el chatbot puede citar."
        onCreate={() => {
          setEditing(null);
          setFormOpen(true);
        }}
        createLabel="Nueva formación"
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

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Editar formación' : 'Nueva formación'} widthClass="max-w-xl">
        <EducationForm initialValue={editing || undefined} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} submitting={submitting} />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Eliminar formación"
        description={`¿Eliminar "${deleteTarget?.degree}"?`}
      />
    </div>
  );
}
