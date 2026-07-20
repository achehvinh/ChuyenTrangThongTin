import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './BaiVietDetailPage.css';

const API = import.meta.env.VITE_API_BASE_URL || 'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1';

const DM_COLOR = {
  'bau-cu': '#c8102e',
  'su-kien': '#003087',
  'the-thao': '#15803d',
  'le-hoi': '#b45309',
  'tin-tuc': '#0369a1',
  'thong-bao': '#6d28d9',
  'khac': '#475569',
};

const DM_LABEL = {
  'bau-cu': 'Bầu cử',
  'su-kien': 'Sự kiện',
  'the-thao': 'Thể thao',
  'le-hoi': 'Lễ hội',
  'tin-tuc': 'Tin tức',
  'thong-bao': 'Thông báo',
  'khac': 'Khác',
};

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

function fmtDateShort(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/* ── Ticker chạy chữ ── */
function NewsTicker({ items }) {
  return (
    <div className="bvd-ticker">
      <span className="bvd-ticker-label">TIN MỚI</span>
      <div className="bvd-ticker-track">
        <div className="bvd-ticker-inner">
          {/* Nhân đôi để chạy vô tận */}
          {[...items, ...items].map((item, i) => (
            <span key={i} className="bvd-ticker-item">
              {item}
              <span className="bvd-ticker-sep" aria-hidden="true">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── SVG icon nhỏ dùng chung ── */
function Ico({ d, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* ── Card bài liên quan ── */
function RelatedCard({ bv, onClick }) {
  const color = DM_COLOR[bv.danh_muc] || '#003087';
  return (
    <button className="bvd-rel-card" onClick={() => onClick(bv._id)}>
      {bv.anh_dai_dien
        ? <img src={bv.anh_dai_dien} alt="" className="bvd-rel-img" />
        : <div className="bvd-rel-img bvd-rel-img--empty" />}
      <div className="bvd-rel-body">
        <span className="bvd-rel-badge" style={{ background: color }}>
          {DM_LABEL[bv.danh_muc] || bv.danh_muc}
        </span>
        <p className="bvd-rel-title">{bv.tieu_de}</p>
        <span className="bvd-rel-date">{fmtDateShort(bv.createdAt)}</span>
      </div>
    </button>
  );
}

/* ════════════════════════════════════
   TRANG CHI TIẾT BÀI VIẾT
   Route: /bai-viet/:id
════════════════════════════════════ */
export default function BaiVietDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bv, setBv] = useState(null);
  const [related, setRelated] = useState([]);
  const [ticker, setTicker] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const topRef = useRef(null);

  /* Load bài chính + bài liên quan */
  useEffect(() => {
    setLoading(true);
    setError('');
    setBv(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    axios.get(`${API}/bai-viet/${id}`)
      .then(r => {
        const data = r.data.data;
        setBv(data);
        return axios.get(`${API}/bai-viet`, {
          params: { danh_muc: data.danh_muc, limit: 6, page: 1 },
        });
      })
      .then(r => {
        setRelated((r.data.data || []).filter(b => b._id !== id).slice(0, 4));
      })
      .catch(() => setError('Không tải được bài viết. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, [id]);

  /* Load ticker — 6 bài mới nhất */
  useEffect(() => {
    axios.get(`${API}/bai-viet`, { params: { limit: 6, page: 1 } })
      .then(r => setTicker((r.data.data || []).map(b => b.tieu_de)))
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (lightboxIdx === null || !bv?.anh_phu) return;
    function onKey(e) {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') setLightboxIdx(i => (i + 1) % bv.anh_phu.length);
      if (e.key === 'ArrowLeft') setLightboxIdx(i => (i - 1 + bv.anh_phu.length) % bv.anh_phu.length);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, bv]);

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  const color = bv ? (DM_COLOR[bv.danh_muc] || '#003087') : '#003087';
  const readTime = bv
    ? Math.max(1, Math.ceil((bv.noi_dung || '').split(/\s+/).length / 200))
    : 0;

  /* Tách nội dung thành đoạn theo dòng trống */
  const paragraphs = bv
    ? (bv.noi_dung || '').split(/\n\n+/).filter(p => p.trim())
    : [];

  return (
    <div className="bvd-page" ref={topRef}>

      {/* ══ BREADCRUMB ══ */}
      <nav className="bvd-breadcrumb" aria-label="Điều hướng">
        <div className="bvd-breadcrumb-inner">
          <Link to="/">Trang chủ</Link>
          <span aria-hidden="true">›</span>
          <Link to="/chuyen-trang">Chuyên trang</Link>
          {bv && (
            <>
              <span aria-hidden="true">›</span>
              <span style={{ color }}>{DM_LABEL[bv.danh_muc]}</span>
              <span aria-hidden="true">›</span>
              <span className="bvd-bc-current" aria-current="page">
                {bv.tieu_de.length > 55
                  ? bv.tieu_de.slice(0, 55) + '…'
                  : bv.tieu_de}
              </span>
            </>
          )}
        </div>
      </nav>

      {/* ══ BODY ══ */}
      <div className="bvd-body">

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="bvd-layout">
            <div className="bvd-main">
              <div className="bvd-sk" style={{ height: 260, marginBottom: 20 }} />
              <div className="bvd-sk" style={{ height: 28, width: '72%', marginBottom: 12 }} />
              <div className="bvd-sk" style={{ height: 16, width: '44%', marginBottom: 28 }} />
              {[100, 80, 100, 90, 70].map((w, i) => (
                <div key={i} className="bvd-sk"
                  style={{ height: 15, width: `${w}%`, marginBottom: 10 }} />
              ))}
            </div>
            <aside className="bvd-sidebar">
              {[120, 200, 100].map((h, i) => (
                <div key={i} className="bvd-sk"
                  style={{ height: h, marginBottom: 12 }} />
              ))}
            </aside>
          </div>
        )}

        {/* ── Lỗi ── */}
        {!loading && error && (
          <div className="bvd-error-box">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
              stroke="#c8102e" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>{error}</p>
            <button onClick={() => navigate('/chuyen-trang')}>
              ← Quay lại chuyên trang
            </button>
          </div>
        )}

        {/* ── Nội dung bài ── */}
        {!loading && !error && bv && (
          <div className="bvd-layout">

            {/* ═ BÀI CHÍNH ═ */}
            <article className="bvd-main">

              {/* Đầu bài */}
              <div className="bvd-art-head">
                <span className="bvd-cat-tag" style={{ background: color }}>
                  {DM_LABEL[bv.danh_muc] || bv.danh_muc}
                </span>
                <h1 className="bvd-title">{bv.tieu_de}</h1>
                {bv.mo_ta && <p className="bvd-lead">{bv.mo_ta}</p>}
              </div>

              {/* Meta bar */}
              <div className="bvd-meta-bar">
                <div className="bvd-meta-left">
                  <span className="bvd-meta-item">
                    <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                    {bv.nguoi_dang}
                  </span>
                  <span className="bvd-meta-sep">·</span>
                  <span className="bvd-meta-item">
                    <Ico d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                    {fmtDate(bv.createdAt)}
                  </span>
                  <span className="bvd-meta-sep">·</span>
                  <span className="bvd-meta-item">
                    <Ico d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2" />
                    {readTime} phút đọc
                  </span>
                </div>
                <span className="bvd-meta-views">
                  <Ico d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                  {bv.luot_xem.toLocaleString('vi-VN')} lượt xem
                </span>
              </div>

              {/* Đường kẻ màu theo danh mục */}
              <div className="bvd-rule" style={{ background: color }} />

              {/* Video */}
              {bv.video && (
                <div className="bvd-video-wrap">
                  <video src={bv.video} controls className="bvd-video" />
                </div>
              )}

              {/* Phần Ảnh & Chữ: Tất cả ảnh to rộng bằng nhau - Bên ảnh bên chữ */}
              {(() => {
                const allImages = [
                  ...(bv.anh_dai_dien ? [bv.anh_dai_dien] : []),
                  ...(Array.isArray(bv.anh_phu) ? bv.anh_phu.filter(url => url !== bv.anh_dai_dien) : [])
                ];

                return (
                  <div className={`bvd-media-text-flex ${allImages.length > 0 ? 'has-images' : ''}`}>
                    {/* Cột bên ảnh (Ảnh to rộng bằng nhau) */}
                    {allImages.length > 0 && (
                      <div className="bvd-media-block">
                        <div className={`bvd-gallery count-${Math.min(allImages.length, 4)}`}>
                          {allImages.map((url, i) => (
                            <button key={i} className="bvd-gallery-item" onClick={() => setLightboxIdx(i)}>
                              <img src={url} alt={`${bv.tieu_de} - ảnh ${i + 1}`} />
                            </button>
                          ))}
                        </div>
                        <figcaption className="bvd-caption">
                          📷 <i>Ảnh minh họa — Nguồn: {bv.nguoi_dang || 'UBND xã Đăk Pxi'}</i>
                        </figcaption>
                      </div>
                    )}

                    {/* Cột bên chữ */}
                    <div className="bvd-content">
                      {paragraphs.map((para, i) => (
                        <p key={i}>{para.trim()}</p>
                      ))}
                    </div>

                    {/* Lightbox xem ảnh toàn màn hình */}
                    {lightboxIdx !== null && allImages.length > 0 && (
                      <div className="bvd-lightbox" onClick={() => setLightboxIdx(null)}>
                        <button className="bvd-lightbox-close" onClick={() => setLightboxIdx(null)}>✕</button>
                        <button className="bvd-lightbox-nav bvd-lightbox-prev"
                          onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i - 1 + allImages.length) % allImages.length); }}>
                          ‹
                        </button>
                        <img src={allImages[lightboxIdx]} alt="" className="bvd-lightbox-img" onClick={e => e.stopPropagation()} />
                        <button className="bvd-lightbox-nav bvd-lightbox-next"
                          onClick={e => { e.stopPropagation(); setLightboxIdx(i => (i + 1) % allImages.length); }}>
                          ›
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Chia sẻ */}
              <div className="bvd-share">
                <span className="bvd-share-label">Chia sẻ bài viết:</span>
                <div className="bvd-share-btns">
                  <a
                    className="bvd-share-fb"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
                      aria-hidden="true">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                    Facebook
                  </a>
                  <button className="bvd-share-copy" onClick={copyLink}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    {copied ? '✓ Đã sao chép!' : 'Sao chép link'}
                  </button>
                </div>
              </div>

              {/* Thẻ tag */}
              <div className="bvd-tags">
                <span className="bvd-tag" style={{ borderColor: color, color }}>
                  #{DM_LABEL[bv.danh_muc]}
                </span>
                <span className="bvd-tag">#ĐăkPxi</span>
                <span className="bvd-tag">#UBND</span>
                <span className="bvd-tag">#KonTum</span>
              </div>

              {/* Nút quay lại */}
              <div className="bvd-back-row">
                <Link to="/chuyen-trang" className="bvd-back-btn">
                  ← Quay lại chuyên trang
                </Link>
              </div>
            </article>

            {/* ═ SIDEBAR ═ */}
            <aside className="bvd-sidebar">

              {/* Thông tin bài viết — LUÔN hiển thị, tránh sidebar bị trống
                  gây lệch layout khi bài viết không có bài liên quan */}
              <div className="bvd-sbox">
                <div className="bvd-sbox-head" style={{ borderLeftColor: color }}>
                  THÔNG TIN BÀI VIẾT
                </div>
                <ul className="bvd-info-list">
                  <li>
                    <span>Danh mục</span>
                    <strong style={{ color }}>
                      {DM_LABEL[bv.danh_muc] || bv.danh_muc}
                    </strong>
                  </li>
                  <li>
                    <span>Người đăng</span>
                    <strong>{bv.nguoi_dang}</strong>
                  </li>
                  <li>
                    <span>Ngày đăng</span>
                    <strong>{fmtDateShort(bv.createdAt)}</strong>
                  </li>
                  <li>
                    <span>Thời gian đọc</span>
                    <strong>{readTime} phút</strong>
                  </li>
                  <li>
                    <span>Lượt xem</span>
                    <strong>{bv.luot_xem.toLocaleString('vi-VN')}</strong>
                  </li>
                </ul>
              </div>

              {/* Bài viết liên quan */}
              {related.length > 0 && (
                <div className="bvd-sbox">
                  <div className="bvd-sbox-head" style={{ borderLeftColor: color }}>
                    BÀI VIẾT LIÊN QUAN
                  </div>
                  <div className="bvd-rel-list">
                    {related.map(r => (
                      <RelatedCard
                        key={r._id}
                        bv={r}
                        onClick={newId => navigate(`/bai-viet/${newId}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

            </aside>
          </div>
        )}
      </div>

      {/* ══ FOOTER ══ */}
      <footer className="bvd-footer">
        <div className="bvd-footer-inner">
          <span>© 2026 PHÒNG VĂN HÓA XÃ HỘI, XÃ ĐĂK PXI — Chuyên trang thông tin điện tử</span>
          <Link to="/chuyen-trang" className="bvd-footer-link">
            Xem tất cả bài viết →
          </Link>
        </div>
      </footer>

    </div>
  );
}