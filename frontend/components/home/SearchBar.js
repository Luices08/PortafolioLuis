'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUp } from 'lucide-react';
import clsx from 'clsx';

const SURPRISE_PROMPTS = [
  '¡Sorpréndeme! Cuéntame sobre tus proyectos más destacados y lo que aprendiste.',
  'Sorpréndeme: ¿Cuál ha sido el mayor desafío técnico que has resuelto?',
  '¡Sorpréndeme! ¿Cuáles son tus mejores habilidades y tecnologías clave?',
  'Sorpréndeme con un proyecto innovador y su arquitectura.',
  '¡Sorpréndeme! ¿Quién eres y qué es lo que más te motiva como desarrollador?',
];

export default function SearchBar({ variant = 'hero', onSend, disabled, placeholder }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e?.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
  }

  function handleSurprise() {
    if (disabled) return;
    const randomPrompt = SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
    onSend(randomPrompt);
  }

  const hasText = value.trim().length > 0;
  const isHero = variant === 'hero';

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      className={clsx(
        'glass-pill mx-auto flex w-full items-center gap-3 rounded-full px-5 shadow-glow',
        isHero ? 'max-w-2xl py-4' : 'max-w-3xl py-3'
      )}
    >
      <div className="relative flex items-center group">
        <button
          type="button"
          disabled={disabled}
          onClick={handleSurprise}
          title="Sorpréndeme"
          className="relative flex items-center justify-center rounded-full p-1.5 text-violet-300 transition-all hover:bg-violet-500/20 hover:text-amber-300 hover:scale-110 active:scale-95 disabled:opacity-50"
        >
          <Sparkles size={isHero ? 20 : 17} className="shrink-0 transition-colors" />
        </button>

        <span className="pointer-events-none absolute left-1/2 -top-10 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-30 rounded-full border border-violet-400/30 bg-[#0c0a1d]/90 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-violet-200 shadow-xl backdrop-blur-md whitespace-nowrap">
          Sorpréndeme
        </span>
      </div>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          'flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none',
          isHero ? 'text-base' : 'text-sm'
        )}
      />

      {hasText && (
        <button
          type="submit"
          disabled={disabled}
          aria-label="Enviar pregunta"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white transition-transform hover:scale-105 disabled:opacity-40"
        >
          <ArrowUp size={16} />
        </button>
      )}
    </motion.form>
  );
}
