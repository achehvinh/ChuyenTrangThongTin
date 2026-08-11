import { useMemo, useState } from "react";
import { EVENTS } from "../data";
import "./LichHopPage.css";

// ── BỘ ICON VECTOR SVG CHUẨN HTML5 ──
const SvgIcons = {
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Calendar: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  BellAlert: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  ),
  Zap: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Building: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
    </svg>
  ),
  ArrowRight: ({ color = "#dc2626" }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Users: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  BookOpen: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Syringe: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 2 4 4" />
      <path d="m17 7 3-3" />
      <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
      <path d="m9 11 4 4" />
      <path d="m5 19-3 3" />
      <path d="m14 4 6 6" />
    </svg>
  )
};

const THON_LIST = ["Tất cả", "Đăk Xế Kơ Ne", "Đăk Pxi", "Đăk Kơ Đương", "Đăk Rơ Wang"];

const EVENT_ITEMS = [
  {
    id: 1,
    title: "Thông báo về việc tổ chức tiếp công dân định kỳ tháng 8/2026",
    categoryLabel: "HỌP DÂN",
    badgeCls: "amber-badge",
    boxCls: "amber-box",
    arrowCls: "amber-arrow",
    arrowColor: "#d97706",
    date: "22/07/2026 • 10:15",
    location: "Bộ phận Một cửa - UBND xã Đăk Pxi",
    icon: SvgIcons.Users
  },
  {
    id: 2,
    title: "Cảnh báo an toàn giao thông trong điều kiện mưa lớn",
    categoryLabel: "CẢNH BÁO",
    badgeCls: "purple-badge",
    boxCls: "purple-box",
    arrowCls: "purple-arrow",
    arrowColor: "#7c3aed",
    date: "21/07/2026 • 16:45",
    location: "Nhà văn hóa thôn Đăk Xế Kơ Ne",
    icon: SvgIcons.BookOpen
  },
  {
    id: 3,
    title: "Hướng dẫn thủ tục cấp đổi giấy phép lái xe trực tuyến",
    categoryLabel: "THÔNG TIN",
    badgeCls: "green-badge",
    boxCls: "green-box",
    arrowCls: "green-arrow",
    arrowColor: "#16a34a",
    date: "21/07/2026 • 09:30",
    location: "Trạm Y tế xã Đăk Pxi",
    icon: SvgIcons.Syringe
  }
];

export default function LichHopPage() {
  const [filterThon, setFilterThon] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null);

  const filteredEvents = useMemo(() => {
    return EVENT_ITEMS.filter((item) => {
      const matchThon = filterThon === "Tất cả" || item.location.includes(filterThon);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
      return matchThon && matchSearch;
    });
  }, [filterThon, searchQuery]);

  return (
    <div className="lh-page-root">
      {/* ── BANNER HERO ĐẦU TRANG CHUẨN GIAO DIỆN MẪU ── */}
      <div className="lh-hero-banner">
        <div className="lh-hero-inner">
          <div className="lh-hero-badge">📅 LỊCH CHÍNH THỨC</div>
          <h1 className="lh-hero-heading">
            Cập nhật văn bản chỉ đạo, <span className="highlight-yellow">chính sách & lịch tiếp công dân</span>
          </h1>

          {/* Ô TÌM KIẾM BO TRÒN TRÊN BANNER HERO */}
          <div className="lh-hero-search-wrap">
            <div className="lh-search-input-box">
              <span className="lh-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Nhập từ khóa, số hiệu văn bản (Ví dụ: 88/TB-UBND, BHYT, PCTT....)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button type="button" className="lh-clear-btn" onClick={() => setSearchQuery("")}>✕</button>
              )}
            </div>
            <button type="button" className="lh-filter-funnel-btn" title="Lọc lịch họp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── 4 THẺ THỐNG KÊ TRẠNG THÁI NỔI CHUẨN MẪU (4 METRICS GRID) ── */}
      <div className="lh-metrics-container">
        <div className="lh-metrics-grid">
          {/* CARD 1: BLUE */}
          <div className="lh-metric-card">
            <div className="metric-icon-circle blue-bg">
              <SvgIcons.Calendar />
            </div>
            <div className="metric-info">
              <strong className="metric-num blue-text">6</strong>
              <span className="metric-title">Thông báo hoạt động</span>
              <span className="metric-sub">Đang hiệu lực</span>
            </div>
          </div>

          {/* CARD 2: RED */}
          <div className="lh-metric-card">
            <div className="metric-icon-circle red-bg">
              <SvgIcons.BellAlert />
            </div>
            <div className="metric-info">
              <strong className="metric-num red-text">1</strong>
              <span className="metric-title">Cảnh báo khẩn cấp</span>
              <span className="metric-sub">Cần chú ý ngay</span>
            </div>
          </div>

          {/* CARD 3: GREEN */}
          <div className="lh-metric-card">
            <div className="metric-icon-circle green-bg">
              <SvgIcons.Zap />
            </div>
            <div className="metric-info">
              <strong className="metric-num green-text" style={{ fontSize: "20px" }}>Hôm nay</strong>
              <span className="metric-title">Cập nhật mới nhất</span>
              <span className="metric-sub">22/07/2026</span>
            </div>
          </div>

          {/* CARD 4: PURPLE */}
          <div className="lh-metric-card">
            <div className="metric-icon-circle purple-bg">
              <SvgIcons.Building />
            </div>
            <div className="metric-info">
              <strong className="metric-num purple-text">24/7</strong>
              <span className="metric-title">Kênh thông tin</span>
              <span className="metric-sub">Hoạt động liên tục</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN BODY CONTENT ── */}
      <div className="lh-main-body">
        {/* SECTION 1: LỊCH HỌP NỔI BẬT KHẨN CẤP KHỚP 100% ẢNH MẪU */}
        <section className="lh-featured-section">
          <h2 className="lh-section-heading">
            <span className="alert-emoji">🚨</span> THÔNG BÁO NỔI BẬT
          </h2>

          <div className="lh-featured-banner-card" onClick={() => setActiveModal(EVENT_ITEMS[0])}>
            {/* ICON MƯA BÃO / KHẨN CẤP BÊN TRÁI */}
            <div className="lh-banner-icon-box">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                <path d="M13 13l-3 5h4l-2 5" />
              </svg>
            </div>

            {/* NỘI DUNG CHÍNH Ở GIỮA */}
            <div className="lh-banner-content">
              <span className="lh-red-tag">CẢNH BÁO KHẨN CẤP</span>
              <h3 className="lh-banner-title">
                Phòng chống mưa bão, lũ quét và nguy cơ đuối nước mùa mưa bão năm 2026
              </h3>
              <p className="lh-banner-desc">
                Cảnh báo nguy cơ mực nước dâng cao đột ngột tại sông Đắc Pxi. Đề nghị người dân và gia đình quản lý chặt chẽ trẻ em, tuyệt đối không tắm sông suối.
              </p>

              <div className="lh-banner-meta-row">
                <span className="lh-meta-pill">
                  📅 22/07/2026 • 08:30
                </span>
                <span className="lh-meta-pill">
                  🛡️ Mức độ: <strong style={{ color: "#dc2626" }}>Khẩn cấp</strong>
                </span>
              </div>
            </div>

            {/* NÚT XEM CHI TIẾT BÊN PHẢI */}
            <div className="lh-banner-action-col">
              <div className="lh-action-circle-btn">
                <SvgIcons.ArrowRight color="#dc2626" />
              </div>
              <span className="lh-action-txt">Xem chi tiết</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: TẤT CẢ LỊCH HỌP DẠNG DANH SÁCH KHỚP 100% ẢNH MẪU */}
        <section className="lh-all-section">
          <div className="lh-section-header">
            <h2 className="lh-section-heading">
              <span className="speaker-emoji">📢</span> TẤT CẢ THÔNG BÁO
            </h2>

            <div className="lh-sort-wrap">
              <select className="lh-sort-select">
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </div>
          </div>

          {/* CHIP LỌC THÔN */}
          <div className="lh-thon-chips-row">
            {THON_LIST.map((t) => (
              <button
                key={t}
                type="button"
                className={`lh-chip-btn ${filterThon === t ? "active" : ""}`}
                onClick={() => setFilterThon(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="lh-notices-list">
            {filteredEvents.map((item) => {
              const IconComp = item.icon;
              return (
                <div key={item.id} className="lh-notice-row-item" onClick={() => setActiveModal(item)}>
                  <div className={`lh-item-icon-box ${item.boxCls}`}>
                    <IconComp />
                  </div>

                  <div className="lh-item-body">
                    <div className="lh-item-badge-row">
                      <span className={`lh-cat-badge ${item.badgeCls}`}>{item.categoryLabel}</span>
                      <h3 className="lh-item-title">{item.title}</h3>
                    </div>
                    <div className="lh-item-date">{item.date} • {item.location}</div>
                  </div>

                  <div className={`lh-item-arrow-btn ${item.arrowCls}`}>
                    <SvgIcons.ArrowRight color={item.arrowColor} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* NÚT XEM THÊM BO TRÒN TRUNG TÂM */}
          <div className="lh-load-more-wrap">
            <button type="button" className="lh-load-more-btn">
              <span>Xem thêm thông báo</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </section>
      </div>

      {/* MODAL CHI TIẾT SỰ KIỆN */}
      {activeModal && (
        <div className="lh-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="lh-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="lh-modal-close" onClick={() => setActiveModal(null)}>✕</button>
            <span className="lh-modal-badge">{activeModal.categoryLabel}</span>
            <h2 className="lh-modal-title">{activeModal.title}</h2>
            <p className="lh-modal-meta">📅 {activeModal.date} • 🏛️ {activeModal.location}</p>
            <p className="lh-modal-desc">
              Ủy ban nhân dân xã Đăk Pxi thông báo đến toàn thể bà con nhân dân và cán bộ chuyên môn thu xếp thời gian tham dự đúng giờ.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}