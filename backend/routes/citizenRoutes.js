const express = require("express");
const router = express.Router();
const {
  createCitizen,
  getCitizens,
  updateCitizen,
  deleteCitizen,
} = require("../controllers/citizenController");

router.post("/", createCitizen);
router.get("/", getCitizens);
router.put("/:id", updateCitizen);
router.delete("/:id", deleteCitizen);

module.exports = router;