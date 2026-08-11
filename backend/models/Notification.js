const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
    senderName: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: true,
      index: true,
      enum: [
        "TASK_ASSIGNED",
        "TASK_ACCEPTED",
        "TASK_PROGRESS_UPDATED",
        "TASK_SUBMITTED",
        "TASK_COMPLETED",
        "TASK_REVISION_REQUIRED",
        "TASK_OVERDUE",
        "DOCUMENT_ASSIGNED",
        "DOCUMENT_RECEIVED",
        "DOCUMENT_DEADLINE",
        "DOCUMENT_COMPLETED",
        "MEETING_INVITATION",
        "MEETING_UPDATED",
        "MEETING_CANCELLED",
        "MEETING_REMINDER",
        "DIRECTIVE_CREATED",
        "DIRECTIVE_ASSIGNED",
        "DIRECTIVE_UPDATED",
        "ANNOUNCEMENT_CREATED",
        "SYSTEM_ALERT",
        "SYSTEM_UPDATE",
        "USER_MENTION",
      ],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: false,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VanBan",
      required: false,
    },
    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LichHop",
      required: false,
    },
    announcementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ThongBao",
      required: false,
    },
    actionUrl: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      enum: ["LOW", "NORMAL", "HIGH", "URGENT"],
      default: "NORMAL",
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: Object,
      default: {},
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    departmentId: {
      type: String,
      default: "PhongVanHoaXaHoi",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes cho tối ưu truy vấn
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
