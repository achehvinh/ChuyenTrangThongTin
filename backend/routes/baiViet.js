const express   = require('express');
const multer    = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const BaiViet   = require('../models/BaiViet');
const { authAdmin } = require('../middleware/auth');

const router = express.Router();

/* ── Cấu hình upload ảnh lên Cloudinary ── */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'baiviet',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* ════════════════════════════════════════
   ADMIN routes — đặt TRƯỚC /:id
════════════════════════════════════════ */

router.get('/admin/all', authAdmin, async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 20);

    const [rows, total] = await Promise.all([
      BaiViet.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),          // 👈 bỏ dòng .select('-noi_dung') đi
      BaiViet.countDocuments(),
    ]);

    res.json({ data: rows, total, page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authAdmin, upload.single('anh'), async (req, res) => {
  try {
    const { tieu_de, mo_ta, noi_dung, danh_muc, trang_thai, nguoi_dang } = req.body;

    if (!tieu_de?.trim() || !noi_dung?.trim()) {
      return res.status(400).json({ message: 'Tiêu đề và nội dung không được trống.' });
    }

    const anh_dai_dien = req.file ? req.file.path : '';

    const bv = await BaiViet.create({
      tieu_de: tieu_de.trim(),
      mo_ta:   (mo_ta || '').trim(),
      noi_dung: noi_dung.trim(),
      danh_muc:   danh_muc   || 'su-kien',
      trang_thai: trang_thai || 'da-dang',
      nguoi_dang: nguoi_dang || 'Admin',
      anh_dai_dien,
    });

    res.status(201).json({ data: bv });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', authAdmin, upload.single('anh'), async (req, res) => {
  try {
    const update = { ...req.body };

    if (req.file) {
      update.anh_dai_dien = req.file.path;
    }

    const bv = await BaiViet.findByIdAndUpdate(
      req.params.id,
      update,
      { returnDocument: 'after', runValidators: true }
    );
    if (!bv) return res.status(404).json({ message: 'Không tìm thấy bài viết.' });

    res.json({ data: bv });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const bv = await BaiViet.findByIdAndDelete(req.params.id);
    if (!bv) return res.status(404).json({ message: 'Không tìm thấy bài viết.' });
    res.json({ message: 'Đã xóa bài viết.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
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

router.get('/:id', async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: 'Không tìm thấy bài viết.' });
    }
    const bv = await BaiViet.findOneAndUpdate(
      { _id: req.params.id, trang_thai: 'da-dang' },
      { $inc: { luot_xem: 1 } },
      { returnDocument: 'after' }
    );
    if (!bv) return res.status(404).json({ message: 'Không tìm thấy bài viết.' });
    res.json({ data: bv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;