const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    assignedByName: {
      type: String,
      default: "Trưởng phòng",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    assigneeName: {
      type: String,
      default: "Cán bộ chuyên viên",
    },

    departmentId: {
      type: String,
      default: "PhongVanHoaXaHoi",
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },

    status: {
      type: String,
      enum: [
        "TODO",
        "IN_PROGRESS",
        "NEAR_DEADLINE",
        "OVERDUE",
        "SUBMITTED",
        "COMPLETED",
        "REVISION_REQUIRED",
        "CANCELLED",
      ],
      default: "IN_PROGRESS",
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    dueDate: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    submittedAt: {
      type: Date,
    },

    revisionReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Tự động kiểm tra tính toán status hiển thị chuẩn tiếng Việt
taskSchema.methods.toVietnameseStatus = function () {
  switch (this.status) {
    case "IN_PROGRESS":
      return "Đang thực hiện";
    case "NEAR_DEADLINE":
      return "Sắp đến hạn";
    case "OVERDUE":
      return "Quá hạn";
    case "SUBMITTED":
      return "Chờ phê duyệt";
    case "COMPLETED":
      return "Hoàn thành";
    case "REVISION_REQUIRED":
      return "Yêu cầu bổ sung";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return "Đang thực hiện";
  }
};

module.exports = mongoose.model("Task", taskSchema);
