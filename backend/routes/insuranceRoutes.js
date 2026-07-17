const express = require("express");
const router = express.Router();
const {
  createInsurance,
  searchInsurance,
  updateInsurance,
  deleteInsurance,
  getInsurances,
  getInsuranceByCitizenId,
} = require('../controllers/insuranceController');

router.post('/', createInsurance);
router.get('/', getInsurances);
router.get('/search', searchInsurance);
router.get('/citizen/:citizenId', getInsuranceByCitizenId);
router.put('/:id', updateInsurance);
router.delete('/:id', deleteInsurance);

module.exports = router;
