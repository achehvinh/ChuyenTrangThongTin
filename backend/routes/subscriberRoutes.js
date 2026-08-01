const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

// POST /api/v1/subscribe — Công dân Đăng ký nhận tin từ client user
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập địa chỉ email hợp lệ!" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await Subscriber.findOne({ email: cleanEmail });
    if (existing) {
      return res.json({
        success: true,
        message: "Email này đã được đăng ký từ trước! Cảm ơn bạn.",
        data: existing,
      });
    }

    const newSub = await Subscriber.create({
      email: cleanEmail,
      subscribedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Đăng ký nhận tin thành công! Thông tin đã được chuyển tới Cán bộ UBND xã Đăk Pxi.",
      data: newSub,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Có lỗi xảy ra khi lưu email!", error: error.message });
  }
});

// GET /api/v1/subscribers — Cán bộ xem danh sách Email đăng ký nhận tin
router.get("/", async (req, res) => {
  try {
    const subs = await Subscriber.find().sort({ createdAt: -1 });
    res.json({ success: true, count: subs.length, data: subs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Có lỗi xảy ra khi lấy danh sách email!", error: error.message });
  }
});

// DELETE /api/v1/subscribers/:id — Cán bộ xóa email khỏi danh sách
router.delete("/:id", async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Đã xóa email khỏi danh sách nhận tin." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Có lỗi xảy ra khi xóa email!", error: error.message });
  }
});

module.exports = router;
