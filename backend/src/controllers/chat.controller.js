const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { buildContext } = require('../services/context.service');
const { generateChatResponse } = require('../services/gemini.service');

// Flujo: usuario -> backend -> recuperar contexto relevante desde MongoDB
// -> Gemini -> respuesta estructurada -> frontend (ver CLAUDE.md).
const sendMessage = asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  const context = await buildContext(message);

  if (!context.profile) {
    // Sin perfil configurado no hay nada real que el chat pueda contar.
    return new ApiResponse(200, {
      message:
        'Este portafolio todavía no tiene contenido configurado. Pídele al administrador que complete su perfil desde el panel /admin.',
      ui: [],
    }).send(res);
  }

  let structured;
  try {
    structured = await generateChatResponse({ context, message, history });
  } catch (err) {
    console.error('[chat] Error llamando a Gemini:', err.message);
    throw ApiError.internal('El asistente no está disponible en este momento. Intenta de nuevo en unos minutos.');
  }

  return new ApiResponse(200, structured).send(res);
});

module.exports = { sendMessage };
