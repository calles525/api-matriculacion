const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const convencionistaRoutes = require('./convencionistaRoutes');

router.use('/auth', authRoutes);
router.use('/convencionistas', convencionistaRoutes);

module.exports = router;