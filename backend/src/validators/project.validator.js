const { body } = require('express-validator');

const baseRules = [
  body('title').trim().notEmpty().withMessage('El título es requerido'),
  body('shortDescription')
    .trim()
    .notEmpty()
    .withMessage('La descripción corta es requerida')
    .isLength({ max: 280 })
    .withMessage('La descripción corta no puede superar 280 caracteres'),
  body('fullDescription').trim().notEmpty().withMessage('La descripción completa es requerida'),
  body('status').optional().isIn(['draft', 'published']).withMessage('Estado inválido'),
  body('featured').optional().isBoolean().withMessage('featured debe ser booleano'),
  body('technologies').optional().isArray().withMessage('technologies debe ser un arreglo'),
  body('categories').optional().isArray().withMessage('categories debe ser un arreglo'),
  body('githubUrl').optional({ checkFalsy: true }).isURL().withMessage('githubUrl debe ser una URL válida'),
  body('demoUrl').optional({ checkFalsy: true }).isURL().withMessage('demoUrl debe ser una URL válida'),
  body('videoUrl').optional({ checkFalsy: true }).isURL().withMessage('videoUrl debe ser una URL válida'),
];

const createRules = [...baseRules];
const updateRules = [...baseRules];

module.exports = { createRules, updateRules };
