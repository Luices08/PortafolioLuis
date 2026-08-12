const express = require('express');
const { login, logout, me } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { authRateLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { loginRules } = require('../validators/auth.validator');

const router = express.Router();

router.post('/login', authRateLimiter, loginRules, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, me);

module.exports = router;
