const express = require("express");
const router = express.Router();
const {
  getAllThongBao,
  createThongBao,
  updateThongBao,
  deleteThongBao,
  toggleThongBao,
} = require("../controllers/thongBaoController");

router.get("/", getAllThongBao);
router.post("/", createThongBao);
router.put("/:id", updateThongBao);
router.delete("/:id", deleteThongBao);
router.patch("/:id/toggle", toggleThongBao);

module.exports = router;