const express = require('express');
const {
  listEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} = require('../controllers/education.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const { rules } = require('../validators/education.validator');

const router = express.Router();

router.get('/', listEducation);
router.post('/', protect, rules, validate, createEducation);
router.put('/:id', protect, rules, validate, updateEducation);
router.delete('/:id', protect, deleteEducation);

module.exports = router;
