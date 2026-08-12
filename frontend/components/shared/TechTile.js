'use client';

import { useSkillIcon } from '@/context/SkillIconContext';

// Paleta de degradados para el monograma de respaldo cuando la tecnología
// todavía no tiene ícono cargado desde el admin. Se elige de forma
// determinista según el nombre, para que cada tecnología tenga siempre
// el mismo color.
const GRADIENTS = [
  'from-violet-500 to-fuchsia-500',
  'from-cyan-400 to-blue-500',
  'from-fuchsia-500 to-pink-500',
  'from-indigo-500 to-violet-500',
  'from-sky-400 to-cyan-500',
  'from-purple-500 to-indigo-500',
];

function gradientFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

function initials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const SIZES = {
  sm: { tile: 'h-12 w-12', img: 'h-7 w-7', text: 'text-[10px]', label: 'text-[11px]' },
  md: { tile: 'h-16 w-16', img: 'h-9 w-9', text: 'text-xs', label: 'text-xs' },
  lg: { tile: 'h-20 w-20', img: 'h-11 w-11', text: 'text-sm', label: 'text-sm' },
};

export default function TechTile({ name, iconUrl, size = 'md', showLabel = true }) {
  const resolvedFromContext = useSkillIcon(name);
  const icon = iconUrl || resolvedFromContext;
  const dims = SIZES[size] || SIZES.md;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex ${dims.tile} items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-glow backdrop-blur-md transition-transform duration-200 hover:-translate-y-1 hover:border-violet-400/40`}
      >
        {icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={icon} alt={name} className={`${dims.img} object-contain`} />
        ) : (
          <span
            className={`flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br ${gradientFor(
              name
            )} ${dims.text} font-display font-semibold text-white/90`}
          >
            {initials(name)}
          </span>
        )}
      </div>
      {showLabel && <span className={`${dims.label} text-center text-white/70`}>{name}</span>}
    </div>
  );
}
