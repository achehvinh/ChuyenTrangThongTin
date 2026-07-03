import { useState, useEffect } from "react";
import api from "../services/api";
import './ThongBao.css';

const TYPE_OPTIONS = [
  { value: 'urgent', label: '🔴 Quan trọng', color: '#dc2626' },
  { value: 'normal', label: '🔵 Thông báo', color: '#005bac' },
  { value: 'guide', label: '🟢 Hướng dẫn', color: '#16a34a' },
];

export default function ThongBao() {
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'normal',
    active: true,
  });

  // ── Lấy danh sách từ API ──
  const fetchData = async () => {
    setFetching(true);
    try {
      const res = await api.get('/thong-bao');
      setNotices(res.data);
    } catch (err) {
      setError('Không thể kết nối server!');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ title: '', content: '', type: 'normal', active: true });
    setEditItem(null);
    setShowForm(false);
    setError('');
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      content: item.content,
      type: item.type,
      active: item.active,
    });
    setEditItem(item._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa thông báo này?')) return;
    try {
      await api.delete(`/thong-bao/${id}`);
      setNotices(prev => prev.filter(n => n._id !== id));
    } catch {
      alert('Xóa thất bại!');
    }
  };

  const handleToggle = async (id, currentActive) => {
    try {
      const res = await api.patch(`/thong-bao/${id}/toggle`);
      setNotices(prev => prev.map(n => n._id === id ? res.data : n));
    } catch {
      alert('Cập nhật thất bại!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Vui lòng nhập đầy đủ tiêu đề và nội dung!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (editItem) {
        const res = await api.put(`/thong-bao/${editItem}`, form);
        setNotices(prev => prev.map(n => n._id === editItem ? res.data : n));
      } else {
        const res = await api.post('/thong-bao', form);
        setNotices(prev => [res.data, ...prev]);
      }
      resetForm();
    } catch {
      setError('Lưu thất bại! Kiểm tra lại server.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = notices
    .filter(n => filterType === 'all' || n.type === filterType)
    .filter(n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
    );

  const getType = (type) => TYPE_OPTIONS.find(t => t.value === type) || TYPE_OPTIONS[1];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="thongbao-page">

      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">📢 Quản lý thông báo</h1>
          <p className="page-subtitle">
            Tổng: {notices.length} thông báo · Đang hiển thị: {notices.filter(n => n.active).length}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="page-action-btn"
        >
          {showForm ? '✕ Đóng' : '+ Thêm thông báo'}
        </button>
      </div>

      {/* Form thêm/sửa */}
      {showForm && (
        <div className="page-panel">
          <h2 className="section-title">
            {editItem ? '✏️ Chỉnh sửa thông báo' : '➕ Thêm thông báo mới'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tiêu đề *</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Nhập tiêu đề thông báo..."
                className="input-control"
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Loại thông báo</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="select-control"
                >
                  {TYPE_OPTIONS.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Hiển thị</label>
                <select
                  value={form.active}
                  onChange={e => setForm({ ...form, active: e.target.value === 'true' })}
                  className="select-control"
                >
                  <option value="true">✅ Hiển thị</option>
                  <option value="false">🚫 Ẩn</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Nội dung *</label>
              <textarea
                rows={5}
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="Nhập nội dung thông báo..."
                className="textarea-control"
              />
            </div>

            {error && (
              <div className="thongbao-error">
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={loading}
                className="page-action-btn"
                style={{ opacity: loading ? 0.75 : 1 }}
              >
                {loading ? '⏳ Đang lưu...' : editItem ? '💾 Cập nhật' : '📢 Đăng thông báo'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="action-button action-toggle"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bộ lọc + Tìm kiếm */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm thông báo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-control search-input"
        />
        <div className="filter-buttons">
          {[{ value: 'all', label: 'Tất cả' }, ...TYPE_OPTIONS].map(t => (
            <button
              key={t.value}
              onClick={() => setFilterType(t.value)}
              className={`filter-button ${filterType === t.value ? 'active' : ''}`}
            >
              {t.label || 'Tất cả'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {fetching && (
        <div className="list-empty">
          ⏳ Đang tải dữ liệu...
        </div>
      )}

      {/* Lỗi kết nối */}
      {error && !showForm && (
        <div className="toast-error">
          ⚠️ {error} <button onClick={fetchData} style={{ marginLeft: '10px', padding: '6px 14px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Thử lại</button>
        </div>
      )}

      {/* Danh sách */}
      {!fetching && (
        <div className="thongbao-list">
          {filtered.length === 0 ? (
            <div className="list-empty">
              Không có thông báo nào
            </div>
          ) : filtered.map(n => (
            <div
              key={n._id}
              className="notice-card"
              style={{
                borderLeftColor: getType(n.type).color,
                opacity: n.active ? 1 : 0.7,
              }}
            >
              <div style={{ flex: 1 }}>
                <div className="item-meta">
                  <span className="item-badge">{getType(n.type).label}</span>
                  <span>📅 {formatDate(n.createdAt)}</span>
                  <span className="status-pill" style={{ background: n.active ? '#dcfce7' : '#f1f5f9', color: n.active ? '#16a34a' : '#64748b' }}>
                    {n.active ? '✅ Đang hiển thị' : '🚫 Đã ẩn'}
                  </span>
                </div>
                <h3 className="item-title">{n.title}</h3>
                <p className="item-text">{n.content}</p>
              </div>

              <div className="item-actions">
                <button
                  onClick={() => handleToggle(n._id, n.active)}
                  className="action-button action-toggle"
                >
                  {n.active ? '🚫 Ẩn' : '✅ Hiện'}
                </button>
                <button
                  onClick={() => handleEdit(n)}
                  className="action-button action-primary"
                >
                  ✏️ Sửa
                </button>
                <button
                  onClick={() => handleDelete(n._id)}
                  className="action-button action-secondary"
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}