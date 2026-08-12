'use client';

import { useCallback, useRef, useState } from 'react';
import { api } from '@/lib/apiClient';

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `turn-${Date.now()}-${idCounter}`;
}

const MAX_HISTORY_TURNS = 4;

// Cada "turno" agrupa la pregunta del visitante con su respuesta, en vez de
// manejar una lista plana de mensajes tipo burbuja de chat. Encaja mejor con
// una interfaz de "búsqueda conversacional" donde el input vive arriba y los
// resultados se apilan debajo.
export function useChat() {
  const [turns, setTurns] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const turnsRef = useRef(turns);
  turnsRef.current = turns;

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const id = nextId();
    setTurns((prev) => [...prev, { id, question: trimmed, status: 'loading', answer: '', ui: [] }]);
    setIsSending(true);

    const history = turnsRef.current
      .filter((t) => t.status === 'done')
      .slice(-MAX_HISTORY_TURNS)
      .flatMap((t) => [
        { role: 'user', text: t.question },
        { role: 'assistant', text: t.answer },
      ]);

    try {
      const data = await api.post('/chat', { message: trimmed, history });

      let answerText = data.message;
      let uiBlocks = data.ui || [];

      // Si por alguna razón el mensaje viene como un string JSON crudo, lo desempacamos
      if (typeof answerText === 'string' && answerText.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(answerText);
          if (parsed.message) {
            answerText = parsed.message;
            if (Array.isArray(parsed.ui) && uiBlocks.length === 0) {
              uiBlocks = parsed.ui;
            }
          }
        } catch (e) {
          const match = answerText.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/);
          if (match && match[1]) {
            answerText = match[1]
              .replace(/\\n/g, '\n')
              .replace(/\\r/g, '')
              .replace(/\\"/g, '"')
              .replace(/\\\\/g, '\\');
          }
        }
      }

      const suggestionsList = Array.isArray(data.suggestions) && data.suggestions.length > 0
        ? data.suggestions
        : [
            '¿Qué herramientas y tecnologías utilizas?',
            '¿Dónde estudiaste / cuál es tu educación?',
            '¿Quién soy / sobre mí?',
            '¿Qué otros proyectos tienes?',
          ];

      setTurns((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status: 'done',
                answer: answerText,
                suggestions: suggestionsList,
                ui: uiBlocks,
              }
            : t
        )
      );
    } catch (err) {
      setTurns((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status: 'error',
                answer: err.message || 'No pude procesar tu pregunta. Intenta de nuevo en unos segundos.',
                ui: [],
              }
            : t
        )
      );
    } finally {
      setIsSending(false);
    }
  }, [isSending]);

  return { turns, sendMessage, isSending };
}
