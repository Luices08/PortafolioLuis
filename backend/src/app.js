const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const config = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

/**
 * Detecta si el origen de la petición corresponde a localhost / 127.0.0.1 en cualquier puerto.
 */
function isLocalhostOrigin(origin) {
  if (!origin) return true;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

const configuredOrigins = (config.corsOrigin || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Peticiones sin origin (curl, server-to-server, o mismo origen)
      if (!origin) return callback(null, true);

      // Peticiones locales (localhost o 127.0.0.1 en cualquier puerto)
      if (isLocalhostOrigin(origin)) {
        return callback(null, true);
      }

      // En VPS / producción: validar contra orígenes permitidos en CORS_ORIGIN
      if (configuredOrigins.includes(origin) || configuredOrigins.includes('*')) {
        return callback(null, true);
      }

      // En VPS: Permitir conexiones desde la IP pública o dominio del VPS (puerto 3000 o 3005 típico de frontend)
      try {
        const originUrl = new URL(origin);
        // Si el origen apunta al puerto 3000 o 3005 (puerto frontend en VPS)
        if (['3000', '3005', '80', '443', ''].includes(originUrl.port)) {
          return callback(null, true);
        }
      } catch (_) {}

      return callback(new Error(`Bloqueado por CORS: origen '${origin}' no permitido.`));
    },
    credentials: true, // necesario para cookies HTTP-only del admin
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (!config.isProduction) {
  app.use(morgan('dev'));
}

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
