const jwt = require('jsonwebtoken');
const config = require('../config/env');
const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

function signToken(admin) {
  return jwt.sign({ sub: admin._id.toString() }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

/**
 * Detecta si la petición o el entorno corresponde a localhost / desarrollo local.
 */
function isLocalhost(req) {
  if (!config.isProduction) return true;
  const host = req?.hostname || req?.headers?.host || '';
  return (
    host === 'localhost' ||
    host.startsWith('localhost:') ||
    host === '127.0.0.1' ||
    host.startsWith('127.0.0.1:')
  );
}

/**
 * Detecta si la conexión entrante es HTTPS real (directa o mediante proxy Nginx/Cloudflare).
 */
function isHttps(req) {
  if (!req) return false;
  return req.secure === true || req.headers?.['x-forwarded-proto'] === 'https';
}

function cookieOptions(req) {
  const isLocal = isLocalhost(req);
  // Si estamos en localhost o en una conexión HTTP directa en VPS (sin certificado SSL aún),
  // secure DEBE ser false porque los navegadores rechazan cookies 'Secure' sobre HTTP no seguro.
  // Si el VPS tiene HTTPS configurado (con dominio y proxy), activa secure: true y sameSite: 'none'.
  const isSecure = !isLocal && (isHttps(req) || config.isProduction && req?.secure);

  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    path: '/',
  };
}

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username: username.trim() });
  if (!admin) {
    throw ApiError.unauthorized('Usuario o contraseña incorrectos');
  }

  const valid = await admin.comparePassword(password);
  if (!valid) {
    throw ApiError.unauthorized('Usuario o contraseña incorrectos');
  }

  const token = signToken(admin);
  res.cookie(config.jwtCookieName, token, cookieOptions(req));

  return new ApiResponse(200, { admin }, 'Sesión iniciada').send(res);
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(config.jwtCookieName, { ...cookieOptions(req), maxAge: 0 });
  return new ApiResponse(200, null, 'Sesión cerrada').send(res);
});

const me = asyncHandler(async (req, res) => {
  return new ApiResponse(200, { admin: req.admin }, 'OK').send(res);
});

module.exports = { login, logout, me };
