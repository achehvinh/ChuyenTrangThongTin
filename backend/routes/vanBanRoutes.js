const express = require("express");
const router = express.Router();
const {
  getAllVanBan,
  createVanBan,
  updateVanBan,
  deleteVanBan,
} = require("../controllers/vanBanController");

router.get("/", getAllVanBan);
router.post("/", createVanBan);
router.put("/:id", updateVanBan);
router.delete("/:id", deleteVanBan);

module.exports = router;
