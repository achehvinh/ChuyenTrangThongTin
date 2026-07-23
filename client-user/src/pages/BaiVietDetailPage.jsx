import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './BaiVietDetailPage.css';

const API = import.meta.env.VITE_API_BASE_URL || 'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1';

const DM_COLOR = {
  'phong-chong-lua-dao': '#c62828',
  'an-toan-giao-thong': '#003d7a',
  'thien-tai': '#0284c7',
  'bau-cu': '#c8102e',
  'huong-dan-vneid': '#1e3a8a',
  'te-nan': '#991b1b',
  'chay-rung': '#c2410c',
  'duoi-nuoc': '#0369a1',
  'thu-tuc-hanh-chinh': '#0d9488',
  'tra-cuu': '#15803d',
  'su-kien': '#003087',
  'the-thao': '#15803d',
  'le-hoi': '#b45309',
  'tin-tuc': '#0369a1',
  'thong-bao': '#6d28d9',
  'khac': '#475569',
};

const DM_LABEL = {
  'phong-chong-lua-dao': '🛡️ Phòng, chống Lừa đảo Mạng',
  'an-toan-giao-thong': '🚦 An toàn Giao thông',
  'thien-tai': '🌧️ Phòng chống Thiên tai',
  'bau-cu': '🗳️ Bầu cử',
  'huong-dan-vneid': '🆔 Hướng dẫn VNeID',
  'te-nan': '🛡️ Phòng chống Tệ nạn',
  'chay-rung': '🔥 Phòng chống Cháy rừng',
  'duoi-nuoc': '🏊 Phòng chống Đuối nước',
  'thu-tuc-hanh-chinh': '📑 Thủ tục Hành chính',
  'tra-cuu': '🏥 Tra cứu BHYT & BHXH',
  'su-kien': 'Sự kiện',
  'the-thao': 'Thể thao',
  'le-hoi': 'Lễ hội',
  'tin-tuc': 'Tin tức',
  'thong-bao': 'Thông báo',
  'khac': 'Khác',
  'atgt-tin-tuc': 'ATGT — Tin tuyên truyền',
  'atgt-phap-luat': 'ATGT — Hướng dẫn an toàn',
  'atgt-hoc-sinh': 'ATGT — Học sinh',
  'atgt-duong-nong-thon': 'ATGT — Đường nông thôn',
  'atgt-mua-mua': 'ATGT — Mùa mưa bão',
  'atgt-van-hoa': 'ATGT — Văn hóa giao thông',
  'atgt-van-ban': 'ATGT — Khuyến cáo',
};

const MAIN_CATEGORY_PATHS = {
  'phong-chong-lua-dao': { path: '/phong-chong-lua-dao', label: '🛡️ Chuyên mục: Phòng chống Lừa đảo Không gian mạng', desc: 'Xem tất cả bài tuyên truyền, khuyến cáo & hotline tố giác lừa đảo 24/7' },
  'an-toan-giao-thong': { path: '/an-toan-giao-thong', label: '🚦 Chuyên mục: Tuyên truyền An toàn Giao thông', desc: 'Xem quy định an toàn giao thông đường đèo dốc & mức phạt NĐ 100' },
  'atgt-tin-tuc': { path: '/an-toan-giao-thong', label: '🚦 Chuyên mục: Tuyên truyền An toàn Giao thông', desc: 'Xem quy định an toàn giao thông đường đèo dốc & mức phạt NĐ 100' },
  'atgt-phap-luat': { path: '/an-toan-giao-thong', label: '🚦 Chuyên mục: Tuyên truyền An toàn Giao thông', desc: 'Xem quy định an toàn giao thông đường đèo dốc & mức phạt NĐ 100' },
  'atgt-hoc-sinh': { path: '/an-toan-giao-thong', label: '🚦 Chuyên mục: Tuyên truyền An toàn Giao thông', desc: 'Xem quy định an toàn giao thông đường đèo dốc & mức phạt NĐ 100' },
  'atgt-duong-nong-thon': { path: '/an-toan-giao-thong', label: '🚦 Chuyên mục: Tuyên truyền An toàn Giao thông', desc: 'Xem quy định an toàn giao thông đường đèo dốc & mức phạt NĐ 100' },
  'atgt-mua-mua': { path: '/an-toan-giao-thong', label: '🚦 Chuyên mục: Tuyên truyền An toàn Giao thông', desc: 'Xem quy định an toàn giao thông đường đèo dốc & mức phạt NĐ 100' },
  'atgt-van-hoa': { path: '/an-toan-giao-thong', label: '🚦 Chuyên mục: Tuyên truyền An toàn Giao thông', desc: 'Xem quy định an toàn giao thông đường đèo dốc & mức phạt NĐ 100' },
  'atgt-van-ban': { path: '/an-toan-giao-thong', label: '🚦 Chuyên mục: Tuyên truyền An toàn Giao thông', desc: 'Xem quy định an toàn giao thông đường đèo dốc & mức phạt NĐ 100' },
  'thien-tai': { path: '/thien-tai', label: '🌧️ Chuyên mục: Phòng chống Thiên tai & Bão lũ', desc: 'Xem kỹ năng ứng phó sạt lở đá & điểm tránh trú khẩn cấp' },
  'bau-cu': { path: '/bau-cu', label: '🗳️ Chuyên mục: Tuyên truyền Bầu cử', desc: 'Tra cứu danh sách cử tri, quy trình gạch phiếu & địa điểm bỏ phiếu' },
  'huong-dan-vneid': { path: '/huong-dan-vneid', label: '🆔 Chuyên mục: Hướng dẫn VNeID Mức 2', desc: 'Xem hướng dẫn kích hoạt VNeID & tích hợp thẻ BHYT' },
  'te-nan': { path: '/te-nan', label: '🛡️ Chuyên mục: Phòng chống Tệ nạn Xã hội', desc: 'Xem hướng dẫn phòng ngừa tệ nạn & hotline tố giác' },
  'chay-rung': { path: '/phong-chong-chay-rung', label: '🔥 Chuyên mục: Phòng chống Cháy rừng', desc: 'Quy định kỹ thuật đốt rẫy mùa khô & số báo cháy khẩn cấp' },
  'duoi-nuoc': { path: '/duoi-nuoc', label: '🏊 Chuyên mục: Phòng chống Đuối nước', desc: 'Kỹ năng sơ cứu đuối nước & an toàn sông hồ mùa hè' },
  'thu-tuc-hanh-chinh': { path: '/Thu-tuc-hanh-chinh', label: '📑 Chuyên mục: Thủ tục Hành chính & Dịch vụ công', desc: 'Tra cứu hồ sơ khai sinh, kết hôn, đất đai & nộp trực tuyến' },
  'tra-cuu': { path: '/tra-cuu', label: '🏥 Chuyên mục: Tra cứu BHYT & BHXH', desc: 'Hướng dẫn tra cứu thẻ BHYT & thời gian đóng BHXH' },
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

                {/* 📌 NÚT BẤM LIÊN KẾT TRỰC TIẾP TỚI CHUYÊN MỤC CHÍNH */}
                {(() => {
                  const mainCat = MAIN_CATEGORY_PATHS[bv.danh_muc];
                  if (!mainCat) return null;
                  return (
                    <div style={{
                      margin: '20px 0 10px',
                      background: 'linear-gradient(135deg, #002d5a 0%, #005baa 100%)',
                      color: '#ffffff',
                      padding: '16px 20px',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      boxShadow: '0 6px 18px rgba(0, 45, 90, 0.25)',
                      border: '1.5px solid #bfdbfe'
                    }}>
                      <div>
                        <div style={{ fontSize: '11.5px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#fca5a5' }}>
                          📌 TRANG CHUYÊN MỤC TUYÊN TRUYỀN CHÍNH THỨC
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: '900', marginTop: '3px', color: '#ffffff' }}>
                          {mainCat.label}
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', marginTop: '2px' }}>
                          {mainCat.desc}
                        </div>
                      </div>
                      <Link
                        to={mainCat.path}
                        style={{
                          background: '#ffffff',
                          color: '#003d7a',
                          padding: '10px 20px',
                          borderRadius: '25px',
                          fontWeight: '900',
                          fontSize: '13.5px',
                          textDecoration: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          whiteSpace: 'nowrap',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        Bấm xem Chuyên mục chính ➔
                      </Link>
                    </div>
                  );
                })()}
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

              {/* 🎬 KHUNG VIDEO TUYÊN TRUYỀN CHÍNH THỨC (NẾU CÓ VIDEO) */}
              {bv.video && (
                <div className="bvd-video-cinema-container" style={{
                  margin: '22px 0 30px',
                  background: 'linear-gradient(145deg, #0b1329 0%, #1e293b 100%)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
                  border: '1.5px solid #334155'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: '800',
                    marginBottom: '14px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid rgba(255,255,255,0.12)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>🎬</span>
                      <span style={{ color: '#f8fafc', letterSpacing: '0.3px' }}>VIDEO TUYÊN TRUYỀN CHÍNH THỨC</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#38bdf8', background: 'rgba(56,189,248,0.18)', padding: '4px 12px', borderRadius: '20px', fontWeight: '800', border: '1px solid rgba(56,189,248,0.3)' }}>
                      HD 1080p • Phát thanh công khai
                    </span>
                  </div>

                  <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', background: '#000000', aspectRatio: '16/9', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                    <video
                      src={bv.video}
                      controls
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <div style={{ marginTop: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.85)', textAlign: 'center', fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <span>📹</span>
                    <span>Kính mời bà con nhấn nút Phát (Play) để xem video tuyên truyền và nghe hướng dẫn chi tiết.</span>
                  </div>
                </div>
              )}

              {/* 🎧 KHUNG FILE ÂM THANH / PHÁT THANH TUYÊN TRUYỀN CHÍNH THỨC (NẾU CÓ AUDIO) */}
              {bv.audio && (
                <div className="bvd-audio-player-container" style={{
                  margin: '20px 0 26px',
                  background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
                  borderRadius: '16px',
                  padding: '18px 22px',
                  color: '#ffffff',
                  boxShadow: '0 10px 28px rgba(4, 120, 87, 0.25)',
                  border: '1.5px solid #a7f3d0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    fontWeight: '800',
                    marginBottom: '12px',
                    paddingBottom: '8px',
                    borderBottom: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '22px' }}>📻</span>
                      <span style={{ color: '#ffffff', letterSpacing: '0.3px' }}>FILE ÂM THANH / BẢN TIN PHÁT THANH BÀI VIẾT</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#6ee7b7', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '20px', fontWeight: '800' }}>
                      🎧 Audio Tuyên Truyền
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <audio controls src={bv.audio} style={{ width: '100%', outline: 'none', height: '42px', borderRadius: '8px' }} />
                  </div>

                  <div style={{ marginTop: '10px', fontSize: '12.5px', color: '#ecfdf5', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🔊</span>
                    <span>Kính mời bà con bấm nút Play để nghe bản tin âm thanh tuyên truyền phát thanh.</span>
                  </div>
                </div>
              )}

              {/* Phần Ảnh & Nội dung Chữ: Tự động điều chỉnh khi chỉ có Video hoặc có cả Ảnh */}
              {(() => {
                const allImages = [
                  ...(bv.anh_dai_dien ? [bv.anh_dai_dien] : []),
                  ...(Array.isArray(bv.anh_phu) ? bv.anh_phu.filter(url => url !== bv.anh_dai_dien) : [])
                ];

                const isOnlyVideo = bv.video && allImages.length === 0;

                return (
                  <div className={`bvd-media-text-flex ${allImages.length > 0 ? 'has-images' : 'no-images'}`}>
                    {/* Cột bên ảnh (chỉ hiện khi có ảnh) */}
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
                          📷 <i>Ảnh minh họa — Nguồn: {bv.nguoi_dang || 'Phòng Văn hóa - Xã hội'}</i>
                        </figcaption>
                      </div>
                    )}

                    {/* Cột Nội dung văn bản chi tiết (Mở rộng full 100% khi chỉ đăng Video) */}
                    <div className="bvd-content" style={{ width: isOnlyVideo ? '100%' : undefined }}>
                      {isOnlyVideo && (
                        <div style={{
                          background: '#f0f9ff',
                          borderLeft: '4px solid #0284c7',
                          padding: '12px 16px',
                          borderRadius: '0 8px 8px 0',
                          marginBottom: '20px',
                          fontSize: '13.5px',
                          color: '#0369a1',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span>📋</span>
                          <span>Nội dung bài viết chi tiết đi kèm Video tuyên truyền:</span>
                        </div>
                      )}

                      {paragraphs.map((para, i) => (
                        <p key={i} style={{ fontSize: '15.5px', lineHeight: '1.8', color: '#1e293b', marginBottom: '16px' }}>{para.trim()}</p>
                      ))}
                    </div>

                    {/* Lightbox xem ảnh toàn màn hình (nếu có ảnh) */}
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