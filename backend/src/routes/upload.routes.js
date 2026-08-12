const express = require('express');
const { uploadImage, removeImage } = require('../controllers/upload.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.post('/', protect, upload.single('image'), uploadImage);
router.delete('/', protect, removeImage);

module.exports = router;
