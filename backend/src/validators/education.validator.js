const { body } = require('express-validator');

const rules = [
  body('institution').trim().notEmpty().withMessage('La institución es requerida'),
  body('degree').trim().notEmpty().withMessage('El título/grado es requerido'),
  body('startDate').notEmpty().withMessage('La fecha de inicio es requerida').isISO8601().toDate(),
  body('endDate').optional({ checkFalsy: true }).isISO8601().toDate(),
];

module.exports = { rules };
