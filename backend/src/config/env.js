require('dotenv').config();

const required = [
  'MONGODB_URI',
  'JWT_SECRET',
];

function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    // No detenemos el proceso en desarrollo para permitir explorar el proyecto
    // sin credenciales, pero avisamos claramente.
    console.warn(
      `[config] Variables de entorno faltantes: ${missing.join(', ')}. ` +
      'Copia backend/.env.example a backend/.env y complétalo.'
    );
  }
}

validateEnv();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 4000,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  mongoUri: process.env.MONGODB_URI,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtCookieName: process.env.JWT_COOKIE_NAME || 'portfolio_admin_token',

  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD,
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
  },

  isProduction: process.env.NODE_ENV === 'production',
};
