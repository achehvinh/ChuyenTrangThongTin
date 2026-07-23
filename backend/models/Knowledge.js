const mongoose = require('mongoose');

const KnowledgeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  keywords: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    default: "Phòng chống Lừa đảo Mạng"
  },
  type: {
    type: String,
    enum: ['Tuyên truyền', 'Thủ tục hành chính', 'Hỏi đáp', 'Văn bản', 'Hướng dẫn', 'Thông báo'],
    default: 'Thủ tục hành chính'
  },
  source: {
    type: String,
    default: 'Phòng Văn hóa - Xã hội'
  },
  priority: {
    type: String,
    enum: ['Thấp', 'Trung bình', 'Cao', 'Khẩn'],
    default: 'Trung bình'
  },
  status: {
    type: String,
    enum: ['Nháp', 'Chờ duyệt', 'Đã duyệt'],
    default: 'Đã duyệt'
  },
  content: {
    type: String,
    required: true
  },
  creator: {
    type: String,
    default: 'Admin - Phòng VH-XH'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Knowledge", KnowledgeSchema);