import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BaiVietPage.css';

const CLOUDINARY_CLOUD_NAME = 'hfbyeesv'; // 👈 thay bằng cloud_name thật của bạn
const CLOUDINARY_UPLOAD_PRESET = 'baiviet_video_unsigned';

const API =
  import.meta.env.VITE_API_URL ||
  'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1';

const DANH_MUC_LIST = [
  { value: 'phong-chong-lua-dao', label: '🛡️ Phòng, chống Lừa đảo Không gian mạng' },
  { value: 'an-toan-giao-thong',  label: '🚦 Tuyên truyền An toàn Giao thông' },
  { value: 'thien-tai',           label: '🌧️ Phòng chống Thiên tai & Bão lũ' },
  { value: 'bau-cu',              label: '🗳️ Tuyên truyền Bầu cử' },
  { value: 'huong-dan-vneid',     label: '🆔 Hướng dẫn VNeID Mức 2' },
  { value: 'te-nan',              label: '🛡️ Phòng chống Tệ nạn Xã hội' },
  { value: 'chay-rung',           label: '🔥 Phòng chống Cháy rừng' },
  { value: 'duoi-nuoc',           label: '🏊 Phòng chống Đuối nước' },
  { value: 'thu-tuc-hanh-chinh',  label: '📑 Thủ tục Hành chính & Dịch vụ công' },
  { value: 'tra-cuu',             label: '🏥 Tra cứu BHYT & BHXH' },
  { value: 'su-kien',             label: '📌 Sự kiện địa phương' },
  { value: 'the-thao',            label: '⚽ Thể thao phong trào' },
  { value: 'le-hoi',              label: '🌾 Lễ hội văn hóa' },
  { value: 'khac',                label: '📰 Khác' },
  // ── An toàn Giao thông chi tiết ──
  { value: 'atgt-tin-tuc',         label: '🚦 ATGT — Tin tuyên truyền' },
  { value: 'atgt-phap-luat',       label: '🚦 ATGT — Hướng dẫn an toàn' },
  { value: 'atgt-hoc-sinh',        label: '🚦 ATGT — Học sinh' },
  { value: 'atgt-duong-nong-thon', label: '🚦 ATGT — Đường nông thôn' },
  { value: 'atgt-mua-mua',         label: '🚦 ATGT — Mùa mưa bão' },
  { value: 'atgt-van-hoa',         label: '🚦 ATGT — Văn hóa giao thông' },
  { value: 'atgt-van-ban',         label: '🚦 ATGT — Khuyến cáo' },
];


const EMPTY_FORM = {
  tieu_de: '', mo_ta: '', noi_dung: '',
  danh_muc: 'su-kien', trang_thai: 'nhap', nguoi_dang: 'Admin',
  chu_chay: '',
};

function getToken() {
  return localStorage.getItem('admin_token') || '';
}

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

function handleVideoChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 100 * 1024 * 1024) {
    setMsg('Video quá lớn (tối đa 100MB, khoảng 5 phút).');
    return;
  }
  setVideo(file);
  setVideoPreview(URL.createObjectURL(file));
}

async function uploadVideoToCloudinary(file, onProgress) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
    fd,
    {
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    }
  );
  return res.data.secure_url;
}

function DanhMucBadge({ value }) {
  const map = {
    'su-kien': ['#1a56db', 'Sự kiện'],
    'the-thao': ['#15803d', 'Thể thao'],
    'le-hoi': ['#b45309', 'Lễ hội'],
    'bau-cu': ['#b91c1c', 'Bầu cử'],
    'khac': ['#64748b', 'Khác'],
  };
  const [color, label] = map[value] || ['#64748b', value];
  return (
    <span className="bv-badge" style={{ background: color + '18', color, border: `1px solid ${color}40` }}>
      {label}
    </span>
  );
}

export default function BaiVietPage() {
  const navigate = useNavigate();
  const [list, setList]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // null = tạo mới
  const [form, setForm]       = useState(EMPTY_FORM);
  const [anh, setAnh]         = useState(null);
  const [anhPreview, setAnhPreview] = useState('');
  const [anhPhu, setAnhPhu]         = useState([]); 
  const [anhPhuPreview, setAnhPhuPreview] = useState([]);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');
  const [deleting, setDeleting] = useState(null);
  const fileRef = useRef();
  const fileRefPhu = useRef();   
  const [showMore, setShowMore] = useState(false);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const fileRefVideo = useRef();
  const [uploadProgress, setUploadProgress] = useState(0);


  useEffect(() => { loadList(); }, []);

  function handleAuthFailure(err) {
    const status = err?.response?.status;
    const message = err?.response?.data?.message;
    if (status === 401 || message === 'Token không hợp lệ') {
      localStorage.removeItem('admin_token');
      navigate('/dang-nhap');
      return true;
    }
    return false;
  }

  async function loadList() {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/bai-viet/admin/all`, {
        headers: authHeader(),
        params: { _t: Date.now() },
      });
      setList(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      if (!handleAuthFailure(err)) {
        setMsg('Không tải được danh sách bài viết.');
      }
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
  setEditing(null);
  setForm(EMPTY_FORM);
  setAnh(null);
  setAnhPreview('');
  setAnhPhu([]);
  setAnhPhuPreview([]);
  setMsg('');
  setShowForm(true);
  setVideo(null);
  setVideoPreview('');
}

function handleVideoChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 100 * 1024 * 1024) {
    setMsg('Video quá lớn (tối đa 100MB, ~5 phút).');
    return;
  }
  setVideo(file);
  setVideoPreview(URL.createObjectURL(file));
}

function openEdit(bv) {
  setEditing(bv);
  setForm({
    tieu_de: bv.tieu_de || '',
    mo_ta: bv.mo_ta || '',
    noi_dung: bv.noi_dung || '',
    danh_muc: bv.danh_muc || 'su-kien',
    trang_thai: bv.trang_thai || 'nhap',
    nguoi_dang: bv.nguoi_dang || 'Admin',
    chu_chay: bv.chu_chay || '',
  });
  setAnh(null);
  setAnhPreview(bv.anh_dai_dien || '');
  setAnhPhu([]);
  setAnhPhuPreview(bv.anh_phu || []);  // hiện ảnh phụ cũ (dạng URL, không phải File)
  setMsg('');
  setShowForm(true);
  setVideoPreview(bv.video || '');
  setVideo(null);
}

  function handleAnhChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAnh(file);
    setAnhPreview(URL.createObjectURL(file));
  }
  function handleAnhPhuChange(e) {
  const files = Array.from(e.target.files);
  setAnhPhu(prev => [...prev, ...files]);
  setAnhPhuPreview(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
}

function removeAnhPhu(index) {
  setAnhPhu(prev => prev.filter((_, i) => i !== index));
  setAnhPhuPreview(prev => prev.filter((_, i) => i !== index));
}

async function handleSubmit(e) {
  e.preventDefault();
  const tieuDe = form.tieu_de || '';
  const noiDung = form.noi_dung || '';

  if (!tieuDe.trim() || !noiDung.trim()) {
    setMsg('Vui lòng nhập tiêu đề và nội dung.');
    return;
  }
  setSaving(true);
  setMsg('');
  setUploadProgress(0);

  try {
    let videoUrl = editing?.video || '';

    if (video) {
      setMsg('Đang tải video lên Cloudinary...');
      videoUrl = await uploadVideoToCloudinary(video, (pct) => {
        setUploadProgress(pct);
        setMsg(`Đang tải video lên... ${pct}%`);
      });
    }

    setMsg('Đang lưu bài viết...');
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''));
    if (anh) fd.append('anh', anh);
    anhPhu.forEach(file => fd.append('anh_phu', file));
    fd.append('video_url', videoUrl);

    if (editing) {
      await axios.put(`${API}/bai-viet/${editing._id}`, fd, { headers: { ...authHeader() } });
      setMsg('Đã cập nhật bài viết.');
    } else {
      await axios.post(`${API}/bai-viet`, fd, { headers: { ...authHeader() } });
      setMsg('Đã tạo bài viết mới.');
    }
    setShowForm(false);
    loadList();
  } catch (err) {
    if (!handleAuthFailure(err)) {
      const cloudErr = err?.response?.data?.error?.message;
      setMsg(cloudErr || err.response?.data?.message || 'Lưu thất bại.');
    }
  } finally {
    setSaving(false);
    setUploadProgress(0);
  }
}

  async function handleDelete(bv) {
    if (!window.confirm(`Xóa bài "${bv.tieu_de}"?`)) return;
    setDeleting(bv._id);
    try {
      await axios.delete(`${API}/bai-viet/${bv._id}`, { headers: authHeader() });
      loadList();
    } catch (err) {
      if (!handleAuthFailure(err)) {
        setMsg('Xóa thất bại.');
      }
    } finally {
      setDeleting(null);
    }
  }

  async function toggleTrangThai(bv) {
    const next = bv.trang_thai === 'da-dang' ? 'nhap' : 'da-dang';
    try {
      await axios.put(`${API}/bai-viet/${bv._id}`, { trang_thai: next }, {
        headers: authHeader(),
      });
      loadList();
    } catch (err) {
      if (!handleAuthFailure(err)) {
        setMsg('Cập nhật trạng thái thất bại.');
      }
    }
  }

  return (
    <div className="bv-page">

      {/* Header */}
      <div className="bv-header">
        <div>
          <h1 className="bv-title">Quản lý bài viết</h1>
          <p className="bv-sub">{total} bài viết · Chuyên trang thông tin Đăk Pxi</p>
        </div>
        <button className="bv-btn-primary" onClick={openCreate}>
          + Tạo bài viết mới
        </button>
      </div>
      {saving && uploadProgress > 0 && uploadProgress < 100 && (
  <div className="bv-progress-bar">
    <div className="bv-progress-fill" style={{ width: `${uploadProgress}%` }} />
  </div>
)}
      {msg && <div className="bv-msg">{msg}</div>}

      {/* Bảng danh sách */}
      {loading ? (
        <div className="bv-loading">
          {[1,2,3].map(i => <div key={i} className="bv-skeleton" />)}
        </div>
      ) : (
        <div className="bv-table-wrap">
          <table className="bv-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
                <th>Lượt xem</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr><td colSpan={7} className="bv-empty">Chưa có bài viết nào</td></tr>
              )}
              {list.map(bv => (
                <tr key={bv._id}>
                  <td>
                    {bv.anh_dai_dien
                      ? <img src={bv.anh_dai_dien} alt="" className="bv-thumb" />
                      : <div className="bv-thumb bv-thumb-empty" />}
                  </td>
                  <td>
                    <span className="bv-row-title">{bv.tieu_de}</span>
                    {bv.mo_ta && <span className="bv-row-desc">{bv.mo_ta}</span>}
                  </td>
                  <td><DanhMucBadge value={bv.danh_muc} /></td>
                  <td>
                    <button
                      className={`bv-status-btn ${bv.trang_thai === 'da-dang' ? 'is-published' : ''}`}
                      onClick={() => toggleTrangThai(bv)}
                      title="Nhấn để chuyển trạng thái"
                    >
                      {bv.trang_thai === 'da-dang' ? 'Đã đăng' : 'Nháp'}
                    </button>
                  </td>
                  <td>{bv.luot_xem.toLocaleString('vi-VN')}</td>
                  <td>{new Date(bv.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="bv-actions">
                    <button className="bv-btn-edit" onClick={() => openEdit(bv)}>Sửa</button>
                    <button
                      className="bv-btn-delete"
                      onClick={() => handleDelete(bv)}
                      disabled={deleting === bv._id}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal tạo/sửa bài viết */}
      {showForm && (
        <div className="bv-overlay" onClick={() => setShowForm(false)}>
          <div className="bv-modal" onClick={e => e.stopPropagation()}>

            <div className="bv-modal-head">
              <h2>{editing ? 'Sửa bài viết' : 'Tạo bài viết mới'}</h2>
              <button className="bv-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>

            <form className="bv-compose" onSubmit={handleSubmit}>

  <input
    className="bv-compose-title"
    value={form.tieu_de}
    onChange={e => setForm(p => ({ ...p, tieu_de: e.target.value }))}
    placeholder="Tiêu đề bài viết"
  />

  <textarea
    className="bv-compose-body"
    rows={6}
    value={form.noi_dung}
    onChange={e => setForm(p => ({ ...p, noi_dung: e.target.value }))}
    placeholder="Bạn muốn chia sẻ điều gì?"
  />

  <div className="bv-compose-media">
    {anhPreview && (
      <div className="bv-media-item bv-media-item--cover">
        <img src={anhPreview} alt="" />
        <span className="bv-media-badge">Ảnh bìa</span>
        <button type="button" className="bv-media-remove"
          onClick={() => { setAnh(null); setAnhPreview(''); }}>✕</button>
      </div>
    )}
    {anhPhuPreview.map((url, i) => (
      <div className="bv-media-item" key={i}>
        <img src={url} alt="" />
        <button type="button" className="bv-media-remove"
          onClick={() => removeAnhPhu(i)}>✕</button>
      </div>
    ))}
    <button type="button" className="bv-media-add" onClick={() => fileRef.current.click()}>
      <span>+</span>
      <small>Thêm ảnh</small>
    </button>

    <div className="bv-compose-video">
  {videoPreview ? (
    <div className="bv-video-item">
      <video src={videoPreview} controls />
      <button type="button" className="bv-media-remove"
        onClick={() => { setVideo(null); setVideoPreview(''); }}>✕</button>
    </div>
  ) : (
    <button type="button" className="bv-video-add" onClick={() => fileRefVideo.current.click()}>
      <span>🎥</span>
      <small>Thêm video (tối đa 5 phút)</small>
    </button>
  )}
</div>

<input
  ref={fileRefVideo}
  type="file"
  accept="video/*"
  style={{ display: 'none' }}
  onChange={handleVideoChange}
/>
  </div>

  <input
    ref={fileRef}
    type="file"
    accept="image/*"
    multiple
    style={{ display: 'none' }}
    onChange={e => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        if (!anh) {
          setAnh(file);
          setAnhPreview(URL.createObjectURL(file));
        } else {
          setAnhPhu(p => [...p, file]);
          setAnhPhuPreview(p => [...p, URL.createObjectURL(file)]);
        }
      });
    }}
  />

  <div className="bv-compose-options">
    <select
      className="bv-pill-select"
      value={form.danh_muc}
      onChange={e => setForm(p => ({ ...p, danh_muc: e.target.value }))}
    >
      {DANH_MUC_LIST.map(d => (
        <option key={d.value} value={d.value}>{d.label}</option>
      ))}
    </select>

    <button
      type="button"
      className={`bv-pill-toggle ${form.trang_thai === 'da-dang' ? 'is-on' : ''}`}
      onClick={() => setForm(p => ({
        ...p,
        trang_thai: p.trang_thai === 'da-dang' ? 'nhap' : 'da-dang',
      }))}
    >
      {form.trang_thai === 'da-dang' ? '🌐 Công khai' : '🔒 Nháp'}
    </button>

    <button type="button" className="bv-pill-more" onClick={() => setShowMore(s => !s)}>
      {showMore ? 'Ẩn bớt' : 'Thêm chi tiết'}
    </button>
  </div>

  {showMore && (
    <div className="bv-compose-extra">
      <input
        className="bv-input"
        placeholder="Mô tả ngắn (hiện ở danh sách)"
        value={form.mo_ta}
        onChange={e => setForm(p => ({ ...p, mo_ta: e.target.value }))}
      />
      <input
        className="bv-input"
        placeholder="Dòng chữ chạy nổi bật trên trang chủ (bỏ trống nếu không muốn chạy)"
        value={form.chu_chay}
        onChange={e => setForm(p => ({ ...p, chu_chay: e.target.value }))}
      />
      <input
        className="bv-input"
        placeholder="Người đăng"
        value={form.nguoi_dang}
        onChange={e => setForm(p => ({ ...p, nguoi_dang: e.target.value }))}
      />
    </div>
  )}

  {msg && <div className="bv-msg">{msg}</div>}

  <div className="bv-form-actions">
    <button type="button" className="bv-btn-secondary" onClick={() => setShowForm(false)}>
      Hủy
    </button>
    <button type="submit" className="bv-btn-primary" disabled={saving}>
      {saving ? 'Đang đăng...' : editing ? 'Cập nhật' : 'Đăng bài'}
    </button>
  </div>
</form>
          </div>
        </div>
      )}
    </div>
  );
}