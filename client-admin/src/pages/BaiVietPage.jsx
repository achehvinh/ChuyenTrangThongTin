import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './BaiVietPage.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const DANH_MUC_LIST = [
  { value: 'su-kien',  label: 'Sự kiện' },
  { value: 'the-thao', label: 'Thể thao' },
  { value: 'le-hoi',   label: 'Lễ hội' },
  { value: 'bau-cu',   label: 'Bầu cử' },
  { value: 'khac',     label: 'Khác' },
];

const EMPTY_FORM = {
  tieu_de: '', mo_ta: '', noi_dung: '',
  danh_muc: 'su-kien', trang_thai: 'nhap', nguoi_dang: 'Admin',
};

function getToken() {
  return localStorage.getItem('admin_token') || '';
}

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
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
  const [list, setList]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // null = tạo mới
  const [form, setForm]       = useState(EMPTY_FORM);
  const [anh, setAnh]         = useState(null);
  const [anhPreview, setAnhPreview] = useState('');
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState('');
  const [deleting, setDeleting] = useState(null);
  const fileRef = useRef();

  useEffect(() => { loadList(); }, []);

  async function loadList() {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/bai-viet/admin/all`, {
        headers: authHeader(),
      });
      setList(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      setMsg('Không tải được danh sách bài viết.');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setAnh(null);
    setAnhPreview('');
    setMsg('');
    setShowForm(true);
  }

  function openEdit(bv) {
    setEditing(bv);
    setForm({
      tieu_de: bv.tieu_de,
      mo_ta: bv.mo_ta,
      noi_dung: bv.noi_dung,
      danh_muc: bv.danh_muc,
      trang_thai: bv.trang_thai,
      nguoi_dang: bv.nguoi_dang,
    });
    setAnh(null);
    setAnhPreview(bv.anh_dai_dien || '');
    setMsg('');
    setShowForm(true);
  }

  function handleAnhChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAnh(file);
    setAnhPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.tieu_de.trim() || !form.noi_dung.trim()) {
      setMsg('Vui lòng nhập tiêu đề và nội dung.');
      return;
    }
    setSaving(true);
    setMsg('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (anh) fd.append('anh', anh);

      if (editing) {
        await axios.put(`${API}/bai-viet/${editing._id}`, fd, {
          headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
        });
        setMsg('Đã cập nhật bài viết.');
      } else {
        await axios.post(`${API}/bai-viet`, fd, {
          headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
        });
        setMsg('Đã tạo bài viết mới.');
      }
      setShowForm(false);
      loadList();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Lưu thất bại.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(bv) {
    if (!window.confirm(`Xóa bài "${bv.tieu_de}"?`)) return;
    setDeleting(bv._id);
    try {
      await axios.delete(`${API}/bai-viet/${bv._id}`, { headers: authHeader() });
      loadList();
    } catch {
      setMsg('Xóa thất bại.');
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
    } catch {
      setMsg('Cập nhật trạng thái thất bại.');
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

            <form className="bv-form" onSubmit={handleSubmit}>

              {/* Tiêu đề */}
              <label className="bv-label">
                Tiêu đề <span className="bv-required">*</span>
                <input
                  className="bv-input"
                  value={form.tieu_de}
                  onChange={e => setForm(p => ({ ...p, tieu_de: e.target.value }))}
                  placeholder="Nhập tiêu đề bài viết..."
                />
              </label>

              {/* Mô tả ngắn */}
              <label className="bv-label">
                Mô tả ngắn
                <input
                  className="bv-input"
                  value={form.mo_ta}
                  onChange={e => setForm(p => ({ ...p, mo_ta: e.target.value }))}
                  placeholder="Tóm tắt hiển thị ở danh sách..."
                />
              </label>

              {/* Ảnh đại diện */}
              <label className="bv-label">
                Ảnh đại diện
                <div
                  className="bv-img-upload"
                  onClick={() => fileRef.current.click()}
                >
                  {anhPreview
                    ? <img src={anhPreview} alt="preview" />
                    : <span>Nhấn để chọn ảnh (JPG/PNG, tối đa 5MB)</span>}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAnhChange}
                />
              </label>

              {/* Danh mục + Trạng thái */}
              <div className="bv-row-2">
                <label className="bv-label">
                  Danh mục
                  <select
                    className="bv-select"
                    value={form.danh_muc}
                    onChange={e => setForm(p => ({ ...p, danh_muc: e.target.value }))}
                  >
                    {DANH_MUC_LIST.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </label>
                <label className="bv-label">
                  Trạng thái
                  <select
                    className="bv-select"
                    value={form.trang_thai}
                    onChange={e => setForm(p => ({ ...p, trang_thai: e.target.value }))}
                  >
                    <option value="nhap">Nháp (chưa hiển thị)</option>
                    <option value="da-dang">Đã đăng (hiện với dân)</option>
                  </select>
                </label>
              </div>

              {/* Nội dung */}
              <label className="bv-label">
                Nội dung <span className="bv-required">*</span>
                <textarea
                  className="bv-textarea"
                  rows={10}
                  value={form.noi_dung}
                  onChange={e => setForm(p => ({ ...p, noi_dung: e.target.value }))}
                  placeholder="Nhập nội dung bài viết đầy đủ..."
                />
              </label>

              {/* Người đăng */}
              <label className="bv-label">
                Người đăng
                <input
                  className="bv-input"
                  value={form.nguoi_dang}
                  onChange={e => setForm(p => ({ ...p, nguoi_dang: e.target.value }))}
                />
              </label>

              {msg && <div className="bv-msg">{msg}</div>}

              <div className="bv-form-actions">
                <button type="button" className="bv-btn-secondary" onClick={() => setShowForm(false)}>
                  Hủy
                </button>
                <button type="submit" className="bv-btn-primary" disabled={saving}>
                  {saving ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Đăng bài'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}