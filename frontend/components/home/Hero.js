'use client';

import { motion } from 'framer-motion';

export default function Hero({ profile }) {
  const firstName = profile?.fullName || 'este portafolio';
  const title = profile?.title || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mb-8 text-center"
    >
      <p className="mb-3 font-mono text-sm text-white/50">
        Hola <span className="inline-block animate-[floatChip_2.4s_ease-in-out_infinite]">👋</span>
      </p>
      <h1 className="gradient-text font-display text-5xl font-semibold leading-tight sm:text-6xl">
        Soy {firstName}
      </h1>
      {title && (
        <p className="mt-3 text-lg text-white/70 sm:text-xl">{title}</p>
      )}
      <p className="mt-2 text-sm italic text-white/40">
        {profile?.shortBio || 'Conocé mi perfil preguntando lo que quieras.'}
      </p>
    </motion.div>
  );
}
