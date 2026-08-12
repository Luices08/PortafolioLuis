const express = require('express');

const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');
const projectRoutes = require('./project.routes');
const skillRoutes = require('./skill.routes');
const experienceRoutes = require('./experience.routes');
const educationRoutes = require('./education.routes');
const chatRoutes = require('./chat.routes');
const uploadRoutes = require('./upload.routes');

const router = express.Router();

router.get('/health', (req, res) => res.json({ success: true, message: 'OK' }));

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/experience', experienceRoutes);
router.use('/education', educationRoutes);
router.use('/chat', chatRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
