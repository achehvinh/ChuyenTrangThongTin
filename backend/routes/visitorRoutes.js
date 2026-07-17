const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");
const PageHit = require("../models/PageHit");
const Conversation = require("../models/Conversation");
const BaiViet = require("../models/BaiViet");

// ── HIT: Ghi nhận lượt truy cập và cập nhật trạng thái online ──
router.post("/hit", async (req, res) => {
  try {
    const { username, role, pathname } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Tìm và cập nhật hoặc tạo mới
    let visitor = await Visitor.findOne({ ip, username, role });
    if (visitor) {
      visitor.lastActivity = new Date();
      await visitor.save();
    } else {
      visitor = new Visitor({ ip, username, role });
      await visitor.save();
    }

    // Ghi nhận truy cập chuyên mục nếu có pathname
    if (pathname) {
      let category = "";
      if (pathname === "/" || pathname.startsWith("/tin-tuc") || pathname.startsWith("/chuyen-muc") || pathname.startsWith("/thong-tin")) {
        category = "tuyen-truyen";
      } else if (pathname.startsWith("/tra-cuu") || pathname.startsWith("/huong-dan-bhxh") || pathname.startsWith("/huong-dan-vneid")) {
        category = "tra-cuu";
      } else if (pathname.startsWith("/thu-tuc-hanh-chinh")) {
        category = "thu-tuc";
      } else if (pathname.startsWith("/tro-choi") || pathname.startsWith("/quiz")) {
        category = "tro-choi";
      } else if (pathname.startsWith("/gia-nong-san")) {
        category = "nong-san";
      } else if (pathname === "/nghe-dai") {
        category = "nghe-dai";
      }

      if (category) {
        await PageHit.findOneAndUpdate(
          { category },
          { $inc: { count: 1 } },
          { upsert: true, new: true }
        );
      }
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Lỗi ghi nhận truy cập:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ── STATS: Lấy thống kê số lượt truy cập hôm nay và số người online ──
router.get("/stats", async (req, res) => {
  try {
    // 1. Tính số lượt truy cập hôm nay (từ 00:00:00 hôm nay)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayCount = await Visitor.countDocuments({
      lastActivity: { $gte: todayStart }
    });

    // 2. Tính số người đang trực tuyến (hoạt động trong vòng 5 phút qua)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const onlineVisitors = await Visitor.find({
      lastActivity: { $gte: fiveMinutesAgo }
    });

    // Đếm số lượng theo role
    let onlineCanBo = 0;
    let onlineCitizens = 0;
    const onlineList = [];

    onlineVisitors.forEach(v => {
      if (v.role === "truongphong" || v.role === "canbo" || v.role === "phophong" || v.role === "admin") {
        onlineCanBo++;
      } else {
        onlineCitizens++;
      }
      // Tránh trùng lặp cán bộ trong danh sách
      if (!onlineList.some(item => item.username === v.username && item.role === v.role)) {
        onlineList.push({
          username: v.username,
          role: v.role,
          lastActivity: v.lastActivity
        });
      }
    });

    // 3. Lấy lượt truy cập chuyên mục từ PageHit
    const hits = await PageHit.find({});
    const categoryHits = {
      tuyen_truyen: 0,
      tra_cuu: 0,
      thu_tuc: 0,
      tro_choi: 0,
      nong_san: 0,
      nghe_dai: 0
    };
    hits.forEach(h => {
      const key = h.category.replace("-", "_");
      categoryHits[key] = h.count;
    });

    // 4. Lấy tổng số lượng bài viết và video từ BaiViet
    const totalArticles = await BaiViet.countDocuments({ trang_thai: "da-dang" });
    const totalVideos = await BaiViet.countDocuments({
      trang_thai: "da-dang",
      $or: [
        { videoFile: { $exists: true, $ne: "" } },
        { videoUrl: { $exists: true, $ne: "" } }
      ]
    });

    // 5. Lấy tổng số lần truy cập AI từ Conversation
    const totalAIQueries = await Conversation.countDocuments({});

    return res.json({
      success: true,
      todayCount: todayCount || 1, // Đảm bảo tối thiểu là 1 lượt
      onlineCanBo,
      onlineCitizens,
      onlineTotal: onlineCanBo + onlineCitizens,
      onlineList,
      categoryHits,
      totalArticles,
      totalVideos: totalVideos || 3, // Fallback nếu chưa có bài viết video
      totalAIQueries
    });
  } catch (err) {
    console.error("Lỗi lấy thống kê truy cập:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
