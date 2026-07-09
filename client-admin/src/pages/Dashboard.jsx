import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import './Dashboard.css';

const DANH_MUC = [
  { value: 'su-kien',   label: '🎉 Sự kiện',    color: '#005bac' },
  { value: 'the-thao',  label: '⚽ Thể thao',    color: '#16a34a' },
  { value: 'le-hoi',    label: '🏮 Lễ hội',      color: '#d97706' },
  { value: 'bau-cu',    label: '🗳️ Bầu cử',      color: '#dc2626' },
  { value: 'tin-tuc',   label: '📰 Tin tức',      color: '#0891b2' },
  { value: 'thong-bao', label: '📢 Thông báo',    color: '#7c3aed' },
  { value: 'khac',      label: '📌 Khác',          color: '#64748b' },
];

const getDM = (val) => DANH_MUC.find(d => d.value === val) || DANH_MUC[4];

const EMPTY_FORM = {
  tieu_de: '',
  noi_dung: '',
  tom_tat: '',
  anh_dai_dien: '',
  danh_muc: 'tin-tuc',
  tac_gia: 'Admin UBND xã Đắk Pxi',
  noi_bat: false,
  active: true,
  tags: '',
};

export default function BaiViet() {
  const [items, setItems]       = useState([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [filterDM, setFilterDM] = useState('all');
  const [imgPreview, setImgPreview] = useState(null);
  const fileRef = useRef();

  /* ── Fetch ── */
  const fetchData = async () => {
    setFetching(true);
    try {
      const res = await api.get('/bai-viet?limit=100');
      setItems(res.data.items || res.data || []);
    } catch {
      setError('Không thể kết nối server!');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* ── Reset form ── */
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
    setError('');
    setImgPreview(null);
  };

  /* ── Sửa ── */
  const handleEdit = (item) => {
    setForm({
      tieu_de:      item.tieu_de,
      noi_dung:     item.noi_dung,
      tom_tat:      item.tom_tat || '',
      anh_dai_dien: item.anh_dai_dien || '',
      danh_muc:     item.danh_muc,
      tac_gia:      item.tac_gia,
      noi_bat:      item.noi_bat,
      active:       item.active,
      tags:         (item.tags || []).join(', '),
    });
    setEditId(item._id);
    setImgPreview(item.anh_dai_dien || null);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  /* ── Chọn ảnh từ máy ── */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImgPreview(ev.target.result);
      setForm(f => ({ ...f, anh_dai_dien: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tieu_de.trim() || !form.noi_dung.trim()) {
      setError('Vui lòng nhập đầy đủ tiêu đề và nội dung!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editId) {
        const res = await api.put(`/bai-viet/${editId}`, payload);
        setItems(prev => prev.map(i => i._id === editId ? res.data : i));
      } else {
        const res = await api.post('/bai-viet', payload);
        setItems(prev => [res.data, ...prev]);
      }
      resetForm();
    } catch {
      setError('Lưu thất bại! Kiểm tra lại server.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Xóa ── */
  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa bài viết này?')) return;
    try {
      await api.delete(`/bai-viet/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch {
      alert('Xóa thất bại!');
    }
  };

  /* ── Toggle hiển thị ── */
  const handleToggle = async (id) => {
    try {
      const res = await api.patch(`/bai-viet/${id}/toggle`);
      setItems(prev => prev.map(i => i._id === id ? res.data : i));
    } catch {
      alert('Cập nhật thất bại!');
    }
  };

  /* ── Toggle nổi bật ── */
  const handleNoiBat = async (id) => {
    try {
      const res = await api.patch(`/bai-viet/${id}/noi-bat`);
      setItems(prev => prev.map(i => i._id === id ? res.data : i));
    } catch {
      alert('Cập nhật thất bại!');
    }
  };

  /* ── Filter ── */
  const filtered = items
    .filter(i => filterDM === 'all' || i.danh_muc === filterDM)
    .filter(i =>
      i.tieu_de.toLowerCase().includes(search.toLowerCase()) ||
      (i.tom_tat || '').toLowerCase().includes(search.toLowerCase())
    );

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : '';

  return (
    <div className="admin-page">

      {/* ── Header ── */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>📰 Quản lý bài viết</h1>
          <p>
            Tổng: {items.length} bài ·
            Nổi bật: {items.filter(i => i.noi_bat).length} ·
            Đang hiển thị: {items.filter(i => i.active).length}
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => { resetForm(); setShowForm(!showForm); }}
        >
          {showForm ? '✕ Đóng' : '+ Thêm bài viết'}
        </button>
      </div>

      {/* ── Form thêm / sửa ── */}
      {showForm && (
        <div className="admin-form-panel">
          <h2>{editId ? '✏️ Chỉnh sửa bài viết' : '➕ Thêm bài viết mới'}</h2>
          <form onSubmit={handleSubmit}>

            {/* Tiêu đề */}
            <div className="form-group">
              <label className="form-label">Tiêu đề *</label>
              <input
                className="form-input"
                type="text"
                value={form.tieu_de}
                onChange={e => setForm({ ...form, tieu_de: e.target.value })}
                placeholder="Nhập tiêu đề bài viết..."
              />
            </div>

            {/* Danh mục + Tác giả */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Danh mục</label>
                <select
                  className="form-select"
                  value={form.danh_muc}
                  onChange={e => setForm({ ...form, danh_muc: e.target.value })}
                >
                  {DANH_MUC.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tác giả</label>
                <input
                  className="form-input"
                  type="text"
                  value={form.tac_gia}
                  onChange={e => setForm({ ...form, tac_gia: e.target.value })}
                />
              </div>
            </div>

            {/* Tóm tắt */}
            <div className="form-group">
              <label className="form-label">Tóm tắt (hiển thị ở danh sách)</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={form.tom_tat}
                onChange={e => setForm({ ...form, tom_tat: e.target.value })}
                placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
              />
            </div>

            {/* Nội dung */}
            <div className="form-group">
              <label className="form-label">Nội dung đầy đủ *</label>
              <textarea
                className="form-textarea"
                rows={10}
                value={form.noi_dung}
                onChange={e => setForm({ ...form, noi_dung: e.target.value })}
                placeholder="Nhập nội dung bài viết đầy đủ..."
              />
            </div>

            {/* Ảnh đại diện */}
            <div className="form-group">
              <label className="form-label">Ảnh đại diện</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={handleFile}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ padding: '8px 14px', fontSize: '13px', flexShrink: 0 }}
                  onClick={() => fileRef.current.click()}
                >
                  📷 Chọn ảnh từ máy
                </button>
                <span style={{ color: '#94a3b8', fontSize: '12px', alignSelf: 'center' }}>hoặc</span>
                <input
                  className="form-input"
                  type="text"
                  value={form.anh_dai_dien}
                  onChange={e => {
                    setForm({ ...form, anh_dai_dien: e.target.value });
                    setImgPreview(e.target.value);
                  }}
                  placeholder="Nhập URL ảnh..."
                  style={{ flex: 1, minWidth: '200px' }}
                />
              </div>
              {imgPreview && (
                <img
                  src={imgPreview}
                  alt="Xem trước"
                  onError={() => setImgPreview(null)}
                  style={{
                    marginTop: '10px',
                    width: '200px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    display: 'block',
                  }}
                />
              )}
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label">Tags (phân cách bằng dấu phẩy)</label>
              <input
                className="form-input"
                type="text"
                value={form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })}
                placeholder="VD: bầu cử, hội đồng nhân dân, 2026"
              />
            </div>

            {/* Trạng thái + Nổi bật */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <select
                  className="form-select"
                  value={String(form.active)}
                  onChange={e => setForm({ ...form, active: e.target.value === 'true' })}
                >
                  <option value="true">✅ Hiển thị</option>
                  <option value="false">🚫 Ẩn</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Nổi bật</label>
                <select
                  className="form-select"
                  value={String(form.noi_bat)}
                  onChange={e => setForm({ ...form, noi_bat: e.target.value === 'true' })}
                >
                  <option value="false">Bình thường</option>
                  <option value="true">⭐ Nổi bật (hiện ở trang chủ)</option>
                </select>
              </div>
            </div>

            {error && <div className="form-error">⚠️ {error}</div>}

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? '⏳ Đang lưu...' : editId ? '💾 Cập nhật' : '📰 Đăng bài'}
              </button>
              <button type="button" className="btn-ghost" onClick={resetForm}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filter bar ── */}
      <div className="admin-filter-bar">
        <input
          className="filter-search"
          type="text"
          placeholder="🔍 Tìm kiếm bài viết..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-tags">
          <button
            className={`filter-tag ${filterDM === 'all' ? 'active' : ''}`}
            onClick={() => setFilterDM('all')}
          >
            Tất cả
          </button>
          {DANH_MUC.map(d => (
            <button
              key={d.value}
              className={`filter-tag ${filterDM === d.value ? 'active' : ''}`}
              onClick={() => setFilterDM(d.value)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading / Error ── */}
      {fetching && <div className="admin-loading">⏳ Đang tải dữ liệu...</div>}

      {error && !showForm && (
        <div className="admin-error">
          ⚠️ {error}
          <button
            className="btn-danger"
            style={{ marginLeft: '10px' }}
            onClick={fetchData}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* ── Danh sách ── */}
      {!fetching && (
        <div className="admin-list">
          {filtered.length === 0 ? (
            <div className="admin-empty">Không có bài viết nào</div>
          ) : (
            filtered.map(item => {
              const dm = getDM(item.danh_muc);
              return (
                <div
                  key={item._id}
                  className="admin-card"
                  style={{ borderLeftColor: dm.color, opacity: item.active ? 1 : 0.6 }}
                >
                  {/* Ảnh thumbnail */}
                  {item.anh_dai_dien && (
                    <img
                      src={item.anh_dai_dien}
                      alt={item.tieu_de}
                      onError={e => { e.target.style.display = 'none'; }}
                      style={{
                        width: '100px',
                        height: '72px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        flexShrink: 0,
                        border: '1px solid #e2e8f0',
                      }}
                    />
                  )}

                  {/* Thông tin */}
                  <div className="admin-card-body">
                    <div className="admin-card-tags">
                      <span
                        className="admin-card-tag"
                        style={{ background: dm.color + '20', color: dm.color }}
                      >
                        {dm.label}
                      </span>
                      {item.noi_bat && (
                        <span
                          className="admin-card-tag"
                          style={{ background: '#fef9c3', color: '#854d0e' }}
                        >
                          ⭐ Nổi bật
                        </span>
                      )}
                      <span className="admin-card-date">📅 {fmtDate(item.createdAt)}</span>
                      <span className="admin-card-date">👁 {item.luot_xem || 0} lượt xem</span>
                      <span className={item.active ? 'admin-card-status-on' : 'admin-card-status-off'}>
                        {item.active ? '✅ Đang hiển thị' : '🚫 Đã ẩn'}
                      </span>
                    </div>
                    <h3>{item.tieu_de}</h3>
                    {item.tom_tat && <p>{item.tom_tat}</p>}
                    {item.tac_gia && (
                      <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                        ✍️ {item.tac_gia}
                      </p>
                    )}
                  </div>

                  {/* Hành động */}
                  <div className="admin-card-actions">
                    <button
                      className={item.noi_bat ? 'btn-sm-toggle-off' : 'btn-sm-toggle-on'}
                      onClick={() => handleNoiBat(item._id)}
                    >
                      {item.noi_bat ? '★ Bỏ nổi bật' : '☆ Nổi bật'}
                    </button>
                    <button
                      className={item.active ? 'btn-sm-toggle-off' : 'btn-sm-toggle-on'}
                      onClick={() => handleToggle(item._id)}
                    >
                      {item.active ? '🚫 Ẩn' : '✅ Hiện'}
                    </button>
                    <button className="btn-sm-edit" onClick={() => handleEdit(item)}>
                      ✏️ Sửa
                    </button>
                    <button className="btn-sm-delete" onClick={() => handleDelete(item._id)}>
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}