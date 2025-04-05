const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route
router.post('/login', authController.login);

// Register route
router.post('/register', authController.register);

// Password reset request route
router.post('/reset-password', authController.requestPasswordReset);

// Password reset confirmation route
router.post('/reset-password/confirm', authController.resetPassword);

module.exports = router; 