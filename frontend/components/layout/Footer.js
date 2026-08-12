'use client';

import { Github, Linkedin, Twitter, Globe, Mail, MapPin } from 'lucide-react';

export default function Footer({ profile }) {
  const year = new Date().getFullYear();
  const name = profile?.fullName || 'Luis Morales';
  const title = profile?.title || 'Desarrollador Full Stack';
  const email = profile?.email;
  const location = profile?.location;
  const social = profile?.socialLinks || {};

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#070614]/80 backdrop-blur-md pt-12 pb-12 text-white/70">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
          {/* Col 1: Nombre y Estado */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-white">{name}</span>
              {profile?.availableForWork && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Disponible
                </span>
              )}
            </div>
            <p className="font-mono text-xs text-violet-300/80">{title}</p>
            {profile?.shortBio && (
              <p className="text-xs leading-relaxed text-white/50 max-w-sm">{profile.shortBio}</p>
            )}
          </div>

          {/* Col 2: Contacto Directo */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-white/40">Contacto</h4>
            <ul className="space-y-2 text-xs">
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-violet-300"
                  >
                    <Mail size={14} className="text-violet-400" />
                    {email}
                  </a>
                </li>
              )}
              {location && (
                <li className="inline-flex items-center gap-2 text-white/50">
                  <MapPin size={14} className="text-violet-400" />
                  {location}
                </li>
              )}
            </ul>
          </div>

          {/* Col 3: Redes Sociales */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-white/40">Redes Sociales</h4>
            <div className="flex flex-wrap gap-2.5">
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
                  title="GitHub"
                >
                  <Github size={16} />
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
                  title="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
                  title="Twitter / X"
                >
                  <Twitter size={16} />
                </a>
              )}
              {social.website && (
                <a
                  href={social.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-all hover:border-violet-400/40 hover:bg-violet-500/20 hover:text-white"
                  title="Sitio Web"
                >
                  <Globe size={16} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="font-mono text-[11px] text-white/40">
            © {year} {name} · Todos los derechos reservados.
          </p>
          <span className="font-mono text-[11px] uppercase tracking-wider text-violet-300/60">
            Portafolio AI · Impulsado por Gemini ⚡
          </span>
        </div>
      </div>
    </footer>
  );
}
