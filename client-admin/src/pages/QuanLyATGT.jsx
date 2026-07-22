import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './QuanLyATGT.css';

const API =
  import.meta.env.VITE_API_URL ||
  'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1';

const CLOUDINARY_CLOUD_NAME   = 'hfbyeesv';
const CLOUDINARY_UPLOAD_PRESET = 'baiviet_video_unsigned';

/* ── Danh mục ATGT ── */
const DANH_MUC_ATGT = [
  { value: 'atgt-tin-tuc',         label: '📰 Tin tuyên truyền' },
  { value: 'atgt-phap-luat',       label: '🛡️ Hướng dẫn an toàn' },
  { value: 'atgt-hoc-sinh',        label: '🎒 Học sinh' },
  { value: 'atgt-duong-nong-thon', label: '🛤️ Đường nông thôn' },
  { value: 'atgt-mua-mua',         label: '🌧️ Mùa mưa bão' },
  { value: 'atgt-van-hoa',         label: '🚦 Văn hóa giao thông' },
  { value: 'atgt-van-ban',         label: '⚠️ Khuyến cáo' },
];

const ALL_DM = [{ value: 'tat-ca', label: 'Tất cả danh mục' }, ...DANH_MUC_ATGT];

const EMPTY_FORM = {
  tieu_de: '',
  mo_ta: '',
  noi_dung: '',
  danh_muc: 'atgt-tin-tuc',
  trang_thai: 'da-dang',
  nguoi_dang: '',
};

function getToken() { return localStorage.getItem('admin_token') || ''; }
function authHeader() { return { Authorization: `Bearer ${getToken()}` }; }

function fmtDate(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

const DM_LABEL = Object.fromEntries(DANH_MUC_ATGT.map(d => [d.value, d.label]));
const DM_COLOR = {
  'atgt-tin-tuc':          '#0369a1',
  'atgt-phap-luat':        '#6d28d9',
  'atgt-hoc-sinh':         '#0891b2',
  'atgt-duong-nong-thon':  '#92400e',
  'atgt-mua-mua':          '#1d4ed8',
  'atgt-van-hoa':          '#065f46',
  'atgt-van-ban':          '#be123c',
};

/* ═══════════════════════════════
   FORM THÊM / SỬA BÀI VIẾT ATGT
═══════════════════════════════ */
function FormBaiViet({ editing, onSaved, onCancel }) {
  const fullName = localStorage.getItem('admin_fullname') || 'Cán bộ';
  const [form, setForm]     = useState(editing ? {
    tieu_de:    editing.tieu_de,
    mo_ta:      editing.mo_ta || '',
    noi_dung:   editing.noi_dung,
    danh_muc:   editing.danh_muc,
    trang_thai: editing.trang_thai,
    nguoi_dang: editing.nguoi_dang,
  } : { ...EMPTY_FORM, nguoi_dang: fullName });

  const [anh, setAnh]           = useState(null);
  const [anhPrev, setAnhPrev]   = useState(editing?.anh_dai_dien || '');
  const [anhPhu, setAnhPhu]     = useState([]);
  const [anhPhuPrev, setAnhPhuPrev] = useState(editing?.anh_phu || []);
  const [taiLieu, setTaiLieu]   = useState(editing?.tai_lieu || []);
  const [taiLieuMoi, setTaiLieuMoi] = useState([]);
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState('');
  const fileRef    = useRef();
  const filePhuRef = useRef();
  const filePDFRef = useRef();

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleAnhChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAnh(file);
    setAnhPrev(URL.createObjectURL(file));
  }

  function handleAnhPhuChange(e) {
    const files = Array.from(e.target.files);
    setAnhPhu(prev => [...prev, ...files]);
    setAnhPhuPrev(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  }

  function handlePDFChange(e) {
    const files = Array.from(e.target.files);
    const newItems = files.map(f => ({ file: f, ten: f.name, loai: f.name.split('.').pop().toLowerCase() }));
    setTaiLieuMoi(prev => [...prev, ...newItems]);
  }

  function removeTaiLieuMoi(idx) {
    setTaiLieuMoi(prev => prev.filter((_, i) => i !== idx));
  }

  function removeTaiLieuCu(idx) {
    setTaiLieu(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.tieu_de.trim() || !form.noi_dung.trim()) {
      setMsg('⚠️ Tiêu đề và Nội dung không được trống!');
      return;
    }
    setSaving(true);
    setMsg('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (anh)    fd.append('anh', anh);
      anhPhu.forEach(f => fd.append('anh_phu', f));

      // Upload PDF files
      taiLieuMoi.forEach((item, i) => {
        fd.append('tai_lieu_files', item.file);
        fd.append(`tai_lieu_ten_${i}`, item.ten);
      });

      // Giữ lại tài liệu cũ
      if (taiLieu.length > 0) {
        fd.append('tai_lieu', JSON.stringify(taiLieu));
      }

      const headers = { ...authHeader(), 'Content-Type': 'multipart/form-data' };

      if (editing) {
        await axios.put(`${API}/bai-viet/${editing._id}`, fd, { headers });
        setMsg('✅ Đã cập nhật bài viết thành công!');
      } else {
        await axios.post(`${API}/bai-viet`, fd, { headers });
        setMsg('✅ Đã đăng bài viết thành công!');
      }

      setTimeout(() => onSaved(), 1200);
    } catch (err) {
      setMsg(`❌ Lỗi: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="atgt-form-wrap">
      <div className="atgt-form-header">
        <h2>{editing ? '✏️ Sửa bài viết ATGT' : '➕ Thêm bài viết mới'}</h2>
        <button className="atgt-btn atgt-btn--ghost" onClick={onCancel}>✕ Hủy</button>
      </div>

      <form className="atgt-form" onSubmit={handleSubmit}>

        {/* Tiêu đề */}
        <div className="atgt-fg">
          <label>Tiêu đề bài viết <span className="required">*</span></label>
          <input
            name="tieu_de"
            value={form.tieu_de}
            onChange={handleChange}
            placeholder="Nhập tiêu đề bài tuyên truyền..."
            required
          />
        </div>

        {/* Mô tả ngắn */}
        <div className="atgt-fg">
          <label>Mô tả ngắn (hiển thị trên danh sách)</label>
          <input
            name="mo_ta"
            value={form.mo_ta}
            onChange={handleChange}
            placeholder="Tóm tắt 1-2 câu về bài viết..."
          />
        </div>

        {/* Nội dung */}
        <div className="atgt-fg">
          <label>Nội dung <span className="required">*</span></label>
          <textarea
            name="noi_dung"
            value={form.noi_dung}
            onChange={handleChange}
            rows={10}
            placeholder="Nhập nội dung bài tuyên truyền chi tiết... (hỗ trợ HTML hoặc văn bản thuần)"
            required
          />
        </div>

        {/* Danh mục + Trạng thái */}
        <div className="atgt-fg-row">
          <div className="atgt-fg">
            <label>Danh mục chủ đề</label>
            <select name="danh_muc" value={form.danh_muc} onChange={handleChange}>
              {DANH_MUC_ATGT.map(dm => (
                <option key={dm.value} value={dm.value}>{dm.label}</option>
              ))}
            </select>
          </div>
          <div className="atgt-fg">
            <label>Trạng thái</label>
            <select name="trang_thai" value={form.trang_thai} onChange={handleChange}>
              <option value="da-dang">✅ Đã đăng (công khai)</option>
              <option value="nhap">📝 Lưu nháp</option>
            </select>
          </div>
          <div className="atgt-fg">
            <label>Người đăng</label>
            <input name="nguoi_dang" value={form.nguoi_dang} onChange={handleChange} />
          </div>
        </div>

        {/* Ảnh đại diện */}
        <div className="atgt-fg">
          <label>Ảnh đại diện</label>
          <div className="atgt-upload-row">
            <button type="button" className="atgt-btn atgt-btn--upload" onClick={() => fileRef.current.click()}>
              📷 Chọn ảnh
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAnhChange} />
            {anhPrev && (
              <img src={anhPrev} alt="Preview" className="atgt-img-preview" />
            )}
          </div>
        </div>

        {/* Ảnh phụ */}
        <div className="atgt-fg">
          <label>Ảnh minh họa phụ (tối đa 20 ảnh)</label>
          <button type="button" className="atgt-btn atgt-btn--upload" onClick={() => filePhuRef.current.click()}>
            🖼️ Thêm ảnh phụ
          </button>
          <input ref={filePhuRef} type="file" accept="image/*" multiple hidden onChange={handleAnhPhuChange} />
          {anhPhuPrev.length > 0 && (
            <div className="atgt-img-phu-grid">
              {anhPhuPrev.map((src, i) => (
                <img key={i} src={src} alt={`Phụ ${i+1}`} />
              ))}
            </div>
          )}
        </div>

        {/* File tải về */}
        <div className="atgt-fg">
          <label>📄 File tài liệu đính kèm (PDF, DOCX)</label>
          <button type="button" className="atgt-btn atgt-btn--upload" onClick={() => filePDFRef.current.click()}>
            📎 Tải file lên
          </button>
          <input ref={filePDFRef} type="file" accept=".pdf,.doc,.docx" multiple hidden onChange={handlePDFChange} />

          {/* Tài liệu cũ */}
          {taiLieu.map((f, i) => (
            <div key={i} className="atgt-file-row">
              <span>📄 {f.ten}</span>
              <button type="button" className="atgt-btn-rm" onClick={() => removeTaiLieuCu(i)}>✕</button>
            </div>
          ))}

          {/* Tài liệu mới */}
          {taiLieuMoi.map((item, i) => (
            <div key={i} className="atgt-file-row new">
              <input
                value={item.ten}
                onChange={e => setTaiLieuMoi(prev => prev.map((t, idx) => idx === i ? { ...t, ten: e.target.value } : t))}
                placeholder="Tên hiển thị tài liệu"
              />
              <span className="atgt-file-tag">{item.loai.toUpperCase()}</span>
              <button type="button" className="atgt-btn-rm" onClick={() => removeTaiLieuMoi(i)}>✕</button>
            </div>
          ))}
        </div>

        {/* Thông báo */}
        {msg && <div className={`atgt-msg ${msg.startsWith('✅') ? 'success' : 'error'}`}>{msg}</div>}

        {/* Submit */}
        <div className="atgt-form-footer">
          <button type="button" className="atgt-btn atgt-btn--ghost" onClick={onCancel}>Hủy</button>
          <button type="submit" className="atgt-btn atgt-btn--primary" disabled={saving}>
            {saving ? '⏳ Đang lưu...' : (editing ? '💾 Cập nhật bài' : '🚀 Đăng bài')}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ══════════════════════════════
   COMPONENT CHÍNH
══════════════════════════════ */
export default function QuanLyATGT() {
  const role = localStorage.getItem('admin_role');
  // Phân quyền: chỉ cán bộ, phó phòng, trưởng phòng mới quản lý ATGT
  const canAccess = ['canbo', 'phophong', 'truongphong'].includes(role);
  const canEdit   = ['canbo', 'phophong', 'truongphong'].includes(role);

  // Nếu không có quyền thì hiển thị thông báo
  if (!canAccess) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', gap: 16, color: '#64748b'
      }}>
        <div style={{ fontSize: '3rem' }}>🚫</div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
          Không có quyền truy cập
        </h2>
        <p style={{ margin: 0, fontSize: 14, textAlign: 'center', maxWidth: 360 }}>
          Trang này chỉ dành cho <strong>Cán bộ</strong>, <strong>Phó phòng</strong> và{' '}
          <strong>Trưởng phòng</strong> thuộc Phòng Văn hóa - Xã hội xã Đăk Pxi.
        </p>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('bai-viet');

  /* ── Tab bài viết ── */
  const [list, setList]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterDm, setFilterDm] = useState('tat-ca');
  const [search,  setSearch]  = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage]       = useState(1);
  const LIMIT = 10;

  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [delMsg,   setDelMsg]   = useState('');

  const searchTimer = useRef(null);

  function handleSearchChange(val) {
    setSearchInput(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => { setSearch(val); setPage(1); }, 500);
  }

  async function fetchList() {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, nhom: 'atgt' };
      if (filterDm !== 'tat-ca') params.danh_muc = filterDm;
      if (search.trim()) params.search = search.trim();
      // Admin route lấy tất cả trạng thái
      const res = await axios.get(`${API}/bai-viet/admin/all`, {
        headers: authHeader(),
        params: { ...params, nhom: undefined, search: params.search },
      });
      // Lọc phía client cho danh mục ATGT
      const ATGT = ['atgt-tin-tuc','atgt-phap-luat','atgt-hoc-sinh','atgt-duong-nong-thon','atgt-mua-mua','atgt-van-hoa','atgt-van-ban'];
      let data = (res.data.data || []).filter(b => ATGT.includes(b.danh_muc));
      if (filterDm !== 'tat-ca') data = data.filter(b => b.danh_muc === filterDm);
      if (search.trim()) data = data.filter(b => b.tieu_de.toLowerCase().includes(search.toLowerCase()));
      setList(data);
      setTotal(data.length);
    } catch {
      setList([]); setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchList(); }, [filterDm, search, page]);

  async function handleDelete(id) {
    try {
      await axios.delete(`${API}/bai-viet/${id}`, { headers: authHeader() });
      setDelMsg('✅ Đã xóa bài viết!');
      setDeleting(null);
      fetchList();
      setTimeout(() => setDelMsg(''), 2500);
    } catch (err) {
      setDelMsg(`❌ ${err.response?.data?.message || 'Xóa thất bại!'}`);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const pagedList  = list.slice((page - 1) * LIMIT, page * LIMIT);

  /* ── Tab khẩu hiệu (static demo) ── */
  const [khauHieuList, setKhauHieuList] = useState([
    'Đã uống rượu bia — Không lái xe!',
    'Đội mũ bảo hiểm — Bảo vệ bản thân!',
    'Chấp hành đèn tín hiệu — An toàn giao thông!',
    'Không dùng điện thoại khi lái xe!',
    'Giảm tốc độ — Cứu lấy sinh mạng!',
    'Đường nông thôn nhỏ hẹp — Đi chậm thôi bà con ơi!',
  ]);
  const [newKH, setNewKH] = useState('');

  return (
    <div className="atgt-admin">
      {/* Header */}
      <div className="atgt-admin-header">
        <div>
          <h1>🚦 Quản lý Tuyên truyền ATGT</h1>
          <p>
            {role === 'truongphong' ? '🌟 Trưởng phòng'
             : role === 'phophong'  ? '🌟 Phó phòng'
             : '💼 Cán bộ'} — Phòng Văn hóa - Xã hội xã Đăk Pxi
          </p>
        </div>
        {canEdit && activeTab === 'bai-viet' && !showForm && (
          <button className="atgt-btn atgt-btn--primary" onClick={() => { setEditing(null); setShowForm(true); }}>
            ➕ Thêm bài viết mới
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="atgt-admin-tabs">
        {[
          { key: 'bai-viet',   icon: '📝', label: 'Bài viết ATGT' },
          { key: 'khau-hieu',  icon: '📣', label: 'Khẩu hiệu & Banner' },
          { key: 'huong-dan',  icon: '📋', label: 'Hướng dẫn sử dụng' },
        ].map(t => (
          <button
            key={t.key}
            className={`atgt-admin-tab ${activeTab === t.key ? 'is-active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB BÀI VIẾT ── */}
      {activeTab === 'bai-viet' && (
        <div className="atgt-admin-body">
          {showForm ? (
            <FormBaiViet
              editing={editing}
              onSaved={() => { setShowForm(false); setEditing(null); fetchList(); }}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          ) : (
            <>
              {/* Toolbar */}
              <div className="atgt-admin-toolbar">
                <div className="atgt-admin-filter">
                  <select value={filterDm} onChange={e => { setFilterDm(e.target.value); setPage(1); }}>
                    {ALL_DM.map(dm => <option key={dm.value} value={dm.value}>{dm.label}</option>)}
                  </select>
                </div>
                <div className="atgt-admin-search">
                  <input
                    placeholder="🔍 Tìm kiếm tiêu đề..."
                    value={searchInput}
                    onChange={e => handleSearchChange(e.target.value)}
                  />
                  {searchInput && <button onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}>✕</button>}
                </div>
              </div>

              {delMsg && <div className={`atgt-msg ${delMsg.startsWith('✅') ? 'success' : 'error'}`}>{delMsg}</div>}

              {/* Bảng */}
              <div className="atgt-table-wrap">
                <table className="atgt-table">
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>Ảnh</th>
                      <th>Tiêu đề</th>
                      <th style={{ width: 150 }}>Danh mục</th>
                      <th style={{ width: 110 }}>Trạng thái</th>
                      <th style={{ width: 110 }}>Ngày đăng</th>
                      <th style={{ width: 110 }}>Người đăng</th>
                      {canEdit && <th style={{ width: 120 }}>Thao tác</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: canEdit ? 7 : 6 }).map((_, j) => (
                            <td key={j}><div className="atgt-sk-cell" /></td>
                          ))}
                        </tr>
                      ))
                    ) : pagedList.length === 0 ? (
                      <tr>
                        <td colSpan={canEdit ? 7 : 6} className="atgt-empty-row">
                          Chưa có bài viết nào. Hãy thêm bài viết ATGT đầu tiên!
                        </td>
                      </tr>
                    ) : (
                      pagedList.map(bv => (
                        <tr key={bv._id}>
                          <td>
                            {bv.anh_dai_dien
                              ? <img src={bv.anh_dai_dien} alt="" className="atgt-table-img" />
                              : <div className="atgt-table-img--empty">🚦</div>}
                          </td>
                          <td>
                            <div className="atgt-table-title">{bv.tieu_de}</div>
                            {bv.mo_ta && <div className="atgt-table-desc">{bv.mo_ta}</div>}
                          </td>
                          <td>
                            <span
                              className="atgt-table-badge"
                              style={{ background: DM_COLOR[bv.danh_muc] || '#475569' }}
                            >
                              {DM_LABEL[bv.danh_muc] || bv.danh_muc}
                            </span>
                          </td>
                          <td>
                            <span className={`atgt-status ${bv.trang_thai === 'da-dang' ? 'pub' : 'draft'}`}>
                              {bv.trang_thai === 'da-dang' ? '✅ Đã đăng' : '📝 Nháp'}
                            </span>
                          </td>
                          <td className="atgt-table-date">{fmtDate(bv.createdAt)}</td>
                          <td className="atgt-table-author">{bv.nguoi_dang}</td>
                          {canEdit && (
                            <td>
                              <div className="atgt-table-actions">
                                <button
                                  className="atgt-btn-icon edit"
                                  title="Sửa"
                                  onClick={() => { setEditing(bv); setShowForm(true); }}
                                >✏️</button>
                                <button
                                  className="atgt-btn-icon del"
                                  title="Xóa"
                                  onClick={() => setDeleting(bv)}
                                >🗑️</button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="atgt-admin-pag">
                  <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={page === p ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── TAB KHẨU HIỆU ── */}
      {activeTab === 'khau-hieu' && (
        <div className="atgt-admin-body">
          <div className="atgt-kh-wrap">
            <h3>📣 Danh sách khẩu hiệu tuyên truyền ATGT</h3>
            <p className="atgt-kh-note">
              Các khẩu hiệu này sẽ hiển thị chạy ticker trên trang tuyên truyền ATGT công khai.
            </p>

            {/* Thêm khẩu hiệu */}
            {canEdit && (
              <div className="atgt-kh-add">
                <input
                  value={newKH}
                  onChange={e => setNewKH(e.target.value)}
                  placeholder='Nhập khẩu hiệu mới... (VD: "Giảm tốc độ — Cứu lấy sinh mạng!")'
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newKH.trim()) {
                      setKhauHieuList(prev => [...prev, newKH.trim()]);
                      setNewKH('');
                    }
                  }}
                />
                <button
                  className="atgt-btn atgt-btn--primary"
                  onClick={() => {
                    if (newKH.trim()) {
                      setKhauHieuList(prev => [...prev, newKH.trim()]);
                      setNewKH('');
                    }
                  }}
                >
                  ➕ Thêm
                </button>
              </div>
            )}

            <ul className="atgt-kh-list">
              {khauHieuList.map((kh, i) => (
                <li key={i}>
                  <span className="atgt-kh-num">{i + 1}</span>
                  <span className="atgt-kh-text">🚦 {kh}</span>
                  {canEdit && (
                    <button className="atgt-btn-rm" onClick={() => setKhauHieuList(prev => prev.filter((_, idx) => idx !== i))}>✕</button>
                  )}
                </li>
              ))}
            </ul>

            {canEdit && (
              <div className="atgt-kh-footer">
                <button className="atgt-btn atgt-btn--primary" onClick={() => alert('✅ Đã lưu danh sách khẩu hiệu!')}>
                  💾 Lưu danh sách
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB HƯỚNG DẪN ── */}
      {activeTab === 'huong-dan' && (
        <div className="atgt-admin-body">
          <div className="atgt-guide-wrap">
            <h3>📋 Hướng dẫn sử dụng trang ATGT</h3>
            <div className="atgt-guide-cards">
              {[
                { icon: '📝', title: 'Thêm bài viết', desc: 'Vào tab "Bài viết ATGT" → Nhấn nút "Thêm bài viết mới" → Điền tiêu đề, nội dung, chọn danh mục chủ đề phù hợp và đăng.' },
                { icon: '⚖️', title: 'Danh mục chủ đề', desc: 'Có 7 danh mục: Tin tức · Pháp luật · Học sinh · Đường nông thôn · Mùa mưa · Văn hóa GT · Văn bản. Chọn đúng để người dân dễ tìm kiếm.' },
                { icon: '📄', title: 'Đính kèm tài liệu PDF', desc: 'Khi tạo/sửa bài viết, có thể upload file PDF hoặc DOCX để người dân tải về. Tài liệu sẽ hiển thị trong phần chi tiết bài.' },
                { icon: '🔗', title: 'Chia sẻ bài viết', desc: 'Mỗi bài viết có nút chia sẻ giúp người dân copy link hoặc chia sẻ lên mạng xã hội nhanh chóng.' },
                { icon: '📣', title: 'Khẩu hiệu tuyên truyền', desc: 'Quản lý danh sách khẩu hiệu chạy ticker trên đầu trang. Có thể thêm, xóa khẩu hiệu theo mùa vụ hoặc chiến dịch.' },
                { icon: '🔐', title: 'Phân quyền', desc: 'Cán bộ và Phó phòng đều có thể thêm, sửa, xóa bài viết ATGT. Trưởng phòng có quyền xem tổng quan toàn bộ nội dung.' },
              ].map((g, i) => (
                <div key={i} className="atgt-guide-card">
                  <span className="atgt-guide-icon">{g.icon}</span>
                  <h4>{g.title}</h4>
                  <p>{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL XÁC NHẬN XÓA ── */}
      {deleting && (
        <div className="atgt-confirm-overlay" onClick={() => setDeleting(null)}>
          <div className="atgt-confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="atgt-confirm-icon">⚠️</div>
            <h3>Xác nhận xóa bài viết?</h3>
            <p>Bài: <strong>{deleting.tieu_de}</strong></p>
            <p className="atgt-confirm-warn">Hành động này không thể hoàn tác!</p>
            <div className="atgt-confirm-actions">
              <button className="atgt-btn atgt-btn--ghost" onClick={() => setDeleting(null)}>Hủy</button>
              <button className="atgt-btn atgt-btn--danger" onClick={() => handleDelete(deleting._id)}>🗑️ Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
