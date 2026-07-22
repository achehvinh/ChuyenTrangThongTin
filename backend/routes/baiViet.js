const express   = require('express');
const multer    = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const BaiViet   = require('../models/BaiViet');
const { authAdmin } = require('../middleware/auth');

const router = express.Router();

/* ── Cấu hình upload ảnh + video + PDF lên Cloudinary ── */
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
    if (file.fieldname === 'tai_lieu_files') {
      return {
        folder: 'baiviet/tai-lieu',
        resource_type: 'raw',
        allowed_formats: ['pdf', 'doc', 'docx'],
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
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

const uploadFields = upload.fields([
  { name: 'anh', maxCount: 1 },
  { name: 'anh_phu', maxCount: 20 },
  { name: 'video', maxCount: 1 },
  { name: 'tai_lieu_files', maxCount: 10 }, // 📄 Upload PDF/DOCX
]);

/* ── ATGT prefix list ── */
const ATGT_PREFIXES = ['atgt-tin-tuc','atgt-phap-luat','atgt-hoc-sinh','atgt-duong-nong-thon','atgt-mua-mua','atgt-van-hoa','atgt-van-ban'];

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
    const { tieu_de, mo_ta, noi_dung, danh_muc, trang_thai, nguoi_dang, video_url, chu_chay } = req.body;

    if (!tieu_de?.trim() || !noi_dung?.trim()) {
      return res.status(400).json({ message: 'Tiêu đề và nội dung không được trống.' });
    }

    const anh_dai_dien = req.files?.anh?.[0]?.path || '';
    const anh_phu = (req.files?.anh_phu || []).map(f => f.path);
    const video = req.files?.video?.[0]?.path || video_url || '';

    // Parse tai_lieu từ JSON string hoặc từ file upload
    let tai_lieu = [];
    if (req.body.tai_lieu) {
      try { tai_lieu = JSON.parse(req.body.tai_lieu); } catch {}
    }
    if (req.files?.tai_lieu_files?.length) {
      const uploaded = req.files.tai_lieu_files.map((f, i) => ({
        ten:  (req.body[`tai_lieu_ten_${i}`] || f.originalname).trim(),
        url:  f.path,
        loai: f.originalname.split('.').pop().toLowerCase(),
      }));
      tai_lieu = [...tai_lieu, ...uploaded];
    }

    const bv = await BaiViet.create({
      tieu_de: tieu_de.trim(),
      mo_ta:   (mo_ta || '').trim(),
      noi_dung: noi_dung.trim(),
      danh_muc:   danh_muc   || 'su-kien',
      trang_thai: trang_thai || 'da-dang',
      nguoi_dang: nguoi_dang || 'Admin',
      anh_dai_dien, anh_phu, video,
      chu_chay: (chu_chay || '').trim(),
      tai_lieu,
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
    if (req.files?.video?.[0]) {
      update.video = req.files.video[0].path;
    } else if (req.body.video_url !== undefined) {
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
    const nhom     = req.query.nhom; // 'atgt' để lọc toàn bộ nhóm ATGT
    const search   = req.query.search || '';

    const filter = { trang_thai: 'da-dang' };

    // Lọc theo nhóm ATGT
    if (nhom === 'atgt') {
      filter.danh_muc = { $in: ATGT_PREFIXES };
    } else if (danh_muc && danh_muc !== 'tat-ca') {
      filter.danh_muc = danh_muc;
    }

    // Tìm kiếm theo tiêu đề
    if (search.trim()) {
      filter.tieu_de = { $regex: search.trim(), $options: 'i' };
    }

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