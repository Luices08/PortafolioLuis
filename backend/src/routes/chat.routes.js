const express = require('express');
const { sendMessage } = require('../controllers/chat.controller');
const { chatRateLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { rules } = require('../validators/chat.validator');

const router = express.Router();

router.post('/', chatRateLimiter, rules, validate, sendMessage);

module.exports = router;
