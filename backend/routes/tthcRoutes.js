const express = require("express");
const router = express.Router();
const {
  getGroups,
  getProcedures,
  getProcedureDetail,
  createQuestion,
  createReview,
  getProgress,
  updateStepProgress,
} = require("../controllers/tthcController");

router.get("/procedure-groups", getGroups);
router.get("/procedures", getProcedures);
router.get("/procedures/:slug", getProcedureDetail);
router.post("/questions", createQuestion);
router.post("/reviews", createReview);
router.get("/progress/:sessionId/:procedureId", getProgress);
router.put("/progress/:sessionId/steps/:stepId", updateStepProgress);

module.exports = router;
