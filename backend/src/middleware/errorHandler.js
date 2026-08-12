const config = require('../config/env');
const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';
  let details = err.details || null;

  // Errores conocidos de Mongoose / Mongo que traducimos a algo legible
  if (err.name === 'MongooseError' && (err.message.includes('initial connection') || err.message.includes('bufferCommands'))) {
    statusCode = 503;
    message = 'La base de datos (MongoDB) no está conectada. Configura una URI válida en backend/.env';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Datos inválidos';
    details = Object.values(err.errors).map((e) => e.message);
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Identificador inválido: ${err.value}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `Ya existe un registro con ese ${field}` : 'Registro duplicado';
  }

  if (!(err instanceof ApiError) && statusCode === 500) {
    // Log completo en servidor, nunca se expone al cliente
    console.error('[error]', err);
  }

  const payload = {
    success: false,
    message,
  };

  if (details) payload.details = details;

  // Nunca devolver stack traces en producción
  if (!config.isProduction && statusCode === 500) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}

function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFoundHandler };
