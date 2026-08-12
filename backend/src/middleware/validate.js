const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

// Ejecuta después de las cadenas de express-validator y convierte los
// errores acumulados en un ApiError consistente.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(ApiError.badRequest('Datos inválidos', details));
  }
  next();
}

module.exports = validate;
