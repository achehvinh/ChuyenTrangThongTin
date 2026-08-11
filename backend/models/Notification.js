const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null, // null nếu gửi chung cho phòng hoặc nhóm quản lý
    },

    recipientRole: {
      type: String, // "truongphong", "canbo", "all"
      default: "all",
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    senderName: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      default: "TASK_UPDATE",
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
    },

    isRead: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("Notification", notificationSchema);
