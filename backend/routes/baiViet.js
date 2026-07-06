const express   = require('express');
const multer    = require('multer');
const path      = require('path');
const fs        = require('fs');
const BaiViet   = require('../models/BaiViet');
const authAdmin = require('../middleware/auth');

const router = express.Router();

/* ── Cấu hình upload ảnh ── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'baiviet');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpeg|jpg|png|webp)$/i.test(path.extname(file.originalname));
    cb(null, allowed);
  },
});

/* ════════════════════════════════════════
   ADMIN routes — đặt TRƯỚC /:id
   để Express không nhầm "admin" thành id
════════════════════════════════════════ */

/* ADMIN: lấy tất cả bài (kể cả nháp) */
router.get('/admin/all', authAdmin, async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);

    const [rows, total] = await Promise.all([
      BaiViet.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-noi_dung'),
      BaiViet.countDocuments(),
    ]);

    res.json({ data: rows, total, page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ADMIN: tạo bài viết mới */
router.post('/', authAdmin, upload.single('anh'), async (req, res) => {
  try {
    const { tieu_de, mo_ta, noi_dung, danh_muc, trang_thai, nguoi_dang } = req.body;

    if (!tieu_de?.trim() || !noi_dung?.trim()) {
      return res.status(400).json({ message: 'Tiêu đề và nội dung không được trống.' });
    }

    const base = process.env.BASE_URL || 'http://localhost:5000';
    const anh_dai_dien = req.file
      ? `${base}/uploads/baiviet/${req.file.filename}`
      : '';

    const bv = await BaiViet.create({
      tieu_de: tieu_de.trim(),
      mo_ta:   (mo_ta || '').trim(),
      noi_dung: noi_dung.trim(),
      danh_muc:   danh_muc   || 'su-kien',
      trang_thai: trang_thai || 'nhap',
      nguoi_dang: nguoi_dang || 'Admin',
      anh_dai_dien,
    });

    res.status(201).json({ data: bv });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ADMIN: sửa bài viết */
router.put('/:id', authAdmin, upload.single('anh'), async (req, res) => {
  try {
    const update = { ...req.body };

    if (req.file) {
      const base = process.env.BASE_URL || 'http://localhost:5000';
      update.anh_dai_dien = `${base}/uploads/baiviet/${req.file.filename}`;
    }

    const bv = await BaiViet.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!bv) return res.status(404).json({ message: 'Không tìm thấy bài viết.' });

    res.json({ data: bv });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ADMIN: xóa bài viết */
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const bv = await BaiViet.findByIdAndDelete(req.params.id);
    if (!bv) return res.status(404).json({ message: 'Không tìm thấy bài viết.' });
    res.json({ message: 'Đã xóa bài viết.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ════════════════════════════════════════
   PUBLIC routes — đặt SAU admin routes
════════════════════════════════════════ */

/* PUBLIC: danh sách bài đã đăng */
router.get('/', async (req, res) => {
  try {
    const page     = Math.max(1, parseInt(req.query.page)  || 1);
    const limit    = Math.max(1, parseInt(req.query.limit) || 9);
    const danh_muc = req.query.danh_muc;

    const filter = { trang_thai: 'da-dang' };
    if (danh_muc && danh_muc !== 'tat-ca') filter.danh_muc = danh_muc;

    const [rows, total] = await Promise.all([
      BaiViet.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-noi_dung'),
      BaiViet.countDocuments(filter),
    ]);

    res.json({ data: rows, total, page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* PUBLIC: chi tiết bài + tăng lượt xem */
router.get('/:id', async (req, res) => {
  try {
    const bv = await BaiViet.findOneAndUpdate(
      { _id: req.params.id, trang_thai: 'da-dang' },
      { $inc: { luot_xem: 1 } },
      { new: true }
    );
    if (!bv) return res.status(404).json({ message: 'Không tìm thấy bài viết.' });
    res.json({ data: bv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;