const mongoose = require("mongoose");

const citizenSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    cccd: { type: String, required: true, unique: true, trim: true, index: true }, // Thêm index
    birthDate: { type: Date },
    gender: { type: String, enum: ["Nam", "Nữ"] },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Citizen", citizenSchema);