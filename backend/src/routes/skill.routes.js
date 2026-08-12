const express = require('express');
const { listSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skill.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const { rules } = require('../validators/skill.validator');

const router = express.Router();

router.get('/', listSkills);
router.post('/', protect, rules, validate, createSkill);
router.put('/:id', protect, rules, validate, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
