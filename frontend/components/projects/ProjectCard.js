'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import ProjectDetailModal from './ProjectDetailModal';

export default function ProjectCard({ project, compact = false }) {
  const [open, setOpen] = useState(false);
  const cover = project.images?.[0]?.url;

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ y: -3 }}
        className="glass-card group flex w-full flex-col overflow-hidden rounded-2xl text-left transition-colors hover:border-violet-300/30"
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={project.images[0].alt || project.title} className="h-36 w-full object-cover" />
        ) : (
          <div className="flex h-36 w-full items-center justify-center bg-white/[0.03]">
            <span className="font-mono text-xs text-white/30">// sin imagen</span>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-2.5 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold text-white">{project.title}</h3>
            <ArrowUpRight
              size={16}
              className="mt-1 shrink-0 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-violet-300"
            />
          </div>

          {!compact && (
            <p className="text-sm leading-relaxed text-white/50 line-clamp-2">{project.shortDescription}</p>
          )}

          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {(project.technologies || []).slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.button>

      <ProjectDetailModal project={project} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
