const express = require("express");
const router = express.Router();
const {
  createInsurance,
  searchInsurance,
  updateInsurance,
  deleteInsurance,
} = require('../controllers/insuranceController');

router.post('/', createInsurance);
router.get('/search', searchInsurance);
router.put('/:id', updateInsurance);
router.delete('/:id', deleteInsurance);

module.exports = router;
