'use client';

import ConversationTurn from './ConversationTurn';

export default function ConversationFeed({ turns, onPick, disabled }) {
  if (!turns || turns.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10 px-4 pb-24 pt-8 sm:px-6">
      {turns.map((turn) => (
        <ConversationTurn key={turn.id} turn={turn} onPick={onPick} disabled={disabled} />
      ))}
    </div>
  );
}
