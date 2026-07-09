const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Route xử lý chat
router.post('/chat', aiController.chat);

// Route lấy lịch sử chat (nếu bạn muốn lưu lại)
router.get('/history', aiController.getHistory);

module.exports = router;