import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FEATURES } from '../data';
import './ChuyenMucPage.css';

// Thêm icon & tag phân loại cho từng chuyên mục
const CATEGORY_TAGS = {
  '/an-toan-giao-thong': { icon: '🚦', badge: 'An toàn Giao thông', color: '#c62828' },
  '/bau-cu': { icon: '🗳️', badge: 'Tuyên truyền Bầu cử', color: '#d32f2f' },
  '/thien-tai': { icon: '🌧️', badge: 'Phòng chống Thiên tai', color: '#0284c7' },
  '/duoi-nuoc': { icon: '🏊', badge: 'Kỹ năng An toàn', color: '#00838f' },
  '/chay-rung': { icon: '🔥', badge: 'Phòng cháy Chữa cháy', color: '#e65100' },
  '/te-nan': { icon: '🛡️', badge: 'Phòng chống Tệ nạn', color: '#6a1b9a' },
  '/huong-dan-vneid': { icon: '🆔', badge: 'Dịch vụ công Số', color: '#1565c0' },
  '/phong-chong-lua-dao': { icon: '🛡️', badge: 'Chống Lừa đảo Mạng', color: '#1d4ed8' },
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

      {/* 🏛️ BANNER HEADER TOP HOÀNH TRÁNG, CHỮ TO RÕ NÉT */}
      <div className="cm-hero-header">
        <div className="cm-hero-badge">
          🏛️ UBND XÃ ĐĂK PXI • PHÒNG VĂN HÓA - XÃ HỘI
        </div>
        <h1 className="cm-hero-title">
          CHUYÊN MỤC TUYÊN TRUYỀN & HƯỚNG DẪN DÀNH CHO BÀ CON
        </h1>
        <p className="cm-hero-subtitle">
          Tra cứu thông tin tuyên truyền chính thức, pháp luật, kỹ năng an toàn & hướng dẫn hành chính công xã Đăk Pxi, tỉnh Quảng Ngãi
        </p>

        {/* 🔍 Ô TÌM KIẾM CHUYÊN MỤC CHỮ TO RÕ */}
        <div className="cm-search-box">
          <span className="cm-search-icon">🔍</span>
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

        {/* 🏷️ BỘ LỌC NHANH CÁC CHUYÊN MỤC */}
        <div className="cm-filter-tags">
          <button
            className={`cm-filter-btn ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            🌟 Tất cả chuyên mục ({FEATURES.length})
          </button>
          {FEATURES.map(f => {
            const meta = CATEGORY_TAGS[f.path] || { icon: '📌', badge: f.title };
            return (
              <button
                key={f.path}
                className={`cm-filter-btn ${activeFilter === f.path ? 'active' : ''}`}
                onClick={() => setActiveFilter(f.path)}
              >
                {meta.icon} {meta.badge}
              </button>
            );
          })}
        </div>
      </div>

      {/* 📦 DANH SÁCH THẺ CHUYÊN MỤC GIAO DIỆN MỚI LẠ, CHỮ TO RÕ, ĐẲNG CẤP */}
      {filteredFeatures.length === 0 ? (
        <div className="cm-empty">
          <p className="cm-empty-text">🔍 Không tìm thấy chuyên mục phù hợp với từ khóa "{searchTerm}".</p>
          <button className="cm-empty-reset" onClick={() => { setSearchTerm(''); setActiveFilter('ALL'); }}>
            Xem lại tất cả chuyên mục
          </button>
        </div>
      ) : (
        <div className="cm-grid">
          {filteredFeatures.map((f) => {
            const meta = CATEGORY_TAGS[f.path] || { icon: '📌', badge: 'Tuyên truyền', color: '#003d7a' };
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
                    <span>{meta.icon} {meta.badge}</span>
                  </div>
                  <div className="cm-img-overlay">
                    <span>🔍 Nhấn để xem hướng dẫn chi tiết</span>
                  </div>
                </div>

                {/* Thân thẻ - Chữ TO RÕ NÉT */}
                <div className="cm-body">
                  <h2 className="cm-title">{f.title}</h2>
                  <p className="cm-desc">{f.desc}</p>
                  
                  <div className="cm-action-bar">
                    <span className="cm-action-text">Xem chi tiết bài hướng dẫn</span>
                    <span className="cm-action-arrow">➔</span>
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