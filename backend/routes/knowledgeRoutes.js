const express = require('express');
const router = express.Router();
const knowledgeController = require('../controllers/knowledgeController');

router.get('/', knowledgeController.getAllKnowledge);
router.post('/', knowledgeController.addKnowledge);
router.put('/:id', knowledgeController.updateKnowledge);
router.delete('/:id', knowledgeController.deleteKnowledge);
router.post('/:id/use', knowledgeController.incrementUsage);

module.exports = router;