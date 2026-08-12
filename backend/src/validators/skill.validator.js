const { body } = require('express-validator');

const rules = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('category')
    .isIn(['frontend', 'backend', 'database', 'devops', 'ai', 'tools', 'soft-skills', 'other'])
    .withMessage('Categoría inválida'),
  body('level')
    .optional()
    .isIn(['basico', 'intermedio', 'avanzado', 'experto'])
    .withMessage('Nivel inválido'),
];

module.exports = { rules };
