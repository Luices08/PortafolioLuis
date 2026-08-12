const { body } = require('express-validator');

const rules = [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('El mensaje no puede estar vacío')
    .isLength({ max: 2000 })
    .withMessage('El mensaje es demasiado largo (máx. 2000 caracteres)'),
  body('history').optional().isArray({ max: 20 }).withMessage('El historial es demasiado largo'),
];

module.exports = { rules };
