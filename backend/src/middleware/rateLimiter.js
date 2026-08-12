const rateLimit = require('express-rate-limit');

// Rate limiting específico para /api/chat, protege la cuota de Gemini
// y evita abuso del endpoint público.
const chatRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiados mensajes en poco tiempo. Espera unos minutos e intenta de nuevo.',
  },
});

// Rate limiting general y más estricto para login, para dificultar fuerza bruta.
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Intenta más tarde.',
  },
});

module.exports = { chatRateLimiter, authRateLimiter };
