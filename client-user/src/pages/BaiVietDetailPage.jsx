import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './BaiVietDetailPage.css';

const API = import.meta.env.VITE_API_BASE_URL || 'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1';

const DM_COLOR = {
  'phong-chong-lua-dao': '#c62828',
  'an-toan-giao-thong': '#003d7a',
  'thien-tai': '#0284c7',
  'bau-cu': '#2563eb',
  'huong-dan-vneid': '#1e3a8a',
  'te-nan': '#991b1b',
  'chay-rung': '#c2410c',
  'duoi-nuoc': '#0369a1',
  'thu-tuc-hanh-chinh': '#0d9488',
  'tra-cuu': '#15803d',
  'su-kien': '#e11d48',
  'the-thao': '#16a34a',
  'le-hoi': '#d97706',
  'tin-tuc': '#7c3aed',
  'thong-bao': '#0d9488',
  'khac': '#475569',
};

const DM_LABEL = {
  'phong-chong-lua-dao': 'Phòng, chống Lừa đảo Mạng',
  'an-toan-giao-thong': 'An toàn Giao thông',
  'thien-tai': 'Phòng chống Thiên tai',
  'bau-cu': 'Bầu cử',
  'huong-dan-vneid': 'Hướng dẫn VNeID',
  'te-nan': 'Phòng chống Tệ nạn',
  'chay-rung': 'Phòng chống Cháy rừng',
  'duoi-nuoc': 'Phòng chống Đuối nước',
  'thu-tuc-hanh-chinh': 'Thủ tục Hành chính',
  'tra-cuu': 'Tra cứu BHYT & BHXH',
  'su-kien': 'Sự kiện',
  'the-thao': 'Thể thao',
  'le-hoi': 'Lễ hội',
  'tin-tuc': 'Tin tức',
  'thong-bao': 'Thông báo',
  'khac': 'Khác',
};

const FALLBACK_ARTICLES = [
  {
    _id: 'mock-1',
    danh_muc: 'the-thao',
    tieu_de: 'UBND XÃ ĐĂK PXI HƯỚNG DẪN THỰC HIỆN CHỈ TIÊU "GIA ĐÌNH THỂ THAO" GIAI ĐOẠN 2026 – 2030 (ẢNH TƯ LIỆU)',
    mo_ta: 'UBND xã Đăk Pxi thông báo và hướng dẫn đến toàn thể bà con Nhân dân trên địa bàn xã các tiêu chí và giải pháp thực hiện như sau: 1. Thế nào là "Gia đình thể thao"? Gia đình thể thao là hộ gia đình có từ 50% trở lên số thành viên trong gia đình tham gia tập luyện thể dục, thể thao thường xuyên. Tiêu chuẩn tập luyện: Tối thiểu 03 lần/tuần, mỗi lần từ 30 phút trở lên. 2. Mục tiêu của xã Đăk Pxi Khuyến khích "Mỗi người dân lựa chọn ít nhất một môn thể thao phù hợp để tập luyện thường xuyên". Chung tay cùng toàn tỉnh phấn đấu đưa tỷ lệ gia đình thể thao đạt 29% tổng số hộ gia đình vào năm 2030. 3. Các nhiệm vụ và giải pháp trọng tâm',
    noi_dung: 'Đẩy mạnh tuyên truyền: Lồng ghép phong trào rèn luyện thân thể với các phong trào "Toàn dân đoàn kết xây dựng đời sống văn hóa", "Gia đình văn hóa". Phát triển mô hình tập luyện: Khuyến khích thành lập các nhóm, câu lạc bộ (CLB) thể thao thôn với các môn thể thao phù hợp như: đi bộ, cầu lông, bóng chuyền, dân vũ, bóng đá, trò chơi dân gian, thể thao dân tộc... Phấn đấu mỗi thôn duy trì các hình thức tập luyện hiệu quả. Tăng cường cơ sở vật chất: Khai thác tối đa Nhà rông văn hóa các thôn, sân thể thao, trường học trên địa bàn làm nơi tập luyện cho bà con. UBND xã Đăk Pxi đề nghị các ban ngành, đoàn thể xã, Ban nhân dân các thôn và toàn thể Nhân dân tích cực hưởng ứng, hưởng ứng rèn luyện thân thể theo gương Bác Hồ vĩ đại, nâng cao sức khỏe cá nhân và gia đình!',
    anh_dai_dien: '/huong-dan/atgt-1.png',
    anh_phu: ['/huong-dan/atgt-1.png', '/huong-dan/baucu-2.png', '/huong-dan/hinh-nen05.jpg'],
    nguoi_dang: 'Hoàng Trung Dũng',
    createdAt: '2026-07-20T08:00:00.000Z',
    luot_xem: 33,
  },
  {
    _id: 'mock-2',
    danh_muc: 'bau-cu',
    tieu_de: 'Xã Đăk Pxi tổ chức thành công bầu cử Trưởng thôn nhiệm kỳ 2025 – 2030',
    mo_ta: 'Ngày 19/7/2026, các thôn trên địa bàn xã Đăk Pxi đã đồng loạt tổ chức bầu cử Trưởng thôn nhiệm kỳ 2025 - 2030 theo đúng kế hoạch của UBND xã.',
    noi_dung: 'Công tác chuẩn bị bầu cử được triển khai nghiêm túc, dân chủ, đúng pháp luật. Tỷ lệ cử tri đại diện hộ gia đình đi bầu đạt trên 98%.',
    anh_dai_dien: '/huong-dan/baucu-2.png',
    nguoi_dang: 'UBND xã Đăk Pxi',
    createdAt: '2026-07-20T08:00:00.000Z',
    luot_xem: 7,
  },
  {
    _id: 'mock-3',
    danh_muc: 'the-thao',
    tieu_de: 'BẾ MẠC GIẢI BÓNG CHUYỀN "BÔNG LÚA VÀNG" XÃ ĐĂK PXI',
    mo_ta: 'Giải đấu quy tụ hơn 100 vận động viên đến từ 8 thôn trên địa bàn xã Đăk Pxi tranh tài sôi nổi.',
    noi_dung: 'Trận chung kết diễn ra vô cùng kịch tính với sự cổ vũ nhiệt tình của hàng trăm bà con nhân dân.',
    anh_dai_dien: '/huong-dan/atgt-1.png',
    nguoi_dang: 'Ban Tổ Chức',
    createdAt: '2026-07-10T08:00:00.000Z',
    luot_xem: 15,
  }
];

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

function fmtDateShort(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function removeRawEmojis(str) {
  if (!str) return '';
  return str
    .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function BaiVietDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bv, setBv] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showFullQuote, setShowFullQuote] = useState(false);

  useEffect(() => {
    setLoading(true);
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
      .catch(() => {
        const found = FALLBACK_ARTICLES.find(m => m._id === id || String(m._id).includes(id) || (id && id.includes(m.danh_muc))) || {
          ...FALLBACK_ARTICLES[0],
          _id: id,
        };
        setBv(found);
        setRelated(FALLBACK_ARTICLES.filter(m => m._id !== found._id));
      })
      .finally(() => setLoading(false));
  }, [id]);

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  const color = bv ? (DM_COLOR[bv.danh_muc] || '#16a34a') : '#16a34a';
  const readTime = bv
    ? Math.max(1, Math.ceil((bv.noi_dung || '').split(/\s+/).length / 200))
    : 1;

  const cleanedNoiDung = bv && bv.noi_dung ? removeRawEmojis(bv.noi_dung) : '';
  const firstLetter = cleanedNoiDung ? cleanedNoiDung.trim().charAt(0) : 'Đ';
  const restContent = cleanedNoiDung ? cleanedNoiDung.trim().slice(1) : '';

  return (
    <article className="bvd-redesign-page">

      {/* ── HTML5 SEMANTIC NAV BREADCRUMBS ── */}
      <nav className="bvd-nav-breadcrumbs" aria-label="Điều hướng trang chi tiết">
        <ol className="bvd-breadcrumb-container">
          <li>
            <Link to="/" className="bc-home-icon" title="Trang chủ">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </Link>
          </li>
          <li className="bc-sep" aria-hidden="true">›</li>
          <li><Link to="/">Trang chủ</Link></li>
          <li className="bc-sep" aria-hidden="true">›</li>
          <li><Link to="/tin-tuc">Tất cả bài viết</Link></li>
          {bv && (
            <>
              <li className="bc-sep" aria-hidden="true">›</li>
              <li>
                <span className="bc-cat-name" style={{ color }}>{DM_LABEL[bv.danh_muc] || bv.danh_muc}</span>
              </li>
              <li className="bc-sep" aria-hidden="true">›</li>
              <li aria-current="page">
                <span className="bc-current-title">
                  {bv.tieu_de.length > 50 ? bv.tieu_de.slice(0, 50) + '...' : bv.tieu_de}
                </span>
              </li>
            </>
          )}
        </ol>
      </nav>

      {/* ── HTML5 SEMANTIC MAIN CONTENT CONTAINER ── */}
      <div className="bvd-main-container">
        
        {loading || !bv ? (
          <div className="bvd-loading-skeleton" aria-busy="true">
            <div className="sk-box" style={{ height: 300 }} />
          </div>
        ) : (
          <div className="bvd-grid-layout">
            
            {/* ═ CỘT TRÁI: KHUNG NỘI DUNG BÀI VIẾT MAIN ═ */}
            <main className="bvd-article-card">
              
              {/* HEADER BÀI VIẾT: BADGE + TITLE + SHARE BUTTONS */}
              <header className="bvd-card-header">
                <div className="bvd-badge-row">
                  <span className="bvd-category-chip" style={{ backgroundColor: color }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20"/>
                    </svg>
                    <span>{DM_LABEL[bv.danh_muc] || bv.danh_muc}</span>
                  </span>
                </div>

                <div className="bvd-title-share-wrapper">
                  <h1 className="bvd-article-main-title">{bv.tieu_de}</h1>

                  {/* CỤM NÚT CHIA SẺ HTML5 */}
                  <div className="bvd-share-group">
                    <span className="share-label">Chia sẻ:</span>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="share-btn fb"
                      title="Chia sẻ bài viết lên Facebook"
                      aria-label="Chia sẻ Facebook"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                      </svg>
                    </a>
                    <a
                      href={`https://zalo.me/share?url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="share-btn zalo"
                      title="Chia sẻ qua Zalo"
                      aria-label="Chia sẻ Zalo"
                    >
                      Zalo
                    </a>
                    <button
                      type="button"
                      className="share-btn copy"
                      onClick={copyLink}
                      title="Sao chép liên kết bài viết"
                      aria-label="Sao chép liên kết"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </header>

              {/* KHUNG DẪN DẮT (HTML5 BLOCKQUOTE) */}
              {bv.mo_ta && (
                <blockquote className="bvd-lead-quote-box">
                  <svg className="quote-mark start-svg" width="22" height="22" viewBox="0 0 24 24" fill="#16a34a" aria-hidden="true">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                  <div className="quote-text-content">
                    <p>{showFullQuote ? removeRawEmojis(bv.mo_ta) : (removeRawEmojis(bv.mo_ta).length > 280 ? removeRawEmojis(bv.mo_ta).slice(0, 280) + '...' : removeRawEmojis(bv.mo_ta))}</p>
                    {removeRawEmojis(bv.mo_ta).length > 280 && (
                      <button
                        type="button"
                        className="quote-toggle-btn"
                        onClick={() => setShowFullQuote(!showFullQuote)}
                      >
                        {showFullQuote ? 'Thu gọn ▲' : 'Xem thêm ˅'}
                      </button>
                    )}
                  </div>
                  <svg className="quote-mark end-svg" width="32" height="32" viewBox="0 0 24 24" fill="#bbf7d0" aria-hidden="true">
                    <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                  </svg>
                </blockquote>
              )}

              {/* THANH META THÔNG TIN BÀI (HTML5 META ROW) */}
              <div className="bvd-meta-info-bar">
                <div className="meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>{bv.nguoi_dang || 'Hoàng Trung Dũng'}</span>
                </div>

                <div className="meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <time dateTime={bv.createdAt}>{fmtDate(bv.createdAt)}</time>
                </div>

                <div className="meta-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>{readTime} phút đọc</span>
                </div>

                <div className="meta-item right-views">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span>{bv.luot_xem || 33} lượt xem</span>
                </div>
              </div>

              {/* BỐ CỤC NỘI DUNG VĂN BẢN VÀ HÌNH ẢNH (SECTION HTML5) */}
              <section className="bvd-article-body-grid">
                
                {/* CỘT HÌNH ẢNH BÊN TRÁI + GALLERY THUMBNAILS (FIGURE HTML5) */}
                <figure className="bvd-media-left-col">
                  <div className="main-photo-frame">
                    <img
                      src={bv.anh_dai_dien || '/huong-dan/atgt-1.png'}
                      alt={bv.tieu_de}
                      className="main-photo-img"
                    />
                  </div>

                  {/* THUMBNAILS GALLERY */}
                  <figcaption className="photo-thumbs-grid">
                    <img src={bv.anh_dai_dien || '/huong-dan/atgt-1.png'} alt="Ảnh tư liệu 1" className="thumb-item active" />
                    <img src="/huong-dan/baucu-2.png" alt="Ảnh tư liệu 2" className="thumb-item" />
                    <img src="/huong-dan/hinh-nen05.jpg" alt="Ảnh tư liệu 3" className="thumb-item" />
                    <div className="thumb-item more-overlay">
                      <span>+12 ảnh</span>
                    </div>
                  </figcaption>
                </figure>

                {/* CỘT NỘI DUNG VĂN BẢN VỚI CHỮ ĐẦU DÒNG IN LỚN (DROP CAP) */}
                <div className="bvd-text-right-col">
                  <div className="drop-cap-paragraph">
                    <span className="drop-cap-box" style={{ backgroundColor: color }}>
                      {firstLetter}
                    </span>
                    <span className="drop-cap-text">{restContent}</span>
                  </div>

                  {/* BANNER THÔNG ĐIỆP ĐỘNG LỰC DƯỚI BÀI */}
                  <div className="bvd-quote-banner-footer" style={{ borderColor: color }}>
                    <div className="banner-trophy-icon" style={{ backgroundColor: color }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                        <path d="M4 22h16"/>
                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
                      </svg>
                    </div>
                    <div className="banner-quote-text">
                      "Khỏe để xây dựng và bảo vệ Tổ quốc – Mỗi gia đình khỏe mạnh, xã hội vững mạnh!"
                    </div>
                  </div>
                </div>

              </section>

            </main>

            {/* ═ CỘT PHẢI: SIDEBAR WIDGETS (ASIDE HTML5) ═ */}
            <aside className="bvd-sidebar-col">
              
              {/* WIDGET 1: THÔNG TIN BÀI VIẾT (SECTION HTML5) */}
              <section className="sidebar-info-card">
                <header className="card-header-banner" style={{ backgroundColor: color }}>
                  <span>THÔNG TIN BÀI VIẾT</span>
                </header>

                <div className="card-info-table">
                  <div className="table-row">
                    <div className="row-left">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" aria-hidden="true">
                        <rect x="3" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="14" width="7" height="7" rx="1"/>
                        <rect x="3" y="14" width="7" height="7" rx="1"/>
                      </svg>
                      <span>Chuyên mục</span>
                    </div>
                    <span className="row-val-badge" style={{ color: '#16a34a', fontWeight: '800' }}>
                      {DM_LABEL[bv.danh_muc] || bv.danh_muc}
                    </span>
                  </div>

                  <div className="table-row">
                    <div className="row-left">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" aria-hidden="true">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <span>Ngày đăng</span>
                    </div>
                    <time dateTime={bv.createdAt} className="row-val-bold">{fmtDateShort(bv.createdAt)}</time>
                  </div>

                  <div className="table-row">
                    <div className="row-left">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>Thời gian đọc</span>
                    </div>
                    <span className="row-val-bold">{readTime} phút</span>
                  </div>

                  <div className="table-row">
                    <div className="row-left">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span>Lượt xem</span>
                    </div>
                    <span className="row-val-bold">{bv.luot_xem || 32}</span>
                  </div>

                  <div className="table-row">
                    <div className="row-left">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" aria-hidden="true">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                      <span>Chia sẻ</span>
                    </div>
                    <div className="bvd-share-group" style={{ margin: 0 }}>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="share-btn fb"
                        title="Chia sẻ Facebook"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                        </svg>
                      </a>
                      <a
                        href={`https://zalo.me/share?url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="share-btn zalo"
                        title="Chia sẻ Zalo"
                      >
                        Zalo
                      </a>
                      <button
                        type="button"
                        className="share-btn copy"
                        onClick={copyLink}
                        title="Sao chép liên kết"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* WIDGET 2: BANNER THÔNG ĐIỆP ĐỘNG LỰC (SECTION HTML5) */}
              <section className="sidebar-motivation-banner" style={{ background: `linear-gradient(135deg, ${color} 0%, #15803d 100%)`, borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div className="motivation-icon-circle" style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="M12 8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
                      <path d="M7 16c0-2 2-3 5-3s5 1 5 3"/>
                    </svg>
                  </div>
                  <div className="motivation-text" style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', lineHeight: '1.4' }}>
                    Thể thao – Chìa khóa vàng cho sức khỏe và hạnh phúc gia đình!
                  </div>
                </div>
                <Link
                  to="/tin-tuc"
                  style={{
                    background: '#ffffff',
                    color: '#16a34a',
                    padding: '10px 18px',
                    borderRadius: '25px',
                    fontWeight: '800',
                    fontSize: '13px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  <span>Xem thêm các hoạt động thể thao</span>
                  <span>➔</span>
                </Link>
              </section>

              {/* WIDGET 3: BÀI VIẾT LIÊN QUAN (SECTION HTML5) */}
              <section className="sidebar-related-card">
                <header className="related-card-header">
                  <h3 className="related-title">BÀI VIẾT LIÊN QUAN</h3>
                  <Link to="/tin-tuc" className="related-view-all-link">
                    <span>Xem tất cả</span>
                    <span>→</span>
                  </Link>
                </header>

                <div className="related-items-list">
                  {(related.length > 0 ? related : FALLBACK_ARTICLES).slice(0, 1).map(r => (
                    <article
                      key={r._id || r.id}
                      className="related-item-row"
                      onClick={() => navigate(`/tin-tuc/${r._id || r.id}`)}
                    >
                      <img src={r.anh_dai_dien || r.image} alt={r.tieu_de || r.title} className="related-thumb-img" />
                      <div className="related-item-info">
                        <span className="related-category-badge" style={{ backgroundColor: color }}>
                          {DM_LABEL[r.danh_muc] || 'Thể thao'}
                        </span>
                        <h4 className="related-item-title">
                          {r.tieu_de || r.title}
                        </h4>
                        <time dateTime={r.createdAt || r.date} className="related-item-date">{fmtDateShort(r.createdAt || r.date)}</time>
                      </div>
                    </article>
                  ))}
                </div>

                {/* CAROUSEL DOTS */}
                <div className="related-carousel-dots">
                  <span className="dot active" style={{ backgroundColor: color }} />
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </section>

            </aside>

          </div>
        )}

      </div>

    </article>
  );
}