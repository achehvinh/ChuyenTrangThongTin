const mongoose = require('mongoose');

const BaiVietSchema = new mongoose.Schema({
  tieu_de: { type: String, required: true, trim: true },
  mo_ta:   { type: String, default: '' },          // tóm tắt ngắn
  noi_dung:{ type: String, required: true },        // HTML hoặc plain text
  anh_dai_dien: { type: String, default: '' },      // URL ảnh đại diện
  danh_muc: {
    type: String,
    enum: ['su-kien', 'the-thao', 'le-hoi', 'bau-cu', 'khac'],
    default: 'su-kien',
  },
  trang_thai: {
    type: String,
    enum: ['nhap', 'da-dang'],
    default: 'nhap',
  },
  luot_xem:   { type: Number, default: 0 },
  nguoi_dang: { type: String, default: 'Admin' },
}, { timestamps: true }); // tự thêm createdAt, updatedAt

module.exports = mongoose.model('BaiViet', BaiVietSchema);