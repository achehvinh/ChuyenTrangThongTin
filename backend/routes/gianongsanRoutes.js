const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const GiaNongSanSchema = new mongoose.Schema({
  tenCayTrong: String,      // "Cà phê", "Mì", "Cao su"
  icon: String,             // emoji
  donVi: String,            // "kg", "tấn"
  giahientai: Number,       // đồng/kg
  giaTuanTruoc: Number,
  noiThuMua: String,
  ghiChu: String,
  ngayCapNhat: { type: Date, default: Date.now },
});

const GiaNongSan = mongoose.model('GiaNongSan', GiaNongSanSchema);

// GET tất cả
router.get('/', async (req, res) => {
  try {
    const data = await GiaNongSan.find().sort({ ngayCapNhat: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST thêm/cập nhật giá
router.post('/', async (req, res) => {
  try {
    const { tenCayTrong, icon, donVi, giahientai, giaTuanTruoc, noiThuMua, ghiChu } = req.body;
    const existing = await GiaNongSan.findOne({ tenCayTrong });
    if (existing) {
      existing.giaTuanTruoc = existing.giahientai;
      existing.giahientai = giahientai;
      existing.noiThuMua = noiThuMua;
      existing.ghiChu = ghiChu;
      existing.ngayCapNhat = new Date();
      await existing.save();
      return res.json(existing);
    }
    const moi = new GiaNongSan({ tenCayTrong, icon, donVi, giahientai, giaTuanTruoc, noiThuMua, ghiChu });
    await moi.save();
    res.json(moi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed dữ liệu mẫu
router.post('/seed', async (req, res) => {
  try {
    await GiaNongSan.deleteMany({});
    await GiaNongSan.insertMany([
      { tenCayTrong: 'Cà phê nhân xô', icon: '☕', donVi: 'kg', giahientai: 125000, giaTuanTruoc: 120000, noiThuMua: 'Đại lý Minh Hùng - TT Đắk Hà', ghiChu: 'Giá thu mua tại vườn' },
      { tenCayTrong: 'Mì (Sắn) tươi', icon: '🌿', donVi: 'kg', giahientai: 3200, giaTuanTruoc: 3500, noiThuMua: 'Nhà máy tinh bột Đắk Tô', ghiChu: 'Chữ bột đạt 30% trở lên' },
      { tenCayTrong: 'Cao su mủ khô', icon: '🌳', donVi: 'kg', giahientai: 28000, giaTuanTruoc: 27500, noiThuMua: 'Công ty Cao su Kon Tum', ghiChu: 'Mủ tạp SVR 10' },
      { tenCayTrong: 'Cà phê rang xay', icon: '🫘', donVi: 'kg', giahientai: 185000, giaTuanTruoc: 180000, noiThuMua: 'Thu mua tại xã', ghiChu: 'Loại 1, sơ chế sạch' },
    ]);
    res.json({ message: 'Seed thành công!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = { router, GiaNongSan };