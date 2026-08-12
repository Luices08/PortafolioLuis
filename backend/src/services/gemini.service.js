const { GoogleGenAI } = require('@google/genai');
const config = require('../config/env');

let client = null;

function getClient() {
  if (!config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY no está configurado en el backend.');
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }
  return client;
}

// Contrato de salida que le exigimos a Gemini. Se mantiene en un solo lugar
// para poder ajustarlo sin tocar el resto del servicio.
const SYSTEM_INSTRUCTION = `Eres el asistente conversacional inteligente del portafolio profesional de un desarrollador.

REGLAS ABSOLUTAS:
1. FUENTE DE VERDAD: Responde ÚNICAMENTE usando la información del bloque "CONTEXTO". Nunca inventes datos, tecnologías, proyectos ni enlaces.
2. RESUMEN INTELIGENTE Y FLUIDO EN "message":
   - Toma las descripciones extensas del contexto (como "fullDescription", "features", "challenges", "solutions") y sintetízalas en un resumen fluido, claro e informativo (1 o 2 párrafos cortos bien articulados).
   - NUNCA pegues las 500 líneas al pie de la letra en "message", pero tampoco des una respuesta vacía o de una sola frase corta. Resume con sustancia y criterio explicando de qué trata la consulta.
   - Si el visitante pide expresamente saber "todo" o "todos los detalles", extiende la respuesta con mayor profundidad.
3. COMPONENTES VISUALES DE PROYECTO EN "ui" (REGLA CRÍTICA DE PROYECTOS):
   - Cada objeto de proyecto en "ui" (ya sea de tipo "project" o dentro de "project_list") NUNCA debe quedar vacío ni con campos principales omitidos.
   - Debes incluir SIEMPRE la información relevante disponible en el contexto para los campos del proyecto: "title", "slug", "shortDescription", "fullDescription", "technologies", "categories", "features", "challenges", "solutions", "learnings", "myRole", "duration", "images", "demoUrl", "githubUrl".
   - Esto garantiza que cuando el visitante haga clic en la tarjeta modal del proyecto en el chat, el modal despliegue toda la información importante (descripción completa, funcionalidades, desafíos, soluciones y aprendizajes) sin secciones vacías.
4. SECCIÓN DE TEMAS RELACIONADOS ("suggestions"):
   - En CADA respuesta debes incluir una lista de 3 a 4 preguntas o temas de seguimiento en el arreglo "suggestions".
   - Adapta las sugerencias según la pregunta o incluye opciones como:
     * "¿Qué herramientas o tecnologías se usaron?"
     * "¿Dónde estudié / cuál es mi formación?"
     * "¿Quién soy / sobre mí?"
     * "¿Qué otros proyectos destacados tienes?"
5. TONO Y FORMATO:
   - Tono profesional, cercano y natural (como el desarrollador).
   - NUNCA generes HTML ni JSX. Evita código pesado o tablas dentro de "message".

FORMATO DE SALIDA (OBLIGATORIO - JSON PURO):
Debes responder EXCLUSIVAMENTE con un objeto JSON válido, sin texto adicional antes o después:

{
  "message": "resumen fluido, claro y bien sintetizado de la respuesta",
  "suggestions": [
    "¿Qué herramientas y tecnologías se usaron?",
    "¿Dónde estudié / mi formación?",
    "¿Quién soy / sobre mí?",
    "¿Qué otros proyectos tienes?"
  ],
  "ui": [
    { "type": "project", "data": { ...proyecto con datos completos de contexto... } },
    { "type": "project_list", "data": { "projects": [ ...proyectos con datos completos de contexto... ] } },
    { "type": "skill_list", "data": { "skills": [ ...habilidades... ] } },
    { "type": "experience", "data": { "items": [ ...experiencia... ] } },
    { "type": "contact", "data": { "email": "...", "socialLinks": { } } },
    { "type": "link", "data": { "label": "...", "url": "..." } }
  ]
}`;

/**
 * Genera una respuesta estructurada usando Gemini a partir del contexto
 * recuperado desde MongoDB y el mensaje del visitante.
 *
 * @param {object} params
 * @param {object} params.context - Contexto relevante ya recuperado de la DB.
 * @param {string} params.message - Mensaje del visitante.
 * @param {Array<{role: 'user'|'model', text: string}>} [params.history] - Historial corto.
 * @returns {Promise<{message: string, suggestions: Array<string>, ui: Array}>}
 */
async function generateChatResponse({ context, message, history = [] }) {
  const ai = getClient();

  const contextBlock = `CONTEXTO (JSON, única fuente de verdad):\n${JSON.stringify(context)}`;

  const contents = [
    ...history.map((h) => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.text }],
    })),
    {
      role: 'user',
      parts: [{ text: `${contextBlock}\n\nPREGUNTA DEL VISITANTE:\n${message}` }],
    },
  ];

  // Lista de modelos a intentar en orden de preferencia (soporta fallbacks automáticos si uno está sobrecargado)
  const modelsToTry = [
    config.geminiModel || 'gemini-3.5-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
  ].filter((m, i, self) => self.indexOf(m) === i);

  let lastError;
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.4,
          maxOutputTokens: 4096,
        },
      });

      const rawText = response.text;
      return parseStructuredResponse(rawText);
    } catch (err) {
      console.warn(`[gemini] Error con modelo ${model}: ${err.message}. Intentando con alternativa...`);
      lastError = err;
    }
  }

  throw lastError;
}

const DEFAULT_SUGGESTIONS = [
  '¿Qué herramientas y tecnologías utilizas?',
  '¿Dónde estudié / cuál es mi educación?',
  '¿Quién soy / sobre mí?',
  '¿Qué otros proyectos tienes?',
];

function parseStructuredResponse(rawText) {
  if (!rawText) {
    return {
      message: 'No pude generar una respuesta en este momento. Intenta de nuevo.',
      suggestions: DEFAULT_SUGGESTIONS,
      ui: [],
    };
  }

  // Quitar fences de markdown (```json ... ```) y espacios
  let cleaned = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      message: typeof parsed.message === 'string' ? parsed.message : String(parsed.message ?? ''),
      suggestions: Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0
        ? parsed.suggestions
        : DEFAULT_SUGGESTIONS,
      ui: Array.isArray(parsed.ui) ? parsed.ui : [],
    };
  } catch (err) {
    console.warn('[gemini] No se pudo parsear el JSON completo de la respuesta:', err.message);

    // Si el JSON fue truncado, intentar extraer la propiedad "message" mediante regex
    const messageMatch = cleaned.match(/"message"\s*:\s*"((?:[^"\\]|\\.)*)"/);
    if (messageMatch && messageMatch[1]) {
      const extractedMessage = messageMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');

      return {
        message: extractedMessage,
        suggestions: DEFAULT_SUGGESTIONS,
        ui: extractPartialUi(cleaned),
      };
    }

    // Si la cadena comienza con '{' o '[', es JSON malformado/incompleto. NO lo mostramos como texto al usuario.
    if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
      return {
        message: 'Ocurrió un pequeño inconveniente al formatear la respuesta. Por favor intenta realizar tu pregunta nuevamente.',
        suggestions: DEFAULT_SUGGESTIONS,
        ui: [],
      };
    }

    // Si no parece JSON en absoluto, devolver el texto plano limpio
    return { message: cleaned, suggestions: DEFAULT_SUGGESTIONS, ui: [] };
  }
}

function extractPartialUi(cleanedText) {
  try {
    const uiMatch = cleanedText.match(/"ui"\s*:\s*\[([\s\S]*)/);
    if (!uiMatch) return [];

    const uiContent = uiMatch[1];
    const blocks = [];

    const objectRegex = /\{\s*"type"\s*:\s*"[^"]+"\s*,\s*"data"\s*:\s*\{[\s\S]*?\n?\s*\}\s*\}/g;
    let match;
    while ((match = objectRegex.exec(uiContent)) !== null) {
      try {
        const parsedBlock = JSON.parse(match[0]);
        if (parsedBlock.type && parsedBlock.data) {
          blocks.push(parsedBlock);
        }
      } catch (e) {
        // Ignorar bloque incompleto
      }
    }

    return blocks;
  } catch (e) {
    return [];
  }
}

module.exports = { generateChatResponse };
