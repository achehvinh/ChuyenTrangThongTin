const express = require("express");
const router = express.Router();
const {
  getCatalog,
  createProcedure,
  updateProcedure,
  deleteProcedure,
  bulkSyncCatalog
} = require("../controllers/tthcCatalogController");

router.get("/", getCatalog);
router.post("/", createProcedure);
router.post("/bulk-sync", bulkSyncCatalog);
router.put("/:code", updateProcedure);
router.delete("/:code", deleteProcedure);

module.exports = router;
