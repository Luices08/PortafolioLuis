'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import UiBlock from './ui-blocks';

function timestamp() {
  return new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={clsx('flex flex-col gap-1.5', isUser ? 'items-end' : 'items-start')}
    >
      <span className="transmission-label">
        {isUser ? 'VISITANTE' : 'SEÑAL'} · {timestamp()}
      </span>

      <div
        className={clsx(
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[75%]',
          isUser
            ? 'rounded-tr-sm bg-signal text-ink'
            : message.isError
            ? 'rounded-tl-sm border border-danger/40 bg-danger/10 text-paper'
            : 'rounded-tl-sm border border-line bg-panel-2 text-paper'
        )}
      >
        {message.text}
      </div>

      {message.ui?.length > 0 && (
        <div className="mt-1 w-full max-w-[85%] space-y-3 sm:max-w-[75%]">
          {message.ui.map((block, i) => (
            <UiBlock key={i} block={block} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
