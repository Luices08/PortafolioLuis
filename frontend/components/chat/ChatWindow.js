'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SuggestionChips from './SuggestionChips';
import ChatInput from './ChatInput';

export default function ChatWindow() {
  const { messages, sendMessage, isSending } = useChat();
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isSending]);

  const showSuggestions = messages.length <= 1;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pulse opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-pulse" />
          </span>
          <span className="transmission-label">canal abierto</span>
        </div>
        <span className="transmission-label">asistente · gemini</span>
      </div>

      <div ref={scrollRef} className="thin-scroll flex-1 space-y-5 overflow-y-auto px-4 py-5">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isSending && <TypingIndicator />}
      </div>

      <div className="px-4 pb-3">
        {showSuggestions && <SuggestionChips onPick={sendMessage} disabled={isSending} />}
      </div>

      <ChatInput onSend={sendMessage} disabled={isSending} />
    </div>
  );
}
