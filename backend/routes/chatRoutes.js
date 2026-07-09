const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route này sẽ nhận request từ /api/v1/chat
router.post('/', chatController.getChatResponse); 

module.exports = router;