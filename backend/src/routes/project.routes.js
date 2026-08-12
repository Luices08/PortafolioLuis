const express = require('express');
const {
  listPublicProjects,
  getPublicProjectBySlug,
  listAdminProjects,
  getAdminProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const { createRules, updateRules } = require('../validators/project.validator');

const router = express.Router();

// Públicas
router.get('/', listPublicProjects);
router.get('/slug/:slug', getPublicProjectBySlug);

// Admin (protegidas) — van antes de /:id públicas para no colisionar
router.get('/admin/all', protect, listAdminProjects);
router.get('/admin/:id', protect, getAdminProjectById);
router.post('/admin', protect, createRules, validate, createProject);
router.put('/admin/:id', protect, updateRules, validate, updateProject);
router.delete('/admin/:id', protect, deleteProject);

module.exports = router;
