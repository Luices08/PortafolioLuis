const { body } = require('express-validator');

const rules = [
  body('company').trim().notEmpty().withMessage('La empresa es requerida'),
  body('role').trim().notEmpty().withMessage('El rol es requerido'),
  body('description').trim().notEmpty().withMessage('La descripción es requerida'),
  body('startDate').notEmpty().withMessage('La fecha de inicio es requerida').isISO8601().toDate(),
  body('endDate').optional({ checkFalsy: true }).isISO8601().toDate(),
];

module.exports = { rules };
