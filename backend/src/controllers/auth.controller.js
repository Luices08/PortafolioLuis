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

function cookieOptions() {
  return {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
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
  res.cookie(config.jwtCookieName, token, cookieOptions());

  return new ApiResponse(200, { admin }, 'Sesión iniciada').send(res);
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(config.jwtCookieName, { ...cookieOptions(), maxAge: 0 });
  return new ApiResponse(200, null, 'Sesión cerrada').send(res);
});

const me = asyncHandler(async (req, res) => {
  return new ApiResponse(200, { admin: req.admin }, 'OK').send(res);
});

module.exports = { login, logout, me };
