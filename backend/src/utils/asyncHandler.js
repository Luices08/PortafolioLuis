// Envuelve controladores async para propagar errores al middleware centralizado
// en lugar de repetir try/catch en cada controlador.
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
