const jwt = require('jsonwebtoken');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');
const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');

// Protege rutas administrativas verificando el JWT enviado en cookie HTTP-only.
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.[config.jwtCookieName];

  if (!token) {
    throw ApiError.unauthorized('Sesión no encontrada. Inicia sesión de nuevo.');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwtSecret);
  } catch (err) {
    throw ApiError.unauthorized('Sesión inválida o expirada.');
  }

  const admin = await Admin.findById(decoded.sub).select('-passwordHash');
  if (!admin) {
    throw ApiError.unauthorized('El administrador ya no existe.');
  }

  req.admin = admin;
  next();
});

module.exports = { protect };
