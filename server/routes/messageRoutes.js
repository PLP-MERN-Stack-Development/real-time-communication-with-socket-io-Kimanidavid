const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// Get messages with pagination
router.get('/', asyncHandler(messageController.getMessages));

// Get recent messages (for initial load)
router.get('/recent', asyncHandler(messageController.getRecentMessages));

// Get private messages between current user and another user
router.get('/private/:username', authenticateToken, asyncHandler(messageController.getUserMessages));

// Search messages
router.get('/search', asyncHandler(messageController.searchMessages));

// Delete a message (requires auth)
router.delete('/:messageId', authenticateToken, asyncHandler(messageController.deleteMessage));

module.exports = router;
