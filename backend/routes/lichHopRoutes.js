const express = require("express");
const router = express.Router();
const {
  getAllLichHop,
  createLichHop,
  updateLichHop,
  deleteLichHop,
} = require("../controllers/lichHopController");

router.get("/", getAllLichHop);
router.post("/", createLichHop);
router.put("/:id", updateLichHop);
router.delete("/:id", deleteLichHop);

module.exports = router;