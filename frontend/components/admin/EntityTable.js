'use client';

import { Pencil, Trash2 } from 'lucide-react';

// Tabla genérica reutilizable para las secciones CRUD del admin.
// columns: [{ key, label, render?(row) }]
export default function EntityTable({ columns, rows, onEdit, onDelete, emptyLabel = 'Sin registros todavía' }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line px-6 py-12 text-center">
        <p className="text-sm text-muted">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-panel-2">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-muted">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id} className="border-b border-line last:border-0 hover:bg-panel-2/60">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-paper/90">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(row)}
                    className="rounded-lg p-1.5 text-muted hover:bg-panel-2 hover:text-signal"
                    aria-label="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    className="rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
