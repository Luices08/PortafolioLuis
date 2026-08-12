'use client';

import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useChat } from '@/hooks/useChat';
import { useSkillIcons } from '@/context/SkillIconContext';
import CosmicBackground from './CosmicBackground';
import Hero from './Hero';
import SearchBar from './SearchBar';
import FloatingSuggestions from './FloatingSuggestions';
import ConversationFeed from './ConversationFeed';
import AdminLink from './AdminLink';
import ProjectCard from '@/components/projects/ProjectCard';
import Footer from '@/components/layout/Footer';

export default function HomeExperience({ profile, featuredProjects, categorySeeds }) {
  const { turns, sendMessage, isSending } = useChat();
  const { skills } = useSkillIcons();
  const idle = turns.length === 0;

  const chipItems = useMemo(() => {
    const skillNames = skills.slice(0, 6).map((s) => s.name);
    const merged = [...skillNames, ...categorySeeds];
    return Array.from(new Set(merged)).slice(0, 8);
  }, [skills, categorySeeds]);

  return (
    <main className="relative min-h-screen flex flex-col justify-between">
      <CosmicBackground />
      <AdminLink />

      <div className="relative z-10 flex flex-1 flex-col justify-between">
        <div>


          {/* Hero e input en pantalla de inicio (idle) */}
          {idle && (
            <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-24">
              <AnimatePresence>
                <Hero key="hero" profile={profile} />
              </AnimatePresence>

              <div className="relative z-10 w-full">
                <SearchBar
                  variant="hero"
                  onSend={sendMessage}
                  disabled={isSending}
                  placeholder="Pregúntame sobre proyectos, experiencia, tecnologías..."
                />
              </div>

              <AnimatePresence>
                <div className="absolute inset-0 pointer-events-none">
                  <FloatingSuggestions items={chipItems} onPick={sendMessage} disabled={isSending} />
                </div>
              </AnimatePresence>
            </div>
          )}

          {/* Feed de conversación activa */}
          {!idle && (
            <div className="pb-8">
              <ConversationFeed turns={turns} onPick={sendMessage} disabled={isSending} />
            </div>
          )}
        </div>

        {/* Barra de búsqueda flotante en la PARTE INFERIOR durante la búsqueda (sin colisionar) */}
        {!idle && (
          <div className="sticky bottom-4 z-30 mx-auto w-full max-w-3xl px-4 sm:px-6 my-4">
            <div className="rounded-full bg-[#070514]/85 backdrop-blur-xl p-1.5 shadow-2xl border border-violet-500/20">
              <SearchBar
                variant="bar"
                onSend={sendMessage}
                disabled={isSending}
                placeholder="Haz otra pregunta sobre proyectos, experiencia..."
              />
            </div>
          </div>
        )}

        {/* Proyectos destacados iniciales */}
        {idle && featuredProjects.length > 0 && (
          <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-24">
            <div className="mb-5 flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-white/40">
                Proyectos destacados
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Footer siempre visible al final */}
        <Footer profile={profile} />
      </div>
    </main>
  );
}
