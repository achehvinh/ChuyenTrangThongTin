const express = require('express');
const router = express.Router();
const knowledgeController = require('../controllers/knowledgeController');

// Route lấy danh sách và thêm mới kiến thức
router.get('/', knowledgeController.getAllKnowledge);
router.post('/', knowledgeController.addKnowledge);
router.delete('/:id', knowledgeController.deleteKnowledge);

module.exports = router;