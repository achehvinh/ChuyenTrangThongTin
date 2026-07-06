import { useEffect, useState } from 'react';
import axios from 'axios';
import './ChuyenTrangThongTin.css';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const DANH_MUC_LIST = [
  { value: 'tat-ca',   label: 'Tất cả' },
  { value: 'su-kien',  label: 'Sự kiện' },
  { value: 'the-thao', label: 'Thể thao' },
  { value: 'le-hoi',   label: 'Lễ hội' },
  { value: 'bau-cu',   label: 'Bầu cử' },
  { value: 'khac',     label: 'Khác' },
];

const DM_COLOR = {
  'su-kien':  '#1a56db',
  'the-thao': '#15803d',
  'le-hoi':   '#b45309',
  'bau-cu':   '#b91c1c',
  'khac':     '#64748b',
};

const DM_LABEL = {
  'su-kien': 'Sự kiện', 'the-thao': 'Thể thao',
  'le-hoi': 'Lễ hội', 'bau-cu': 'Bầu cử', 'khac': 'Khác',
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

/* ── Card bài viết trong danh sách ── */
function BaiVietCard({ bv, onClick }) {
  const color = DM_COLOR[bv.danh_muc] || '#64748b';
  return (
    <button className="ct-card" onClick={() => onClick(bv)}>
      {bv.anh_dai_dien
        ? <img className="ct-card-img" src={bv.anh_dai_dien} alt={bv.tieu_de} />
        : <div className="ct-card-img ct-card-img--empty" />}
      <div className="ct-card-body">
        <span className="ct-card-badge" style={{ background: color + '18', color, border: `1px solid ${color}40` }}>
          {DM_LABEL[bv.danh_muc] || bv.danh_muc}
        </span>
        <h3 className="ct-card-title">{bv.tieu_de}</h3>
        {bv.mo_ta && <p className="ct-card-desc">{bv.mo_ta}</p>}
        <div className="ct-card-meta">
          <span>{formatDate(bv.createdAt)}</span>
          <span>{bv.nguoi_dang}</span>
          <span>{bv.luot_xem} lượt xem</span>
        </div>
      </div>
    </button>
  );
}

/* ── Modal đọc bài viết ── */
function BaiVietModal({ id, onClose }) {
  const [bv, setBv]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/bai-viet/${id}`)
      .then(res => setBv(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  const color = bv ? (DM_COLOR[bv.danh_muc] || '#64748b') : '#1a56db';

  return (
    <div className="ct-overlay" onClick={onClose}>
      <div className="ct-modal" onClick={e => e.stopPropagation()}>
        <button className="ct-modal-close" onClick={onClose}>✕</button>

        {loading || !bv ? (
          <div className="ct-modal-loading">
            <div className="ct-skeleton" style={{ height: 200 }} />
            <div className="ct-skeleton" style={{ height: 24, marginTop: 16 }} />
            <div className="ct-skeleton" style={{ height: 16, marginTop: 10 }} />
          </div>
        ) : (
          <>
            {bv.anh_dai_dien && (
              <img className="ct-modal-img" src={bv.anh_dai_dien} alt={bv.tieu_de} />
            )}
            <div className="ct-modal-body">
              <span className="ct-card-badge" style={{ background: color + '18', color, border: `1px solid ${color}40` }}>
                {DM_LABEL[bv.danh_muc]}
              </span>
              <h2 className="ct-modal-title">{bv.tieu_de}</h2>
              <div className="ct-modal-meta">
                <span>{formatDate(bv.createdAt)}</span>
                <span>·</span>
                <span>{bv.nguoi_dang}</span>
                <span>·</span>
                <span>{bv.luot_xem} lượt xem</span>
              </div>
              <div
                className="ct-modal-content"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {bv.noi_dung}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Trang chính ── */
export default function ChuyenTrangThongTin() {
  const [list, setList]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [danhMuc, setDanhMuc] = useState('tat-ca');
  const [page, setPage]       = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const LIMIT = 9;

  useEffect(() => {
    setPage(1);
  }, [danhMuc]);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (danhMuc !== 'tat-ca') params.danh_muc = danhMuc;

    axios.get(`${API}/bai-viet`, { params })
      .then(res => {
        setList(res.data.data || []);
        setTotal(res.data.total || 0);
      })
      .catch(() => {
        setList([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [danhMuc, page]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="ct-page">

      {/* Header */}
      <div className="ct-header">
        <div className="ct-header-inner">
          <div className="ct-header-top">CHUYÊN TRANG THÔNG TIN ĐĂK PXI</div>
          <p className="ct-header-sub">Tin tức · Sự kiện · Thể thao · Lễ hội · Bầu cử</p>
        </div>
      </div>

      <div className="ct-body">

        {/* Bộ lọc danh mục */}
        <div className="ct-filter">
          {DANH_MUC_LIST.map(d => (
            <button
              key={d.value}
              className={`ct-filter-btn ${danhMuc === d.value ? 'is-active' : ''}`}
              onClick={() => setDanhMuc(d.value)}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Kết quả */}
        <div className="ct-results-head">
          <span>{total} bài viết</span>
        </div>

        {loading ? (
          <div className="ct-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="ct-card">
                <div className="ct-skeleton" style={{ height: 180 }} />
                <div className="ct-card-body">
                  <div className="ct-skeleton" style={{ height: 14, width: '40%', marginBottom: 8 }} />
                  <div className="ct-skeleton" style={{ height: 18, marginBottom: 6 }} />
                  <div className="ct-skeleton" style={{ height: 14, width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="ct-empty">
            <div className="ct-empty-icon">📰</div>
            <p>Chưa có bài viết nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="ct-grid">
            {list.map(bv => (
              <BaiVietCard key={bv._id} bv={bv} onClick={b => setSelectedId(b._id)} />
            ))}
          </div>
        )}

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="ct-pagination">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Trước</button>
            <span>Trang {page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Sau →</button>
          </div>
        )}
      </div>

      {/* Modal đọc bài */}
      {selectedId && (
        <BaiVietModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}