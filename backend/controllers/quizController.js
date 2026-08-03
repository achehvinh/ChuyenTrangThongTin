const QuizResult = require("../models/QuizResult");

// @desc    Lưu kết quả lượt chơi quiz
// @route   POST /api/v1/quiz/submit
// @access  Public
exports.submitQuizResult = async (req, res, next) => {
  try {
    const { playerName, score, totalQuestions = 10, passed, details } = req.body;

    if (!playerName || playerName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Họ và tên người chơi không được để trống",
      });
    }

    const isPassed = typeof passed === "boolean" ? passed : score >= 8;

    const quizResult = await QuizResult.create({
      playerName: playerName.trim(),
      score: Number(score) || 0,
      totalQuestions: Number(totalQuestions) || 10,
      passed: isPassed,
      details: Array.isArray(details) ? details : [],
    });

    res.status(201).json({
      success: true,
      message: "Lưu kết quả lượt chơi thành công",
      data: quizResult,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy danh sách tất cả các lượt chơi (Dành cho cán bộ quản trị)
// @route   GET /api/v1/quiz/results
// @access  Public / Admin
exports.getAllQuizResults = async (req, res, next) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search && search.trim() !== "") {
      query.playerName = { $regex: search.trim(), $options: "i" };
    }

    const results = await QuizResult.find(query).sort({ createdAt: -1 });

    const totalParticipants = results.length;
    const passedCount = results.filter((r) => r.passed).length;
    const passRate = totalParticipants > 0 ? ((passedCount / totalParticipants) * 100).toFixed(1) : 0;
    const averageScore =
      totalParticipants > 0
        ? (results.reduce((acc, cur) => acc + cur.score, 0) / totalParticipants).toFixed(1)
        : 0;

    res.status(200).json({
      success: true,
      count: totalParticipants,
      stats: {
        totalParticipants,
        passedCount,
        failedCount: totalParticipants - passedCount,
        passRate: Number(passRate),
        averageScore: Number(averageScore),
      },
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Xóa 1 lượt chơi theo ID
// @route   DELETE /api/v1/quiz/results/:id
// @access  Admin
exports.deleteQuizResult = async (req, res, next) => {
  try {
    const result = await QuizResult.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy dữ liệu lượt chơi",
      });
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa lượt chơi thành công",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Xóa tất cả kết quả lượt chơi
// @route   DELETE /api/v1/quiz/results
// @access  Admin
exports.clearAllQuizResults = async (req, res, next) => {
  try {
    await QuizResult.deleteMany({});
    res.status(200).json({
      success: true,
      message: "Đã xóa toàn bộ danh sách kết quả cuộc thi",
    });
  } catch (error) {
    next(error);
  }
};
