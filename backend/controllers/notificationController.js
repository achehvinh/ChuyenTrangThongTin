const notificationService = require("../services/notificationService");

/**
 * GET /api/notifications: Lấy danh sách thông báo phân trang của user hiện tại
 */
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || "6a5982689a2f05a601d3a250";
    const result = await notificationService.getUserNotifications(userId, req.query);
    return res.json(result);
  } catch (err) {
    console.error("Lỗi getNotifications controller:", err);
    return res.status(500).json({ message: "Lỗi hệ thống khi lấy thông báo" });
  }
};

/**
 * GET /api/notifications/unread-count: Lấy số lượng thông báo chưa đọc của user
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || "6a5982689a2f05a601d3a250";
    const count = await notificationService.getUnreadCount(userId);
    return res.json({ success: true, count, unreadCount: count });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi đếm thông báo chưa đọc" });
  }
};

/**
 * PATCH /api/notifications/:id/read: Đánh dấu 1 thông báo là đã đọc
 */
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || "6a5982689a2f05a601d3a250";
    const { id } = req.params;

    if (id === "read-all") {
      const result = await notificationService.markAllAsRead(userId);
      return res.json(result);
    }

    const result = await notificationService.markAsRead(id, userId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi đánh dấu đã đọc" });
  }
};

/**
 * PATCH /api/notifications/read-all: Đánh dấu tất cả thông báo của user là đã đọc
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || "6a5982689a2f05a601d3a250";
    const result = await notificationService.markAllAsRead(userId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi đánh dấu tất cả đã đọc" });
  }
};

/**
 * DELETE /api/notifications/:id: Xóa 1 thông báo của chính user
 */
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || "6a5982689a2f05a601d3a250";
    const { id } = req.params;
    const result = await notificationService.deleteNotification(id, userId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: "Lỗi khi xóa thông báo" });
  }
};
