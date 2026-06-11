const express = require("express");
const router = express.Router();
const {
  getAllCanhBao,
  createCanhBao,
  updateCanhBao,
  deleteCanhBao,
  toggleCanhBao,
} = require("../controllers/canhBaoController");

router.get("/", getAllCanhBao);
router.post("/", createCanhBao);
router.put("/:id", updateCanhBao);
router.delete("/:id", deleteCanhBao);
router.patch("/:id/toggle", toggleCanhBao);

module.exports = router;