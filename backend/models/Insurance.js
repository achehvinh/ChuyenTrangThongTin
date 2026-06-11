const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
  {
    citizenId: { type: mongoose.Schema.Types.ObjectId, ref: "Citizen", required: true, index: true },
    insuranceCode: { type: String, required: true, unique: true, trim: true, index: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: { type: String, enum: ["active", "expired"], default: "active" }, // Giới hạn giá trị
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Insurance", insuranceSchema);