import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FEATURES } from '../data';
import './ChuyenMucPage.css';

// ── BỘ ICON SVG CHUẨN HTML5 ──
const SvgIcons = {
  Traffic: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="10" height="20" x="7" y="2" rx="3" />
      <circle cx="12" cy="6" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="18" r="1.5" />
    </svg>
  ),
  Vote: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 12 2 2 4-4" />
      <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
      <path d="M3 19h18" />
    </svg>
  ),
  Rain: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M16 14v6" />
      <path d="M8 14v6" />
      <path d="M12 16v6" />
    </svg>
  ),
  Water: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
      <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
    </svg>
  ),
  Fire: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3Z" />
    </svg>
  ),
  Shield: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  IdBadge: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="14" x="3" y="5" rx="2" />
      <circle cx="9" cy="12" r="2" />
      <path d="M15 10h2" />
      <path d="M15 14h2" />
    </svg>
  ),
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Landmark: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7 12 2" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Star: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
};

// Map chuyên mục với SVG icon chuẩn
const CATEGORY_TAGS = {
  '/an-toan-giao-thong': { icon: <SvgIcons.Traffic />, badge: 'An toàn Giao thông', color: '#c62828' },
  '/bau-cu': { icon: <SvgIcons.Vote />, badge: 'Tuyên truyền Bầu cử', color: '#d32f2f' },
  '/thien-tai': { icon: <SvgIcons.Rain />, badge: 'Phòng chống Thiên tai', color: '#0284c7' },
  '/duoi-nuoc': { icon: <SvgIcons.Water />, badge: 'Kỹ năng An toàn', color: '#00838f' },
  '/chay-rung': { icon: <SvgIcons.Fire />, badge: 'Phòng cháy Chữa cháy', color: '#e65100' },
  '/te-nan': { icon: <SvgIcons.Shield />, badge: 'Phòng chống Tệ nạn', color: '#6a1b9a' },
  '/huong-dan-vneid': { icon: <SvgIcons.IdBadge />, badge: 'Dịch vụ công Số', color: '#1565c0' },
  '/phong-chong-lua-dao': { icon: <SvgIcons.Shield />, badge: 'Chống Lừa đảo Mạng', color: '#1d4ed8' },
};

export default function ChuyenMucPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Lọc chuyên mục theo ô tìm kiếm và bộ lọc nhanh
  const filteredFeatures = FEATURES.filter(f => {
    const matchesSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.desc.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === 'ALL') return matchesSearch;
    return matchesSearch && f.path === activeFilter;
  });

  return (
    <div className="cm-page">

      {/* BANNER HEADER TOP HTML5 CHUẨN */}
      <div className="cm-hero-header">
        <div className="cm-hero-badge">
          <SvgIcons.Landmark />
          <span>UBND XÃ ĐĂK PXI • PHÒNG VĂN HÓA - XÃ HỘI</span>
        </div>
        <h1 className="cm-hero-title">
          CHUYÊN MỤC TUYÊN TRUYỀN & HƯỚNG DẪN DÀNH CHO BÀ CON
        </h1>
        <p className="cm-hero-subtitle">
          Tra cứu thông tin tuyên truyền chính thức, pháp luật, kỹ năng an toàn & hướng dẫn hành chính công Phòng Văn hóa - Xã hội xã Đăk Pxi
        </p>

        {/* Ô TÌM KIẾM CHUYÊN MỤC */}
        <div className="cm-search-box">
          <span className="cm-search-icon">
            <SvgIcons.Search />
          </span>
          <input
            type="text"
            className="cm-search-input"
            placeholder="Gõ từ khóa tìm kiếm chuyên mục (ví dụ: giao thông, vneid, thiên tai, bầu cử...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="cm-search-clear" onClick={() => setSearchTerm('')}>✕ Xóa</button>
          )}
        </div>

        {/* BỘ LỌC NHANH CÁC CHUYÊN MỤC */}
        <div className="cm-filter-tags">
          <button
            className={`cm-filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            <SvgIcons.Star />
            <span>Tất cả chuyên mục ({FEATURES.length})</span>
          </button>
          {FEATURES.map(f => {
            const meta = CATEGORY_TAGS[f.path] || { icon: <SvgIcons.Shield />, badge: f.title };
            return (
              <button
                key={f.path}
                className={`cm-filter-btn ${activeFilter === f.path ? 'active' : ''}`}
                onClick={() => setActiveFilter(f.path)}
              >
                {meta.icon}
                <span>{meta.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DANH SÁCH THẺ CHUYÊN MỤC */}
      {filteredFeatures.length === 0 ? (
        <div className="cm-empty">
          <p className="cm-empty-text">Không tìm thấy chuyên mục phù hợp với từ khóa "{searchTerm}".</p>
          <button className="cm-empty-reset" onClick={() => { setSearchTerm(''); setActiveFilter('ALL'); }}>
            Xem lại tất cả chuyên mục
          </button>
        </div>
      ) : (
        <div className="cm-grid">
          {filteredFeatures.map((f) => {
            const meta = CATEGORY_TAGS[f.path] || { icon: <SvgIcons.Shield />, badge: 'Tuyên truyền', color: '#003d7a' };
            return (
              <div
                key={f.path}
                className="cm-card"
                onClick={() => {
                  navigate(f.path);
                  window.scrollTo(0, 0);
                }}
              >
                {/* Khung ảnh + Badge nổi */}
                <div className="cm-img-wrap">
                  <img src={f.image} alt={f.title} className="cm-img" />
                  <div className="cm-img-badge" style={{ backgroundColor: meta.color }}>
                    {meta.icon}
                    <span>{meta.badge}</span>
                  </div>
                  <div className="cm-img-overlay">
                    <span><SvgIcons.Search /> Nhấn để xem hướng dẫn chi tiết</span>
                  </div>
                </div>

                {/* Thân thẻ - Chữ TO RÕ NÉT */}
                <div className="cm-body">
                  <h2 className="cm-title">{f.title}</h2>
                  <p className="cm-desc">{f.desc}</p>
                  
                  <div className="cm-action-bar">
                    <span className="cm-action-text">Xem chi tiết bài hướng dẫn</span>
                    <span className="cm-action-arrow"><SvgIcons.ArrowRight /></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}