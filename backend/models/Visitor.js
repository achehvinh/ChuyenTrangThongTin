const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    ip: { type: String, default: "" },
    username: { type: String, default: "citizen" }, // 'citizen' if public guest
    role: { type: String, default: "citizen" }, // 'citizen', 'truongphong', 'canbo', 'phophong'
    lastActivity: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);
