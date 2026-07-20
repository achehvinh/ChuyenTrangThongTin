const express = require("express");
const router = express.Router();
const {
  getAllLichHop,
  getLichHopById,
  createLichHop,
  updateLichHop,
  saveMeetingSummary,
  deleteLichHop,
} = require("../controllers/lichHopController");

router.get("/", getAllLichHop);
router.get("/:id", getLichHopById);
router.post("/", createLichHop);
router.put("/:id", updateLichHop);
router.post("/:id/summary", saveMeetingSummary);
router.delete("/:id", deleteLichHop);

module.exports = router;