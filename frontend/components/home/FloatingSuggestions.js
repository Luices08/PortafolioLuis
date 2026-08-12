'use client';

import { motion } from 'framer-motion';

// Posiciones "orgánicas" alrededor del centro, como coordenadas en % del contenedor.
// Se dejan más slots que los que normalmente se usan para poder rotar variedad.
const SLOTS = [
  { top: '10%', left: '8%' },
  { top: '18%', left: '82%' },
  { top: '46%', left: '3%' },
  { top: '50%', left: '92%' },
  { top: '80%', left: '12%' },
  { top: '84%', left: '78%' },
  { top: '6%', left: '46%' },
  { top: '92%', left: '46%' },
];

export default function FloatingSuggestions({ items, onPick, disabled }) {
  if (!items || items.length === 0) return null;
  const chips = items.slice(0, SLOTS.length);

  return (
    <>
      {/* Escritorio: chips flotando dispersos alrededor del hero */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        {chips.map((item, i) => (
          <motion.button
            key={item}
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.05, duration: 0.4 }}
            onClick={() => onPick(item)}
            disabled={disabled}
            style={{ top: SLOTS[i].top, left: SLOTS[i].left, animationDelay: `${i * 0.35}s` }}
            className="glass-pill pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 animate-floatChip whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs text-white/70 transition-colors hover:border-violet-300/40 hover:text-white disabled:opacity-40"
          >
            {item}
          </motion.button>
        ))}
      </div>

      {/* Móvil: fila compacta debajo del input */}
      <div className="mt-6 flex flex-wrap justify-center gap-2 sm:hidden">
        {chips.slice(0, 5).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onPick(item)}
            disabled={disabled}
            className="glass-pill rounded-full px-3 py-1.5 text-xs text-white/70 disabled:opacity-40"
          >
            {item}
          </button>
        ))}
      </div>
    </>
  );
}
