const express   = require('express');
const multer    = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const BaiViet   = require('../models/BaiViet');
const { authAdmin } = require('../middleware/auth');

const router = express.Router();

/* ── Cấu hình upload ảnh + video lên Cloudinary ── */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === 'video') {
      return {
        folder: 'baiviet/video',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'webm'],
      };
    }
    return {
      folder: 'baiviet',
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, crop: 'limit' }],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB — đủ cho video ~5 phút
});

const uploadFields = upload.fields([
  { name: 'anh', maxCount: 1 },
  { name: 'anh_phu', maxCount: 20 },
]);

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
        .limit(limit),
      BaiViet.countDocuments(),
    ]);

    res.json({ data: rows, total, page });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authAdmin, uploadFields, async (req, res) => {
  try {
    const { tieu_de, mo_ta, noi_dung, danh_muc, trang_thai, nguoi_dang, video_url } = req.body;

    if (!tieu_de?.trim() || !noi_dung?.trim()) {
      return res.status(400).json({ message: 'Tiêu đề và nội dung không được trống.' });
    }

    const anh_dai_dien = req.files?.anh?.[0]?.path || '';
    const anh_phu = (req.files?.anh_phu || []).map(f => f.path);

    const bv = await BaiViet.create({
      tieu_de: tieu_de.trim(),
      mo_ta:   (mo_ta || '').trim(),
      noi_dung: noi_dung.trim(),
      danh_muc:   danh_muc   || 'su-kien',
      trang_thai: trang_thai || 'da-dang',
      nguoi_dang: nguoi_dang || 'Admin',
      anh_dai_dien,
      anh_phu,
      video: video_url || '',
    });

    res.status(201).json({ data: bv });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', authAdmin, uploadFields, async (req, res) => {
  try {
    const update = { ...req.body };
    delete update.video_url; // xoá field thô, gán lại đúng tên

    if (req.files?.anh?.[0]) {
      update.anh_dai_dien = req.files.anh[0].path;
    }
    if (req.files?.anh_phu?.length) {
      update.anh_phu = req.files.anh_phu.map(f => f.path);
    }
    if (req.body.video_url !== undefined) {
      update.video = req.body.video_url;
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