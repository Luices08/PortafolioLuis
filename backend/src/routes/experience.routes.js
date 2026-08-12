const express = require('express');
const {
  listExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} = require('../controllers/experience.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const { rules } = require('../validators/experience.validator');

const router = express.Router();

router.get('/', listExperience);
router.post('/', protect, rules, validate, createExperience);
router.put('/:id', protect, rules, validate, updateExperience);
router.delete('/:id', protect, deleteExperience);

module.exports = router;
