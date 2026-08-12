'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import PageHeader from '@/components/admin/PageHeader';
import EntityTable from '@/components/admin/EntityTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import ProjectForm from '@/components/admin/forms/ProjectForm';

const COLUMNS = [
  { key: 'title', label: 'Título' },
  {
    key: 'status',
    label: 'Estado',
    render: (row) => (
      <Badge tone={row.status === 'published' ? 'pulse' : 'default'}>
        {row.status === 'published' ? 'Publicado' : 'Borrador'}
      </Badge>
    ),
  },
  { key: 'featured', label: 'Destacado', render: (row) => (row.featured ? 'Sí' : '—') },
  {
    key: 'technologies',
    label: 'Tecnologías',
    render: (row) => (row.technologies || []).slice(0, 3).join(', ') || '—',
  },
];

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState([]);
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
      const data = await api.get('/projects/admin/all');
      setProjects(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(project) {
    setEditing(project);
    setFormOpen(true);
  }

  async function handleSubmit(values) {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (editing) {
        await api.put(`/projects/admin/${editing._id}`, values);
      } else {
        await api.post('/projects/admin', values);
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.del(`/projects/admin/${deleteTarget._id}`);
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
        title="Proyectos"
        description="Estos proyectos son el contexto que el chatbot usa para responder sobre tu trabajo."
        onCreate={openCreate}
        createLabel="Nuevo proyecto"
      />

      {errorMsg && <p className="mb-4 text-sm text-danger">{errorMsg}</p>}

      {loading ? (
        <p className="text-sm text-muted">Cargando...</p>
      ) : (
        <EntityTable columns={COLUMNS} rows={projects} onEdit={openEdit} onDelete={setDeleteTarget} />
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Editar proyecto' : 'Nuevo proyecto'}
        widthClass="max-w-2xl"
      >
        <ProjectForm
          initialValue={editing || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          submitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Eliminar proyecto"
        description={`¿Eliminar "${deleteTarget?.title}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
}
