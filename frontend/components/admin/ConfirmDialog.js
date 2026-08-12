'use client';

import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} widthClass="max-w-sm">
      <p className="text-sm text-muted">{description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="danger" size="sm" onClick={onConfirm} disabled={loading}>
          {loading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </div>
    </Modal>
  );
}
