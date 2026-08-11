const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    actorName: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      required: true, // "CREATE", "UPDATE_PROGRESS", "SUBMIT", "APPROVE", "REVISION", "ASSIGN", "EXTEND", "CANCEL"
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    taskTitle: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
    },

    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
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

module.exports = mongoose.model("ActivityLog", activityLogSchema);
