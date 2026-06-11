const mongoose = require("mongoose");

const ThongBaoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['urgent', 'normal', 'guide'], default: 'normal' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("ThongBao", ThongBaoSchema);