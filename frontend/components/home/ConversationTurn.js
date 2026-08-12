'use client';

import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import UiBlock, { TYPE_LABELS } from './blocks';

function foundTags(ui) {
  const set = new Set();
  (ui || []).forEach((b) => {
    if (TYPE_LABELS[b.type]) set.add(TYPE_LABELS[b.type]);
  });
  return Array.from(set);
}

function eyebrowFor(ui) {
  const types = (ui || []).map((b) => b.type);
  if (types.includes('project') || types.includes('project_list')) return 'Sobre los proyectos';
  if (types.includes('skill_list')) return 'Sobre el stack técnico';
  if (types.includes('experience')) return 'Sobre la experiencia';
  if (types.includes('contact')) return 'Cómo contactar';
  return 'Respuesta';
}

export default function ConversationTurn({ turn, onPick, disabled }) {
  const { question, status, answer, suggestions, ui } = turn;
  const isLoading = status === 'loading';
  const isError = status === 'error';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      <p className="font-mono text-xs text-white/35">
        <span className="text-violet-400">›</span> {question}
      </p>

      {isLoading && (
        <div className="glass-card flex items-center gap-3 rounded-2xl px-5 py-4">
          <Loader2 size={16} className="animate-spin text-violet-300" />
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/50">
            Buscando en el portafolio…
          </span>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {isError ? (
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-red-300">
                <AlertCircle size={14} /> No se pudo responder
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-emerald-300">
                <CheckCircle2 size={14} /> Listo
              </span>
            )}
            {foundTags(ui).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-white/50"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="glass-card rounded-2xl p-5 sm:p-6">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-violet-300">
              {isError ? 'Aviso' : eyebrowFor(ui)}
            </p>
            <p className="text-sm leading-relaxed text-white/85 sm:text-[15px] whitespace-pre-line">{answer}</p>
          </div>

          {ui?.map((block, i) => (
            <UiBlock key={i} block={block} />
          ))}

          {!isError && suggestions?.length > 0 && (
            <div className="glass-card rounded-2xl p-4 space-y-2.5 border-violet-500/20 bg-white/[0.02]">
              <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-violet-300">
                <Sparkles size={13} /> ¿Quieres saber más de este tema relacionado?
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={disabled}
                    onClick={() => onPick?.(item)}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-sans text-xs text-white/80 transition-colors hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-white disabled:opacity-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
