const mongoose = require("mongoose");

const CanhBaoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  level: { type: String, enum: ['danger', 'warning'], default: 'warning' },
  thon: { type: String, default: 'Tất cả' },
  active: { type: Boolean, default: true },
  autoRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("CanhBao", CanhBaoSchema);