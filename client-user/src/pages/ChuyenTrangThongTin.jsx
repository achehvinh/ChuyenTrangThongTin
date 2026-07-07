import { useEffect, useState } from 'react';
import axios from 'axios';
import './ChuyenTrangThongTin.css';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const DANH_MUC_LIST = [
  { value: 'tat-ca',   label: 'Tất cả' },
  { value: 'bau-cu',   label: 'Bầu cử' },
  { value: 'su-kien',  label: 'Sự kiện' },
  { value: 'the-thao', label: 'Thể thao' },
  { value: 'le-hoi',   label: 'Lễ hội' },
  { value: 'tin-tuc',  label: 'Tin tức' },
];

const DM_COLOR = {
  'bau-cu':   '#c8102e',
  'su-kien':  '#003087',
  'the-thao': '#15803d',
  'le-hoi':   '#b45309',
  'tin-tuc':  '#0369a1',
  'thong-bao':'#6d28d9',
  'khac':     '#475569',
};

const DM_LABEL = {
  'bau-cu':   'Bầu cử',
  'su-kien':  'Sự kiện',
  'the-thao': 'Thể thao',
  'le-hoi':   'Lễ hội',
  'tin-tuc':  'Tin tức',
  'thong-bao':'Thông báo',
  'khac':     'Khác',
};

function fmtDate(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

function fmtViews(n) {
  if (n >= 1000) return `${(n/1000).toFixed(1)}K`;
  return String(n);
}

/* ── Badge danh mục ── */
function Badge({ value, small }) {
  const color = DM_COLOR[value] || '#475569';
  return (
    <span
      className={`ct-badge ${small ? 'ct-badge--sm' : ''}`}
      style={{ background: color }}
    >
      {DM_LABEL[value] || value}
    </span>
  );
}

/* ── Card bài nổi bật lớn (trái) ── */
function HeroCardBig({ bv, onClick }) {
  return (
    <button className="ct-hero-big" onClick={() => onClick(bv)}>
      {bv.anh_dai_dien
        ? <img src={bv.anh_dai_dien} alt={bv.tieu_de} className="ct-hero-big-img" />
        : <div className="ct-hero-big-img ct-hero-big-img--empty" />}
      <div className="ct-hero-big-overlay">
        <Badge value={bv.danh_muc} />
        <h2 className="ct-hero-big-title">{bv.tieu_de}</h2>
        <div className="ct-hero-big-meta">
          <span>{fmtDate(bv.createdAt)}</span>
          <span>· {fmtViews(bv.luot_xem)} lượt xem</span>
        </div>
      </div>
    </button>
  );
}

/* ── Card bài nổi bật nhỏ (phải) ── */
function HeroCardSmall({ bv, onClick }) {
  return (
    <button className="ct-hero-small" onClick={() => onClick(bv)}>
      {bv.anh_dai_dien
        ? <img src={bv.anh_dai_dien} alt={bv.tieu_de} className="ct-hero-small-img" />
        : <div className="ct-hero-small-img ct-hero-small-img--empty" />}
      <div className="ct-hero-small-overlay">
        <Badge value={bv.danh_muc} small />
        <p className="ct-hero-small-title">{bv.tieu_de}</p>
        <span className="ct-hero-small-date">{fmtDate(bv.createdAt)}</span>
      </div>
    </button>
  );
}

/* ── Card bài thường (grid 3 cột) ── */
function NormalCard({ bv, onClick }) {
  const color = DM_COLOR[bv.danh_muc] || '#475569';
  return (
    <button
      className="ct-normal-card"
      style={{ '--dm-color': color }}
      onClick={() => onClick(bv)}
    >
      <div className="ct-normal-card-top">
        {bv.anh_dai_dien
          ? <img src={bv.anh_dai_dien} alt={bv.tieu_de} className="ct-normal-card-img" />
          : <div className="ct-normal-card-img ct-normal-card-img--empty" />}
      </div>
      <div className="ct-normal-card-body">
        <h3 className="ct-normal-card-title">{bv.tieu_de}</h3>
        {bv.mo_ta && <p className="ct-normal-card-desc">{bv.mo_ta}</p>}
        <div className="ct-normal-card-meta">
          <span>{fmtDate(bv.createdAt)}</span>
          <span className="ct-normal-card-views">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            {fmtViews(bv.luot_xem)}
          </span>
        </div>
      </div>
    </button>
  );
}

/* ── Modal đọc bài ── */
function BaiVietModal({ id, onClose }) {
  const [bv, setBv]         = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/bai-viet/${id}`)
      .then(r => setBv(r.data.data))
      .catch(() => setBv(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <div className="ct-overlay" onClick={onClose}>
      <div className="ct-modal" onClick={e => e.stopPropagation()}>
        <button className="ct-modal-close" onClick={onClose}>✕</button>

        {loading ? (
          <div className="ct-modal-loading">
            <div className="ct-sk" style={{ height: 260 }} />
            <div style={{ padding: '20px 24px' }}>
              <div className="ct-sk" style={{ height: 22, width: '60%', marginBottom: 12 }} />
              <div className="ct-sk" style={{ height: 16, marginBottom: 8 }} />
              <div className="ct-sk" style={{ height: 16, width: '80%' }} />
            </div>
          </div>
        ) : !bv ? (
          <div className="ct-modal-err">Không tải được bài viết.</div>
        ) : (
          <>
            {bv.anh_dai_dien && (
              <img className="ct-modal-img" src={bv.anh_dai_dien} alt={bv.tieu_de} />
            )}
            <div className="ct-modal-body">
              <div className="ct-modal-top">
                <Badge value={bv.danh_muc} />
              </div>
              <h2 className="ct-modal-title">{bv.tieu_de}</h2>
              <div className="ct-modal-meta">
                <span>{fmtDate(bv.createdAt)}</span>
                <span>·</span>
                <span>{bv.nguoi_dang}</span>
                <span>·</span>
                <span>{bv.luot_xem.toLocaleString('vi-VN')} lượt xem</span>
              </div>
              {bv.mo_ta && <p className="ct-modal-summary">{bv.mo_ta}</p>}
              <div className="ct-modal-content" style={{ whiteSpace: 'pre-wrap' }}>
                {bv.noi_dung}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════
   TRANG CHÍNH
════════════════════════════════════ */
export default function ChuyenTrangThongTin() {
  const [featured, setFeatured] = useState([]); // 3 bài nổi bật
  const [list, setList]         = useState([]);
  const [total, setTotal]       = useState(0);
  const [stats, setStats]       = useState({ bai: 0, luotXem: 0, danhMuc: 0 });
  const [danhMuc, setDanhMuc]   = useState('tat-ca');
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(true);
  const LIMIT = 9;

  /* Load bài nổi bật + stats 1 lần khi mount */
  useEffect(() => {
    axios.get(`${API}/bai-viet`, { params: { limit: 3, page: 1 } })
      .then(r => {
        setFeatured(r.data.data || []);
        const t = r.data.total || 0;
        const allViews = (r.data.data || []).reduce((s, b) => s + (b.luot_xem || 0), 0);
        setStats({ bai: t, luotXem: allViews, danhMuc: 7 });
      })
      .catch(() => {});
  }, []);

  /* Load danh sách theo filter */
  useEffect(() => { setPage(1); }, [danhMuc]);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (danhMuc !== 'tat-ca') params.danh_muc = danhMuc;

    axios.get(`${API}/bai-viet`, { params })
      .then(r => { setList(r.data.data || []); setTotal(r.data.total || 0); })
      .catch(() => { setList([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [danhMuc, page]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <div className="ct-page">

      {/* ── FILTER TAB ── */}
      <div className="ct-filter-bar">
        <div className="ct-filter-inner">
          {DANH_MUC_LIST.map(d => (
            <button
              key={d.value}
              className={`ct-filter-tab ${danhMuc === d.value ? 'is-active' : ''}`}
              style={danhMuc === d.value && d.value !== 'tat-ca'
                ? { background: DM_COLOR[d.value], borderColor: DM_COLOR[d.value] }
                : {}}
              onClick={() => setDanhMuc(d.value)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="ct-body">

        {/* ── NỔI BẬT ── */}
        {featured.length > 0 && (
          <section className="ct-featured">
            <div className="ct-section-label">Nổi bật</div>
            <div className="ct-featured-grid">
              {featured[0] && (
                <HeroCardBig bv={featured[0]} onClick={b =>window.open(`/tin-tuc/${b._id}`, '_blank')} />
              )}
              <div className="ct-featured-right">
                {featured.slice(1, 3).map(bv => (
                  <HeroCardSmall key={bv._id} bv={bv} onClick={b => window.open(`/tin-tuc/${b._id}`, '_blank')} />
                ))}
              </div>
            </div>
            <a className="ct-see-all" href="#all">Xem tất cả →</a>
          </section>
        )}

        {/* ── DIVIDER ── */}
        <div className="ct-divider" id="all">
          <span>TẤT CẢ BÀI VIẾT</span>
        </div>

        {/* ── GRID BÀI THƯỜNG ── */}
        {loading ? (
          <div className="ct-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="ct-normal-card ct-normal-card--sk">
                <div className="ct-sk" style={{ height: 160 }} />
                <div className="ct-normal-card-body">
                  <div className="ct-sk" style={{ height: 16, marginBottom: 8 }} />
                  <div className="ct-sk" style={{ height: 13, width: '70%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="ct-empty">
            <p>Chưa có bài viết nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="ct-grid">
            {list.map(bv => (
              <NormalCard key={bv._id} bv={bv} onClick={b => window.open(`/tin-tuc/${b._id}`, '_blank')} />
            ))}
          </div>
        )}

        {/* ── PHÂN TRANG ── */}
        {totalPages > 1 && (
          <div className="ct-pagination">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              ‹ Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...'
                  ? <span key={`e${i}`} className="ct-pagination-ellipsis">…</span>
                  : <button
                      key={p}
                      className={page === p ? 'is-active' : ''}
                      onClick={() => setPage(p)}
                    >{p}</button>
              )}
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              Sau ›
            </button>
          </div>
        )}
      </div>

      {/* ── STATS BAR ── */}
      <div className="ct-stats-bar">
        <div className="ct-stats-inner">
          <div className="ct-stat">
            <strong>{stats.bai}</strong>
            <span>Bài viết đã đăng</span>
          </div>
          <div className="ct-stat-divider" />
          <div className="ct-stat">
            <strong>{stats.luotXem >= 1000
              ? `${(stats.luotXem/1000).toFixed(1)}K`
              : stats.luotXem}
            </strong>
            <span>Lượt xem</span>
          </div>
          <div className="ct-stat-divider" />
          <div className="ct-stat">
            <strong>{stats.danhMuc}</strong>
            <span>Chuyên mục</span>
          </div>
          <div className="ct-stat-divider" />
          <div className="ct-stat">
            <strong>2026</strong>
            <span>Năm hoạt động</span>
          </div>
        </div>
      </div>

    </div>
  );
}