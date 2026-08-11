const Notification = require("../models/Notification");
const Admin = require("../models/Admin");
const { emitToUser, emitToDepartment } = require("./socketService");

/**
 * 1. Tạo 1 thông báo tới 1 người nhận cụ thể (Lưu MongoDB + Phát Socket.IO)
 */
exports.createNotification = async (data) => {
  try {
    if (!data.recipientId) {
      console.warn("⚠️ createNotification warning: recipientId is missing.");
      return null;
    }

    const notification = await Notification.create({
      recipientId: data.recipientId,
      senderId: data.senderId || null,
      senderName: data.senderName || "",
      type: data.type || "SYSTEM_UPDATE",
      title: data.title,
      message: data.message,
      taskId: data.taskId || null,
      documentId: data.documentId || null,
      meetingId: data.meetingId || null,
      announcementId: data.announcementId || null,
      actionUrl: data.actionUrl || "",
      priority: data.priority || "NORMAL",
      isRead: false,
      metadata: data.metadata || {},
    });

    // Lấy unread count thực tế từ MongoDB
    const unreadCount = await Notification.countDocuments({
      recipientId: data.recipientId,
      isRead: false,
    });

    // Phát Socket.IO tới đúng room của người nhận user:{recipientId}
    emitToUser(data.recipientId.toString(), "notification:new", {
      notification,
      unreadCount,
    });

    // Đồng thời phát lên room phòng ban để cập nhật UI tổng
    emitToDepartment("PhongVanHoaXaHoi", "notification:new", {
      notification,
      unreadCount,
    });

    return notification;
  } catch (err) {
    console.error("Lỗi createNotification:", err);
    return null;
  }
};

/**
 * 2. Tạo hàng loạt thông báo cho danh sách người nhận (VD: Toàn phòng)
 */
exports.createNotifications = async (recipients, data) => {
  try {
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return [];
    }

    const docs = recipients.map((rId) => ({
      recipientId: rId,
      senderId: data.senderId || null,
      senderName: data.senderName || "",
      type: data.type || "ANNOUNCEMENT_CREATED",
      title: data.title,
      message: data.message,
      taskId: data.taskId || null,
      documentId: data.documentId || null,
      meetingId: data.meetingId || null,
      announcementId: data.announcementId || null,
      actionUrl: data.actionUrl || "",
      priority: data.priority || "NORMAL",
      isRead: false,
      metadata: data.metadata || {},
    }));

    const createdNotifications = await Notification.insertMany(docs);

    // Gửi socket thông báo tới từng người nhận
    for (const notif of createdNotifications) {
      const unreadCount = await Notification.countDocuments({
        recipientId: notif.recipientId,
        isRead: false,
      });
      emitToUser(notif.recipientId.toString(), "notification:new", {
        notification: notif,
        unreadCount,
      });
    }

    return createdNotifications;
  } catch (err) {
    console.error("Lỗi createNotifications:", err);
    return [];
  }
};

/**
 * 3. Lấy danh sách thông báo phân trang của user từ MongoDB
 */
exports.getUserNotifications = async (userId, filters = {}) => {
  try {
    const page = Math.max(1, parseInt(filters.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(filters.limit) || 20));
    const skip = (page - 1) * limit;

    const query = { recipientId: userId };

    if (filters.type) {
      query.type = filters.type;
    }
    if (filters.isRead !== undefined && filters.isRead !== "") {
      query.isRead = filters.isRead === "true" || filters.isRead === true;
    }
    if (filters.priority) {
      query.priority = filters.priority;
    }

    const total = await Notification.countDocuments(query);
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });

    return {
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      unreadCount,
      notifications,
    };
  } catch (err) {
    console.error("Lỗi getUserNotifications:", err);
    return { success: false, notifications: [], unreadCount: 0 };
  }
};

/**
 * 4. Lấy số lượng thông báo chưa đọc
 */
exports.getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({
      recipientId: userId,
      isRead: false,
    });
    return count;
  } catch (err) {
    return 0;
  }
};

/**
 * 5. Đánh dấu 1 thông báo đã đọc
 */
exports.markAsRead = async (notificationId, userId) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    const unreadCount = await exports.getUnreadCount(userId);
    return { success: true, notification: notif, unreadCount };
  } catch (err) {
    return { success: false, message: "Lỗi cập nhật thông báo" };
  }
};

/**
 * 6. Đánh dấu tất cả thông báo của user đã đọc
 */
exports.markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    return { success: true, unreadCount: 0 };
  } catch (err) {
    return { success: false, message: "Lỗi đánh dấu tất cả đã đọc" };
  }
};

/**
 * 7. Xóa thông báo của user
 */
exports.deleteNotification = async (notificationId, userId) => {
  try {
    await Notification.deleteOne({ _id: notificationId, recipientId: userId });
    const unreadCount = await exports.getUnreadCount(userId);
    return { success: true, unreadCount };
  } catch (err) {
    return { success: false, message: "Lỗi khi xóa thông báo" };
  }
};

// ── EVENT NOTIFICATION HELPERS FOR BUSINESS MODULES ──

exports.notifyTaskAssigned = async ({ taskId, taskTitle, assignedTo, assignedBy, creatorName }) => {
  return exports.createNotification({
    recipientId: assignedTo,
    senderId: assignedBy,
    senderName: creatorName,
    type: "TASK_ASSIGNED",
    title: "Bạn được giao nhiệm vụ mới",
    message: `Bạn được giao nhiệm vụ: ${taskTitle}`,
    taskId,
    actionUrl: `/nhiem-vu/${taskId}`,
    priority: "HIGH",
  });
};

exports.notifyTaskProgressUpdated = async ({ taskId, taskTitle, oldProgress, newProgress, assigneeName, managerId, senderId }) => {
  return exports.createNotification({
    recipientId: managerId,
    senderId,
    senderName: assigneeName,
    type: "TASK_PROGRESS_UPDATED",
    title: "Cán bộ đã cập nhật tiến độ",
    message: `${assigneeName} đã cập nhật tiến độ nhiệm vụ "${taskTitle}" lên ${newProgress}%.`,
    taskId,
    actionUrl: `/nhiem-vu/${taskId}`,
    priority: "NORMAL",
  });
};

exports.notifyTaskSubmitted = async ({ taskId, taskTitle, assigneeName, managerId, senderId }) => {
  return exports.createNotification({
    recipientId: managerId,
    senderId,
    senderName: assigneeName,
    type: "TASK_SUBMITTED",
    title: "Nộp kết quả nhiệm vụ chờ phê duyệt",
    message: `${assigneeName} đã gửi kết quả nhiệm vụ "${taskTitle}" chờ phê duyệt.`,
    taskId,
    actionUrl: `/nhiem-vu/${taskId}`,
    priority: "HIGH",
  });
};

exports.notifyTaskCompleted = async ({ taskId, taskTitle, managerName, assigneeId, managerId }) => {
  return exports.createNotification({
    recipientId: assigneeId,
    senderId: managerId,
    senderName: managerName,
    type: "TASK_COMPLETED",
    title: "Nhiệm vụ đã được phê duyệt",
    message: `Nhiệm vụ "${taskTitle}" của bạn đã được Trưởng phòng phê duyệt HOÀN THÀNH.`,
    taskId,
    actionUrl: `/nhiem-vu/${taskId}`,
    priority: "NORMAL",
  });
};

exports.notifyTaskRevisionRequired = async ({ taskId, taskTitle, managerName, assigneeId, managerId, reason }) => {
  return exports.createNotification({
    recipientId: assigneeId,
    senderId: managerId,
    senderName: managerName,
    type: "TASK_REVISION_REQUIRED",
    title: "Yêu cầu bổ sung kết quả nhiệm vụ",
    message: `Trưởng phòng yêu cầu bổ sung kết quả nhiệm vụ "${taskTitle}": ${reason}`,
    taskId,
    actionUrl: `/nhiem-vu/${taskId}`,
    priority: "HIGH",
  });
};

exports.notifyTaskOverdue = async ({ taskId, taskTitle, assigneeId }) => {
  return exports.createNotification({
    recipientId: assigneeId,
    type: "TASK_OVERDUE",
    title: "Cảnh báo nhiệm vụ quá hạn",
    message: `Nhiệm vụ "${taskTitle}" do bạn thực hiện đã quá hạn hoàn thành!`,
    taskId,
    actionUrl: `/nhiem-vu/${taskId}`,
    priority: "URGENT",
  });
};

exports.notifyDocumentAssigned = async ({ documentId, docNumber, docTitle, assigneeId, assignedBy, senderName }) => {
  return exports.createNotification({
    recipientId: assigneeId,
    senderId: assignedBy,
    senderName,
    type: "DOCUMENT_ASSIGNED",
    title: "Văn bản được giao xử lý",
    message: `Bạn được giao xử lý văn bản Số ${docNumber}: ${docTitle}`,
    documentId,
    actionUrl: `/van-ban/${documentId}`,
    priority: "HIGH",
  });
};

exports.notifyMeetingInvitation = async ({ meetingId, meetingTitle, meetingTime, recipients, senderId, senderName }) => {
  return exports.createNotifications(recipients, {
    senderId,
    senderName,
    type: "MEETING_INVITATION",
    title: "Giấy mời họp cơ quan",
    message: `Bạn được mời tham dự cuộc họp: ${meetingTitle} vào lúc ${meetingTime}`,
    meetingId,
    actionUrl: `/lich-hop/${meetingId}`,
    priority: "HIGH",
  });
};
