import { useState, useEffect } from "react";
import api from "../services/api";

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
    <div style={{ padding: '30px', maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            📢 Quản lý thông báo
          </h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>
            Tổng: {notices.length} thông báo · Đang hiển thị: {notices.filter(n => n.active).length}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          style={{
            padding: '12px 24px', background: '#005bac', color: 'white',
            border: 'none', borderRadius: '10px', fontWeight: '700',
            fontSize: '15px', cursor: 'pointer',
          }}
        >
          {showForm ? '✕ Đóng' : '+ Thêm thông báo'}
        </button>
      </div>

      {/* Form thêm/sửa */}
      {showForm && (
        <div style={{
          background: 'white', borderRadius: '16px', padding: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '28px',
          borderLeft: '5px solid #005bac',
        }}>
          <h2 style={{ margin: '0 0 20px', color: '#005bac', fontSize: '18px' }}>
            {editItem ? '✏️ Chỉnh sửa thông báo' : '➕ Thêm thông báo mới'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>
                Tiêu đề *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Nhập tiêu đề thông báo..."
                style={{
                  width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0',
                  borderRadius: '8px', fontSize: '15px', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>
                  Loại thông báo
                </label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0',
                    borderRadius: '8px', fontSize: '15px', outline: 'none',
                  }}
                >
                  {TYPE_OPTIONS.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>
                  Hiển thị
                </label>
                <select
                  value={form.active}
                  onChange={e => setForm({ ...form, active: e.target.value === 'true' })}
                  style={{
                    width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0',
                    borderRadius: '8px', fontSize: '15px', outline: 'none',
                  }}
                >
                  <option value="true">✅ Hiển thị</option>
                  <option value="false">🚫 Ẩn</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '6px', fontSize: '14px' }}>
                Nội dung *
              </label>
              <textarea
                rows={5}
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="Nhập nội dung thông báo..."
                style={{
                  width: '100%', padding: '10px 14px', border: '2px solid #e2e8f0',
                  borderRadius: '8px', fontSize: '15px', outline: 'none',
                  resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />
            </div>

            {error && (
              <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                ⚠️ {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 28px', background: '#005bac', color: 'white',
                  border: 'none', borderRadius: '8px', fontWeight: '700',
                  fontSize: '15px', cursor: 'pointer', opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? '⏳ Đang lưu...' : editItem ? '💾 Cập nhật' : '📢 Đăng thông báo'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: '12px 28px', background: '#f1f5f9', color: '#64748b',
                  border: 'none', borderRadius: '8px', fontWeight: '600',
                  fontSize: '15px', cursor: 'pointer',
                }}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bộ lọc + Tìm kiếm */}
      <div style={{
        background: 'white', borderRadius: '12px', padding: '16px 20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)', marginBottom: '20px',
        display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm thông báo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: '200px', padding: '10px 14px',
            border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          {[{ value: 'all', label: 'Tất cả' }, ...TYPE_OPTIONS].map(t => (
            <button
              key={t.value}
              onClick={() => setFilterType(t.value)}
              style={{
                padding: '8px 16px', border: '2px solid #e2e8f0',
                borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                cursor: 'pointer',
                background: filterType === t.value ? '#005bac' : 'white',
                color: filterType === t.value ? 'white' : '#64748b',
                borderColor: filterType === t.value ? '#005bac' : '#e2e8f0',
              }}
            >
              {t.label || 'Tất cả'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {fetching && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          ⏳ Đang tải dữ liệu...
        </div>
      )}

      {/* Lỗi kết nối */}
      {error && !showForm && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '16px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
          ⚠️ {error} <button onClick={fetchData} style={{ marginLeft: '10px', padding: '6px 14px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Thử lại</button>
        </div>
      )}

      {/* Danh sách */}
      {!fetching && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', background: 'white', borderRadius: '12px' }}>
              Không có thông báo nào
            </div>
          ) : filtered.map(n => (
            <div
              key={n._id}
              style={{
                background: 'white', borderRadius: '14px', padding: '20px 24px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                borderLeft: `5px solid ${getType(n.type).color}`,
                opacity: n.active ? 1 : 0.6,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                      background: getType(n.type).color + '20', color: getType(n.type).color,
                    }}>
                      {getType(n.type).label}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>📅 {formatDate(n.createdAt)}</span>
                    <span style={{
                      padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                      background: n.active ? '#dcfce7' : '#f1f5f9',
                      color: n.active ? '#16a34a' : '#94a3b8',
                    }}>
                      {n.active ? '✅ Đang hiển thị' : '🚫 Đã ẩn'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>
                    {n.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                    {n.content}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleToggle(n._id, n.active)}
                    style={{
                      padding: '7px 14px', border: 'none', borderRadius: '8px',
                      fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                      background: n.active ? '#fef3c7' : '#dcfce7',
                      color: n.active ? '#d97706' : '#16a34a',
                    }}
                  >
                    {n.active ? '🚫 Ẩn' : '✅ Hiện'}
                  </button>
                  <button
                    onClick={() => handleEdit(n)}
                    style={{
                      padding: '7px 14px', border: 'none', borderRadius: '8px',
                      fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                      background: '#e8f0fe', color: '#005bac',
                    }}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(n._id)}
                    style={{
                      padding: '7px 14px', border: 'none', borderRadius: '8px',
                      fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                      background: '#fef2f2', color: '#dc2626',
                    }}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}