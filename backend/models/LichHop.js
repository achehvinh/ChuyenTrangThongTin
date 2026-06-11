const mongoose = require("mongoose");

const LichHopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  thon: { type: String, required: true },
  type: { type: String, enum: ['hop-dan', 'tiem-chung', 'phat-ho-tro', 'tap-huan', 'khac'], default: 'hop-dan' },
  note: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model("LichHop", LichHopSchema);