const express = require('express');
const { getProfile, upsertProfile } = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const { rules } = require('../validators/profile.validator');

const router = express.Router();

router.get('/', getProfile);
router.put('/', protect, rules, validate, upsertProfile);

module.exports = router;
