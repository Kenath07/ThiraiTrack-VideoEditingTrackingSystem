const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, clearChatHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

//Implement AI chatbot backend routes
// All routes require authentication
router.post('/', protect, sendMessage);
router.get('/history', protect, getChatHistory);
router.delete('/', protect, clearChatHistory);

module.exports = router;
