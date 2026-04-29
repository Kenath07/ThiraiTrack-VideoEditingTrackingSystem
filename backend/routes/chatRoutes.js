const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, clearChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.post('/', protect, sendMessage);
router.get('/history', protect, getChatHistory);
router.delete('/', protect, clearChatHistory);

module.exports = router;
