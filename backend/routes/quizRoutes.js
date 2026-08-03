const express = require("express");
const router = express.Router();
const {
  submitQuizResult,
  getAllQuizResults,
  deleteQuizResult,
  clearAllQuizResults,
} = require("../controllers/quizController");

router.post("/submit", submitQuizResult);
router.get("/results", getAllQuizResults);
router.delete("/results/:id", deleteQuizResult);
router.delete("/results", clearAllQuizResults);

module.exports = router;
