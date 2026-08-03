const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema(
  {
    playerName: {
      type: String,
      required: [true, "Vui lòng nhập tên người chơi"],
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      default: 10,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    details: [
      {
        questionIndex: Number,
        questionText: String,
        options: [String],
        selectedOption: Number,
        correctOption: Number,
        isCorrect: Boolean,
        explain: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("QuizResult", quizResultSchema);
