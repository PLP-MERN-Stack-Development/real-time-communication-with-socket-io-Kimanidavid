const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all online users
router.get('/online', asyncHandler(userController.getOnlineUsers));

// Get user by username
router.get('/:username', asyncHandler(userController.getUserByUsername));

// Update user status (requires auth)
router.put('/:username/status', authenticateToken, asyncHandler(userController.updateUserStatus));

// Register/Login user
router.post('/register', asyncHandler(userController.registerUser));

module.exports = router;
