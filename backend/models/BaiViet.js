const mongoose = require('mongoose');

const TaiLieuSchema = new mongoose.Schema({
  ten:  { type: String, default: '' },   // Tên tài liệu hiển thị
  url:  { type: String, default: '' },   // URL tải về (Cloudinary raw)
  loai: { type: String, default: 'pdf', enum: ['pdf', 'doc', 'docx', 'other'] },
}, { _id: false });

const BaiVietSchema = new mongoose.Schema({
  tieu_de:      { type: String, required: true, trim: true },
  mo_ta:        { type: String, default: '' },           // tóm tắt ngắn
  noi_dung:     { type: String, required: true },        // HTML hoặc plain text
  anh_dai_dien: { type: String, default: '' },           // URL ảnh đại diện
  anh_phu:      [{ type: String }],                      // mảng ảnh phụ
  video:        { type: String, default: '' },
  audio:        { type: String, default: '' },
  chu_chay:     { type: String, default: '' },           // chữ chạy tùy chọn
  tai_lieu:     { type: [TaiLieuSchema], default: [] },  // 📄 File tải về (PDF, DOCX…)

  danh_muc: {
    type: String,
    enum: [
      // ── Danh mục chung ──
      'su-kien', 'the-thao', 'le-hoi', 'bau-cu', 'khac',
      // ── Danh mục An toàn Giao thông ──
      'atgt-tin-tuc',        // Tin tức ATGT
      'atgt-phap-luat',      // Kiến thức pháp luật giao thông
      'atgt-hoc-sinh',       // Học sinh với ATGT
      'atgt-duong-nong-thon',// Đường nông thôn
      'atgt-mua-mua',        // ATGT mùa mưa
      'atgt-van-hoa',        // Văn hóa giao thông
      'atgt-van-ban',        // Văn bản chỉ đạo ATGT
    ],
    default: 'su-kien',
  },
  trang_thai: {
    type: String,
    enum: ['nhap', 'da-dang'],
    default: 'nhap',
  },
  luot_xem:   { type: Number, default: 0 },
  nguoi_dang: { type: String, default: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('BaiViet', BaiVietSchema);