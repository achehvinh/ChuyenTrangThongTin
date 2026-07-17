const mongoose = require("mongoose");

const LichHopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  thon: { type: String, required: true },
  type: { type: String, enum: ['giao-ban', 'hop-khan', 'chuyen-de', 'tap-huan', 'hop-dan', 'tiem-chung', 'phat-ho-tro', 'khac'], default: 'giao-ban' },
  note: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model("LichHop", LichHopSchema);