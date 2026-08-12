const { body } = require('express-validator');

const rules = [
  body('fullName').trim().notEmpty().withMessage('El nombre completo es requerido'),
  body('title').trim().notEmpty().withMessage('El título profesional es requerido'),
  body('bio').trim().notEmpty().withMessage('La biografía es requerida'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Email inválido'),
];

module.exports = { rules };
