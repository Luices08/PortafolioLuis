'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

// Input simple para arreglos de strings (tecnologías, categorías, features, etc.)
// Se escribe y se confirma con Enter o coma.
export default function TagInput({ label, value = [], onChange, placeholder }) {
  const [draft, setDraft] = useState('');

  function commit() {
    const clean = draft.trim();
    if (clean && !value.includes(clean)) {
      onChange([...value, clean]);
    }
    setDraft('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function removeAt(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      {label && <span className="mb-1.5 block text-sm font-medium text-paper">{label}</span>}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-line bg-panel-2 px-3 py-2.5 focus-within:border-signal/60">
        {value.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex items-center gap-1 rounded-full bg-panel px-2.5 py-1 text-xs font-mono text-paper"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="text-muted hover:text-danger"
              aria-label={`Quitar ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commit}
          placeholder={value.length === 0 ? placeholder : ''}
          className="min-w-[120px] flex-1 bg-transparent text-sm text-paper placeholder:text-muted/60 focus:outline-none"
        />
      </div>
      <span className="mt-1 block text-xs text-muted">Presiona Enter o coma para agregar</span>
    </div>
  );
}
