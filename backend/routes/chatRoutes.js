const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');

// Protected route for chat
router.post('/', authController.verifyToken, chatController.handleMessage);

module.exports = router; 