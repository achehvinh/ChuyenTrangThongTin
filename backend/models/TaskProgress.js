const mongoose = require("mongoose");

const taskProgressSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    userName: {
      type: String,
      required: true,
    },

    oldProgress: {
      type: Number,
      default: 0,
    },

    newProgress: {
      type: Number,
      required: true,
    },

    note: {
      type: String,
      default: "",
    },

    attachments: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TaskProgress", taskProgressSchema);
