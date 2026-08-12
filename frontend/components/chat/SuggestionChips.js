'use client';

const SUGGESTIONS = [
  '¿Qué proyectos destacas?',
  '¿En qué tecnologías tienes más experiencia?',
  'Cuéntame tu experiencia laboral',
  '¿Cómo te contacto?',
];

export default function SuggestionChips({ onPick, disabled }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => onPick(s)}
          className="rounded-full border border-line bg-panel-2 px-3 py-1.5 text-xs text-muted transition-colors hover:border-signal/50 hover:text-paper disabled:opacity-50"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
