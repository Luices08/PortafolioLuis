'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, PlayCircle } from 'lucide-react';
import TechTile from '@/components/shared/TechTile';

function Section({ title, items }) {
  if (!items || !Array.isArray(items) || items.length === 0) return null;
  return (
    <div className="border-t border-white/10 pt-4">
      <h4 className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-violet-300">{title}</h4>
      <BulletList items={items} />
    </div>
  );
}

function BulletList({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed text-white/75">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function formatExternalUrl(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function ProjectDetailModal({ project, open, onClose }) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!project || typeof document === 'undefined') return null;
  const images = project.images || [];
  const description = project.fullDescription || project.shortDescription;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-[#05040d]/85 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            className="glass-card thin-scroll relative z-10 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 shadow-2xl sm:p-8"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22 }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 className="font-display text-xl font-semibold text-white">{project.title}</h2>
              <button
                onClick={onClose}
                className="shrink-0 rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              {images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto thin-scroll">
                  {images.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={img.url}
                      alt={img.alt || `${project.title} ${i + 1}`}
                      className="h-48 shrink-0 rounded-xl object-cover"
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {project.myRole && (
                  <span className="rounded-full border border-violet-300/30 bg-violet-500/10 px-3 py-1 text-violet-200">
                    {project.myRole}
                  </span>
                )}
                {project.duration && (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-white/60">
                    {project.duration}
                  </span>
                )}
              </div>

              {description && (
                <p className="text-sm leading-relaxed text-white/80 whitespace-pre-line">{description}</p>
              )}

              {project.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-4 pt-1">
                  {project.technologies.map((tech) => (
                    <TechTile key={tech} name={tech} size="sm" />
                  ))}
                </div>
              )}

              <Section title="Funcionalidades" items={project.features} />
              <Section title="Desafíos" items={project.challenges} />
              <Section title="Soluciones" items={project.solutions} />
              <Section title="Aprendizajes" items={project.learnings} />

              {(project.githubUrl || project.demoUrl || project.videoUrl) && (
                <div className="flex flex-wrap gap-4 border-t border-white/10 pt-4">
                  {project.githubUrl && (
                    <a
                      href={formatExternalUrl(project.githubUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-violet-300"
                    >
                      <Github size={16} /> Código
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={formatExternalUrl(project.demoUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-violet-300"
                    >
                      <ExternalLink size={16} /> Demo en vivo
                    </a>
                  )}
                  {project.videoUrl && (
                    <a
                      href={formatExternalUrl(project.videoUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-violet-300"
                    >
                      <PlayCircle size={16} /> Video
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
