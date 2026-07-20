const mongoose = require("mongoose");

const LichHopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  thon: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['giao-ban', 'hop-bao-mat', 'hop-khan', 'chuyen-de', 'tap-huan', 'hop-dan', 'tiem-chung', 'phat-ho-tro', 'khac'], 
    default: 'giao-ban' 
  },
  note: { type: String, default: '' },
  meetingCode: { type: String, default: '' },
  passcode: { type: String, default: '' },
  isSecured: { type: Boolean, default: true },
  isLocked: { type: Boolean, default: false },
  createdBy: { type: String, default: 'Trưởng phòng Nguyễn Thái Huy' },
  createdByRole: { type: String, default: 'truongphong' },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  summary: {
    durationSeconds: { type: Number, default: 0 },
    attendanceLog: { type: Array, default: [] },
    bienBan: { type: String, default: '' },
    ketLuan: { type: Array, default: [] },
    auditLogs: { type: Array, default: [] }
  }
}, { timestamps: true });

module.exports = mongoose.model("LichHop", LichHopSchema);