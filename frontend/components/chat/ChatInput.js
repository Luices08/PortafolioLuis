'use client';

import { useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-line bg-panel p-3">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        rows={1}
        placeholder="Pregunta sobre proyectos, tecnologías, experiencia..."
        className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 font-mono text-sm text-paper placeholder:text-muted/60 focus:outline-none"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Enviar mensaje"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-signal text-ink transition-opacity disabled:opacity-40"
      >
        <ArrowUp size={16} />
      </button>
    </form>
  );
}
