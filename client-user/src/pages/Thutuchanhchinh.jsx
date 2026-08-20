import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Thutuchanhchinh.css";
import {
  api,
  API_BASE_URL,
  FIELD_GROUPS,
  PAGE_SIZE,
  MOCK_PROCEDURES,
  getCatalogProcedures,
  USE_MOCK_FALLBACK,
  normalizeList,
  formatFileSize,
  filterMockProcedures,
} from "../utils/procedureUtils";

// ── BỘ ICON SVG CHUẨN HTML5 ──
const SvgIcons = {
  Edit: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  FileText: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
  Download: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  ChevronUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  Printer: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect width="12" height="8" x="6" y="14" />
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Share: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  MapPin: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Phone: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Mail: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Bot: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="12" x="3" y="8" rx="2" />
      <path d="M12 2v6" />
      <circle cx="8" cy="14" r="1.5" />
      <circle cx="16" cy="14" r="1.5" />
      <path d="M9 18h6" />
    </svg>
  ),
  Flame: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3Z" />
    </svg>
  ),
  Star: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Sparkle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  ),
  Building: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  ),
};

// ── 9. THÔNG TIN NHANH THANH TOP ──
function QuickInfoBar() {
  return (
    <div className="tthc-top-bar">
      <div className="tthc-top-bar-inner">
        <div className="tthc-top-item">
          <SvgIcons.Clock />
          <span>Thời gian: T2 – T6 (7:30–11:30 | 13:30–17:00)</span>
        </div>
        <div className="tthc-top-item">
          <SvgIcons.MapPin />
          <span>Bộ phận Tiếp nhận & Trả kết quả TTHC</span>
        </div>
        <div className="tthc-top-item">
          <SvgIcons.Phone />
          <span>Hotline: <a href="tel:0339310915">0339.310.915</a></span>
        </div>
        <div className="tthc-top-item">
          <SvgIcons.Mail />
          <span>Email: vhxh-dakpxi@quangngai.gov.vn</span>
        </div>
      </div>
    </div>
  );
}

// ── 1. COMPACT GOV HEADER ──
function CompactGovHeader() {
  return (
    <header className="tthc-header">
      <div className="tthc-header-inner">
        <div className="tthc-brand">
          <img
            src="https://inviva.vn/wp-content/uploads/2026/05/logo-chung-tay-cai-cach-thu-tuc-hanh-chinh-vector-03.png"
            alt="Logo Quốc huy / UBND"
            className="tthc-logo"
          />
          <div className="tthc-brand-titles">
            <span className="tthc-sub-gov">PHÒNG VH-XH</span>
            <span className="tthc-main-gov">Tra cứu thủ tục hành chính</span>
          </div>
        </div>

        <nav className="tthc-nav">
          <Link to="/" className="tthc-nav-link">Trang chủ</Link>
          <Link to="/huong-dan" className="tthc-nav-link">Trợ giúp</Link>
          <a href="tel:0339310915" className="tthc-nav-link">Liên hệ</a>
        </nav>
      </div>
    </header>
  );
}

// ── 2. THANH TÌM KIẾM TOÀN CHIỀU NGANG ──
function SearchBar({ keyword, setKeyword, onSearch }) {
  return (
    <div className="tthc-search-bar-wrap">
      <form
        className="tthc-search-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <input
          type="text"
          className="tthc-search-input"
          placeholder="Tìm kiếm thủ tục theo tên hoặc từ khóa (ví dụ: khai sinh, sổ đỏ, hộ nghèo, kết hôn...)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {keyword && (
          <button type="button" className="tthc-search-clear-btn" onClick={() => setKeyword('')}>
            ✕
          </button>
        )}
        <button type="submit" className="tthc-search-submit-btn">
          <SvgIcons.Search />
          <span>Tra cứu</span>
        </button>
      </form>
    </div>
  );
}

// ── 3. BỘ LỌC CHIP HÀNG NGANG ──
function CategoryFilter({ groups, activeId, counts, onSelect }) {
  return (
    <nav className="tthc-chip-filter">
      <button
        type="button"
        className={`tthc-chip ${!activeId ? "is-active" : ""}`}
        onClick={() => onSelect("")}
      >
        Tất cả ({counts.all ?? 0})
      </button>
      {groups.map((g) => {
        const count = counts[g.id] ?? 0;
        return (
          <button
            type="button"
            key={g.id}
            className={`tthc-chip ${activeId === g.id ? "is-active" : ""}`}
            onClick={() => onSelect(g.id)}
          >
            {g.name} ({count})
          </button>
        );
      })}
    </nav>
  );
}

// ── 4. THỐNG KÊ NHANH (4 CARDS) ──
function QuickStats({ totalCount, popularCount, mostViewedCount, recentCount, onSelectFilter }) {
  return (
    <div className="tthc-quick-stats">
      <div className="tthc-stat-card" onClick={() => onSelectFilter('all')}>
        <div className="stat-icon-wrap stat-blue">
          <SvgIcons.FileText />
        </div>
        <div className="stat-info">
          <span className="stat-val">{totalCount}</span>
          <span className="stat-lbl">Tổng thủ tục</span>
        </div>
      </div>

      <div className="tthc-stat-card" onClick={() => onSelectFilter('popular')}>
        <div className="stat-icon-wrap stat-orange">
          <SvgIcons.Flame />
        </div>
        <div className="stat-info">
          <span className="stat-val">{popularCount}</span>
          <span className="stat-lbl">Thủ tục phổ biến</span>
        </div>
      </div>

      <div className="tthc-stat-card" onClick={() => onSelectFilter('viewed')}>
        <div className="stat-icon-wrap stat-green">
          <SvgIcons.Star />
        </div>
        <div className="stat-info">
          <span className="stat-val">{mostViewedCount}</span>
          <span className="stat-lbl">Được xem nhiều</span>
        </div>
      </div>

      <div className="tthc-stat-card" onClick={() => onSelectFilter('recent')}>
        <div className="stat-icon-wrap stat-purple">
          <SvgIcons.Sparkle />
        </div>
        <div className="stat-info">
          <span className="stat-val">{recentCount}</span>
          <span className="stat-lbl">Mới cập nhật</span>
        </div>
      </div>
    </div>
  );
}

// ── TOAST NOTIFICATION 5-SECOND HTML5 (THÔNG BÁO DƯỚI PHẢI 5 GIÂY) ──
function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  const renderToastSvgIcon = () => {
    if (toast.type === 'danger' || toast.icon === 'trash') return <SvgIcons.Trash />;
    if (toast.type === 'info' || toast.icon === 'edit') return <SvgIcons.Edit />;
    if (toast.icon === 'qr' || toast.icon === 'file') return <SvgIcons.FileText />;
    return <SvgIcons.Check />;
  };

  return (
    <div className="tthc-toast-container">
      <aside className={`tthc-toast-box toast-${toast.type || 'success'}`} role="alert" aria-live="polite">
        <span className="tthc-toast-icon">
          {renderToastSvgIcon()}
        </span>
        <div className="tthc-toast-body">
          <strong>{toast.title || 'Thông báo hệ thống'}</strong>
          <p>{toast.message}</p>
        </div>
        <button type="button" className="tthc-toast-close" onClick={onClose} aria-label="Đóng thông báo">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {/* Thanh đếm ngược 5 giây chuẩn HTML5 CSS Animation */}
        <div className="tthc-toast-progress" />
      </aside>
    </div>
  );
}

// ── 5 & 7. CARD THỦ TỤC NGANG COMPACT + ACCORDION XEM NHANH ──
function ProcedureCard({ item, expanded, onToggleExpand, onEdit, onDelete, onActionToast, isOfficer }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/thu-tuc-hanh-chinh/${item.slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    if (onActionToast) {
      onActionToast("Đã sao chép liên kết", `Đã lưu đường dẫn thủ tục [MÃ: ${item.code || `TTHC-${item.id}`}] vào bộ nhớ tạm!`, "success", "📋");
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = (e) => {
    e.stopPropagation();
    if (onActionToast) {
      onActionToast("Đã gửi lệnh in tài liệu", `Đang gửi bản in thủ tục [${item.title}] sang máy in...`, "info", "🖨️");
    }
    window.print();
  };

  const realDvcUrl = (item.guideLink && item.guideLink.startsWith("http"))
    ? item.guideLink
    : `https://dichvucong.gov.vn/p/home/dvc-tthc-danh-sach.html?keyword=${encodeURIComponent(item.code || item.title || item.id)}`;

  return (
    <article className={`tthc-card-item ${expanded ? "is-expanded" : ""}`}>
      {/* KHUNG THÔNG TIN CHÍNH (FULL HORIZONTAL ROW Y HỆT CÁN BỘ) */}
      <div className="tthc-card-main" onClick={onToggleExpand} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", flexWrap: "wrap", padding: "18px 22px" }}>
        
        {/* CỘT 1: THÔNG TIN CHÍNH TTHC */}
        <div className="tthc-card-left" style={{ flex: "1 1 360px", minWidth: "280px" }}>
          <div className="tthc-card-header-row" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
            <span style={{ background: "#0284c7", color: "#ffffff", fontWeight: "900", fontSize: "12px", padding: "3px 10px", borderRadius: "6px" }}>
              MÃ: {item.code || `TTHC-${item.id}`}
            </span>
            {item.online_type === "toan-trinh" && (
              <span className="tthc-badge toan-trinh">Dịch vụ công Trực tuyến toàn trình (Mức 4)</span>
            )}
            {item.online_type === "mot-phan" && (
              <span className="tthc-badge mot-phan">Dịch vụ công Trực tuyến một phần (Mức 3)</span>
            )}
          </div>

          <h3 className="tthc-card-title" style={{ fontSize: "16.5px", fontWeight: "900", color: "#0f172a", margin: "0 0 8px", lineHeight: "1.4" }}>
            <a
              href={realDvcUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#0f172a", textDecoration: "none", transition: "color 0.2s ease" }}
              onMouseEnter={(e) => (e.target.style.color = "#0284c7")}
              onMouseLeave={(e) => (e.target.style.color = "#0f172a")}
              onClick={(e) => e.stopPropagation()}
              title="Nhấn để nộp hồ sơ trực tuyến trên Cổng Dịch vụ công Quốc gia"
            >
              {item.title} <span style={{ color: "#0284c7", fontSize: "14px" }}>↗</span>
            </a>
          </h3>

          <div className="tthc-card-meta-row" style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", fontSize: "12.5px", color: "#64748b" }}>
            <span className="tthc-meta-item">
              <SvgIcons.Building />
              <span><strong>Lĩnh vực:</strong> {item.group_name || 'Hành chính xã'}</span>
            </span>
            <span className="tthc-meta-sep">•</span>
            <span className="tthc-meta-item">
              <SvgIcons.MapPin />
              <span><strong>Nơi xử lý:</strong> {item.agency && !item.agency.includes("UBND xã") ? item.agency : 'Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)'}</span>
            </span>
            <span className="tthc-meta-sep">•</span>
            <span className="tthc-meta-item">
              <SvgIcons.Clock />
              <span><strong>Thời gian:</strong> {item.processing_time || 'Theo quy định hiện hành (01 – 05 ngày làm việc)'}</span>
            </span>
          </div>
        </div>

        {/* CỘT 2: KHUNG MÃ QR CODE TRỰC TIẾP SANG CỔNG DVC THẬT */}
        <a
          href={realDvcUrl}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "none" }}
          onClick={(e) => {
            e.stopPropagation();
            if (onActionToast) {
              onActionToast("Đang chuyển Cổng DVC Quốc gia", `Mã QR sẽ mở trực tiếp trang nộp hồ sơ DVC thực tế cho thủ tục [MÃ: ${item.code || `TTHC-${item.id}`}]!`, "info", "qr");
            }
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f0f9ff", border: "1.5px dashed #0284c7", padding: "8px 14px", borderRadius: "14px", flexShrink: 0, cursor: "pointer", transition: "all 0.2s ease" }}
            title="Click để nộp hồ sơ trực tuyến trên Cổng Dịch vụ công Quốc gia"
          >
            <div style={{ background: "#ffffff", padding: "4px", borderRadius: "8px", border: "1px solid #bae6fd" }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(realDvcUrl)}`}
                alt={`Mã QR DVC ${item.title}`}
                style={{ width: "64px", height: "64px", display: "block", borderRadius: "4px" }}
              />
            </div>
            <div style={{ maxWidth: "120px" }}>
              <span style={{ fontSize: "11px", fontWeight: "900", color: "#005baa", textTransform: "uppercase", display: "block", marginBottom: "2px" }}>
                📲 QUÉT MÃ QR
              </span>
              <span style={{ fontSize: "11.5px", color: "#0369a1", fontWeight: "800", display: "block", lineHeight: "1.3" }}>
                Nộp hồ sơ trực tuyến DVC ➔
              </span>
            </div>
          </div>
        </a>

        {/* CỘT 3: NÚT THAO TÁC (SỬA/XÓA KHI LÀ CÁN BỘ) */}
        {isOfficer && (
          <div className="tthc-card-actions" style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                style={{ padding: "6px 14px", background: "#f8fafc", border: "1.5px solid #cbd5e1", borderRadius: "8px", fontSize: "12.5px", fontWeight: "800", color: "#334155", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", transition: "all 0.2s ease" }}
                onClick={() => {
                  if (onEdit) onEdit(item);
                }}
              >
                <SvgIcons.Edit />
                <span>Sửa</span>
              </button>

              <button
                type="button"
                style={{ padding: "6px 14px", background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: "8px", fontSize: "12.5px", fontWeight: "800", color: "#dc2626", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", transition: "all 0.2s ease" }}
                onClick={() => {
                  if (onDelete) onDelete(item);
                }}
              >
                <SvgIcons.Trash />
                <span>Xóa</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 7. ACCORDION XEM NHANH HIỂN THỊ NGAY DƯỚI CARD */}
      {expanded && (
        <section className="tthc-card-accordion-body">
          <div className="tthc-accordion-grid">
            <div className="tthc-acc-col">
              <h4>📋 Thành phần hồ sơ cần có</h4>
              <p>{item.required_documents || 'Giấy tờ tùy thân (CCCD đính kèm VNeID) và file Tờ khai điện tử theo mẫu quy định.'}</p>
            </div>

            <div className="tthc-acc-col">
              <h4>💰 Lệ phí & Điều kiện</h4>
              <p><strong>Lệ phí:</strong> {item.fee || 'Theo quy định hiện hành / Miễn phí 100%'}</p>
              <p className="mt-1"><strong>Đối tượng:</strong> {item.conditions_text && !item.conditions_text.includes("xã Đăk Pxi") ? item.conditions_text : 'Công dân, cá nhân và tổ chức thực hiện trực tuyến trên toàn quốc'}</p>
            </div>

            <div className="tthc-acc-col">
              <h4>🌐 Hướng dẫn nộp hồ sơ trực tuyến qua Mã QR & Link liên kết</h4>
              <ol className="tthc-acc-steps-list" style={{ margin: 0, paddingLeft: "18px", fontSize: "12.5px", color: "#334155", lineHeight: "1.6" }}>
                <li><strong>Bước 1 (Mở trang DVC):</strong> Quét <strong>Mã QR Code</strong> (ô nét đứt màu xanh ở trên) hoặc <strong>Click trực tiếp vào ô Mã QR</strong> để truy cập ngay trang nộp hồ sơ thực tế của thủ tục [MÃ: <strong>{item.code || 'chính thức'}</strong>] trên Cổng DVC Quốc gia.</li>
                <li><strong>Bước 2 (Đăng nhập VNeID):</strong> Đăng nhập tài khoản bằng <strong>VNeID Định danh điện tử (Mức 2)</strong>.</li>
                <li><strong>Bước 3 (Tải hồ sơ & Nộp):</strong> Hệ thống tự động điền Tờ khai điện tử; đính kèm file tài liệu (PDF/Ảnh) và chọn <strong>"Nộp hồ sơ"</strong>.</li>
                <li><strong>Bước 4 (Theo dõi & Nhận KQ):</strong> Nhận Mã hồ sơ trực tuyến để tra cứu tiến trình thụ lý và nhận kết quả bản điện tử qua VNeID/Kho dữ liệu công dân hoặc qua bưu chính.</li>
              </ol>
            </div>
          </div>

          <div className="tthc-acc-footer-tools">
            {item.forms && item.forms.length > 0 && (
              <div className="tthc-acc-forms">
                <strong>Danh sách biểu mẫu:</strong>
                {item.forms.map((f) => (
                  <a
                    key={f.id}
                    href={f.src || `${API_BASE_URL}/forms/${f.id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="tthc-acc-form-link"
                  >
                    <SvgIcons.Download />
                    <span>{f.title} ({formatFileSize(f.file_size || f.fileSize || 25600)})</span>
                  </a>
                ))}
              </div>
            )}

            <div className="tthc-acc-buttons">
              <button type="button" className="tthc-acc-tool-btn" onClick={handlePrint}>
                <SvgIcons.Printer />
                <span>In thủ tục</span>
              </button>
              <button type="button" className="tthc-acc-tool-btn" onClick={handleCopy}>
                {copied ? <SvgIcons.Check /> : <SvgIcons.Copy />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép liên kết'}</span>
              </button>
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

// ── EXPORTED COMPONENTS FOR SUB-PAGES (ThuTucChiTiet) ──

export function StepGuide({ procedure, sessionId }) {
  const [progress, setProgress] = useState({});
  const steps = procedure.steps || [];

  useEffect(() => {
    if (!procedure.id || !sessionId) return;
    api
      .get(`/progress/${sessionId}/${procedure.id}`)
      .then((res) => {
        const next = {};
        normalizeList(res.data).forEach((row) => {
          next[row.step_id || row.stepId] = Boolean(row.is_completed || row.isCompleted);
        });
        setProgress(next);
      })
      .catch(() => setProgress({}));
  }, [procedure.id, sessionId]);

  async function toggleStep(step) {
    const nextValue = !progress[step.id];
    setProgress((prev) => ({ ...prev, [step.id]: nextValue }));
    try {
      await api.put(`/progress/${sessionId}/steps/${step.id}`, {
        procedureId: procedure.id,
        isCompleted: nextValue,
      });
    } catch {
      /* giữ trạng thái đã bấm trên màn hình */
    }
  }

  const completed = steps.filter((s) => progress[s.id]).length;
  const percent = steps.length ? Math.round((completed / steps.length) * 100) : 0;

  return (
    <section className="tthc-detail-section">
      <h3>Các bước cần làm ({completed}/{steps.length} đã xong)</h3>
      <div className="tthc-progress-track">
        <div className="tthc-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="tthc-steps">
        {steps.map((step, index) => {
          const checked = Boolean(progress[step.id]);
          return (
            <div className={`tthc-step ${checked ? "is-done" : ""}`} key={step.id || index}>
              <button className="tthc-step-check" type="button" onClick={() => toggleStep(step)}>
                {checked ? "✓" : index + 1}
              </button>
              <div>
                <h4>{step.title || `Bước ${index + 1}`}</h4>
                <p>{step.content || step.detail}</p>
                {step.note && <small>Lưu ý: {step.note}</small>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function FormDownloadList({ forms = [] }) {
  if (!forms.length) {
    return (
      <section className="tthc-detail-section">
        <h3>Biểu mẫu cần tải</h3>
        <p className="tthc-muted">Thủ tục này không cần tải biểu mẫu nào.</p>
      </section>
    );
  }
  return (
    <section className="tthc-detail-section">
      <h3>Biểu mẫu cần tải</h3>
      <div className="tthc-forms">
        {forms.map((form) => (
          <a
            className="tthc-form-item"
            href={form.src || `${API_BASE_URL}/forms/${form.id}/download`}
            key={form.id}
            target="_blank"
            rel="noreferrer"
          >
            <span className="tthc-file-type">{form.file_type || form.fileType || 'DOC'}</span>
            <span>
              <strong>{form.title}</strong>
              <small>{formatFileSize(form.file_size || form.fileSize)}</small>
            </span>
            <b>Tải về</b>
          </a>
        ))}
      </div>
    </section>
  );
}

export function QuestionBox({ procedureId }) {
  const [form, setForm] = useState({ fullName: "", phone: "", question: "" });
  const [status, setStatus] = useState("");

  async function submitQuestion(e) {
    e.preventDefault();
    setStatus("Đang gửi...");
    try {
      await api.post("/questions", { procedureId, ...form });
      setForm({ fullName: "", phone: "", question: "" });
      setStatus("Đã gửi. Cán bộ xã sẽ gọi lại để trả lời.");
    } catch {
      setStatus("Chưa gửi được. Bà con vui lòng đến trực tiếp Bộ phận Một cửa.");
    }
  }

  return (
    <section className="tthc-detail-section">
      <h3>Chưa rõ chỗ nào? Gửi câu hỏi</h3>
      <form className="tthc-question-form" onSubmit={submitQuestion}>
        <div className="tthc-form-grid">
          <label>
            Họ và tên
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
            />
          </label>
          <label>
            Số điện thoại
            <input
              required
              inputMode="tel"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </label>
        </div>
        <label>
          Câu hỏi của bà con
          <textarea
            required
            rows={4}
            value={form.question}
            onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
          />
        </label>
        <button className="tthc-primary-btn" type="submit">
          Gửi câu hỏi
        </button>
        {status && <p className="tthc-form-status">{status}</p>}
      </form>
    </section>
  );
}

export function RatingBox({ procedureId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  async function submitRating(e) {
    e.preventDefault();
    setStatus("Đang gửi đánh giá...");
    try {
      await api.post("/reviews", { procedureId, rating, comment: comment.trim() });
      setComment("");
      setStatus("Cảm ơn bà con đã góp ý.");
    } catch {
      setStatus("Chưa gửi được đánh giá. Bà con thử lại sau.");
    }
  }

  return (
    <section className="tthc-detail-section">
      <h3>Hướng dẫn này có dễ hiểu không?</h3>
      <form className="tthc-rating-box" onSubmit={submitRating}>
        <div className="tthc-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              className={star <= rating ? "is-active" : ""}
              key={star}
              type="button"
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          rows={3}
          placeholder="Góp ý để xã hướng dẫn rõ hơn..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="tthc-secondary-btn" type="submit">
          Gửi đánh giá
        </button>
        {status && <p className="tthc-form-status">{status}</p>}
      </form>
    </section>
  );
}

// ── MAIN COMPONENT ──
export default function Thutuchanhchinh() {
  const navigate = useNavigate();
  const [procedures, setProcedures] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [groupCounts, setGroupCounts] = useState({});
  const [keyword, setKeyword] = useState("");
  const [groupId, setGroupId] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("stt");
  const [expandedId, setExpandedId] = useState(null);
  const [statFilter, setStatFilter] = useState("all");

  // TOAST NOTIFICATION STATE (5 GIÂY TỰ ĐỘNG MẤT - DƯỚI PHẢI GIAO DIỆN)
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = (title, message, type = 'success', icon = '✅') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ title, message, type, icon });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const getDeletedKeys = () => {
    try {
      return JSON.parse(localStorage.getItem("DAK_PXI_DELETED_TTHC_IDS") || "[]");
    } catch {
      return [];
    }
  };

  const filterOutDeleted = (list) => {
    const deleted = getDeletedKeys();
    if (!deleted || deleted.length === 0) return list;
    return list.filter(p => !deleted.includes(String(p.id)));
  };

  const handleEditProcedure = (item) => {
    showToast(
      "Mở trình chỉnh sửa",
      `Đang mở giao diện chỉnh sửa thủ tục [MÃ: ${item.code || `TTHC-${item.id}`}] - "${item.title}"`,
      "info",
      "edit"
    );
  };

  const handleDeleteProcedure = (item) => {
    const targetId = String(item.id);
    try {
      const deleted = getDeletedKeys();
      if (targetId && !deleted.includes(targetId)) {
        deleted.push(targetId);
      }
      localStorage.setItem("DAK_PXI_DELETED_TTHC_IDS", JSON.stringify(deleted));

      const savedCatalog = localStorage.getItem("DAK_PXI_TTHC_CATALOG");
      if (savedCatalog) {
        const catList = JSON.parse(savedCatalog);
        const nextCat = catList.filter(c => String(c.id) !== targetId);
        localStorage.setItem("DAK_PXI_TTHC_CATALOG", JSON.stringify(nextCat));
      }
    } catch {}

    setProcedures(prev => prev.filter(p => String(p.id) !== targetId));
    showToast(
      "Xóa thủ tục thành công",
      `Đã xóa đúng 1 thủ tục [${item.title}] khỏi hệ thống!`,
      "danger",
      "trash"
    );
  };

  // Tăng số lượng người truy cập vào xem TTHC thực tế
  useEffect(() => {
    try {
      const current = parseInt(localStorage.getItem("DAK_PXI_TTHC_VISITOR_COUNT") || "3842", 10);
      const nextCount = current + 1;
      localStorage.setItem("DAK_PXI_TTHC_VISITOR_COUNT", nextCount.toString());
    } catch {}
  }, []);

  // Load danh sách thủ tục từ MOCK_PROCEDURES & localStorage (Đảm bảo lưu giữ 100% dữ liệu 417 thủ tục)
  useEffect(() => {
    setLoading(true);

    let allCatalog = getCatalogProcedures();
    try {
      localStorage.setItem("DAK_PXI_TTHC_CATALOG", JSON.stringify(allCatalog));
    } catch {}

    const allActive = filterOutDeleted(allCatalog);

    // Tính toán chính xác số lượng thủ tục cho từng Lĩnh vực (Tổng số: 417 thủ tục)
    const counts = {};
    let totalAll = 0;
    FIELD_GROUPS.forEach((f) => {
      const groupTotal = allActive.filter(
        (p) => p.group_id === f.id || p.fieldGroup === f.id || p.fieldGroup === f.name || p.group_name === f.name
      ).length;
      counts[f.id] = groupTotal;
      totalAll += groupTotal;
    });
    counts.all = totalAll;
    setGroupCounts(counts);

    let filteredList = allActive;
    if (groupId) {
      filteredList = filteredList.filter(
        (p) => p.group_id === groupId || p.fieldGroup === groupId || p.fieldGroup === FIELD_GROUPS.find(g => g.id === groupId)?.name || p.group_name === FIELD_GROUPS.find(g => g.id === groupId)?.name
      );
    }
    if (keyword.trim()) {
      const q = keyword.trim().toLowerCase();
      filteredList = filteredList.filter(
        (p) => (p.title && p.title.toLowerCase().includes(q)) ||
               (p.code && p.code.toLowerCase().includes(q)) ||
               (p.summary && p.summary.toLowerCase().includes(q))
      );
    }

    setProcedures(filteredList);
    setTotalCount(filteredList.length);
    setLoading(false);
  }, [keyword, groupId, page]);



  // 8. THỦ TỤC PHỔ BIẾN (TOP 5 THỦ TỤC THỰC TẾ TỪ CÁN BỘ NIÊM YẾT)
  const popularProcedures = useMemo(() => {
    if (!procedures || procedures.length === 0) return [];
    return [...procedures]
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, 5);
  }, [procedures]);

  // Sắp xếp và lọc dữ liệu danh sách thủ tục (Mặc định: Sắp xếp theo STT từ 1 đến 417)
  const displayedProcedures = useMemo(() => {
    let list = [...procedures];

    if (statFilter === "popular") {
      list = list.filter(p => (p.view_count || 0) > 1000);
    } else if (statFilter === "viewed") {
      list = list.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    } else if (statFilter === "recent") {
      list = list.slice(0, 6);
    }

    if (sortBy === "az") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || "", 'vi'));
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.stt || 0) - (a.stt || 0));
    } else if (sortBy === "popular") {
      list.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    } else {
      // Mặc định: Thứ tự từ STT 1 đến 417
      list.sort((a, b) => (a.stt || 0) - (b.stt || 0));
    }

    return list;
  }, [procedures, statFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(displayedProcedures.length / PAGE_SIZE));
  const currentPageItems = useMemo(() => {
    return displayedProcedures.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [displayedProcedures, page]);

  return (
    <div className="tthc-app-root">
      <main className="tthc-main-container">
        {/* NÚT QUAY LẠI TRANG CHỦ */}
        <div style={{ marginBottom: "16px" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#ffffff",
              border: "1.5px solid #cbd5e1",
              color: "#005baa",
              padding: "8px 18px",
              borderRadius: "30px",
              fontSize: "13.5px",
              fontWeight: "800",
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            <span>Quay lại Trang chủ</span>
          </Link>
        </div>
        {/* HEADER CHÍNH THỨC UBND XÃ ĐĂK PXI NĂM 2026 */}
        <div style={{ textAlign: "center", background: "#ffffff", border: "1.5px solid #cbd5e1", borderRadius: "20px", padding: "22px 28px", marginBottom: "22px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "13px", fontWeight: "900", color: "#005baa", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
            PHÒNG VĂN HÓA – XÃ HỘI
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#003d7a", margin: "0 0 8px", lineHeight: "1.4", textTransform: "uppercase", letterSpacing: "-0.3px" }}>
            DANH MỤC THỦ TỤC HÀNH CHÍNH TẬP TRUNG
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap", margin: "8px 0 12px" }}>
            <span style={{ background: "#005baa", color: "#ffffff", padding: "4px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "900", textTransform: "uppercase" }}>
              NĂM 2026
            </span>
            <span style={{ background: "#f0fdf4", border: "1px solid #86efac", color: "#166534", padding: "4px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "900" }}>
              Phân loại theo 49 nhóm lĩnh vực • Tổng số: 417 thủ tục hành chính
            </span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#f0f9ff", border: "1.5px solid #bae6fd", color: "#0284c7", padding: "8px 20px", borderRadius: "30px", fontSize: "13.5px", fontWeight: "800", boxShadow: "0 2px 8px rgba(2, 132, 199, 0.08)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Quét hoặc Click mã QR code tương ứng để nộp hồ sơ trực tuyến DVC</span>
          </div>
        </div>

        {/* 2. THANH TÌM KIẾM TOÀN CHIỀU NGANG */}
        <SearchBar
          keyword={keyword}
          setKeyword={setKeyword}
          onSearch={() => setPage(1)}
        />

        {/* 3. BỘ LỌC CHIP HÀNG NGANG */}
        <CategoryFilter
          groups={FIELD_GROUPS}
          activeId={groupId}
          counts={groupCounts}
          onSelect={(id) => {
            setGroupId(id);
            setPage(1);
          }}
        />

        {/* 4. THỐNG KÊ NHANH (4 CARDS) */}
        <QuickStats
          totalCount={groupCounts.all || MOCK_PROCEDURES.length}
          popularCount={5}
          mostViewedCount={MOCK_PROCEDURES.filter(p => p.view_count > 1000).length}
          recentCount={4}
          onSelectFilter={(type) => {
            setStatFilter(type);
            setPage(1);
          }}
        />

        {/* 8. TOP 5 THỦ TỤC PHỔ BIẾN NHẤT */}
        {!groupId && !keyword && (
          <section className="tthc-top-popular-section">
            <div className="tthc-section-heading">
              <span className="tthc-heading-title">
                <SvgIcons.Flame />
                <span>Top những thủ tục được xem nhiều nhất</span>
              </span>
            </div>

            <div className="tthc-popular-chips-list">
              {popularProcedures.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  className="tthc-popular-chip-item"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                >
                  <span className="pop-rank">#{idx + 1}</span>
                  <span className="pop-title">{item.title}</span>
                  <span className="pop-views">({item.view_count || 1200} lượt xem)</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 5 & 6. DANH SÁCH THỦ TỤC + SẮP XẾP */}
        <section className="tthc-list-section">
          <div className="tthc-toolbar-row">
            <div className="tthc-toolbar-left">
              <h2>
                {groupId
                  ? FIELD_GROUPS.find((g) => g.id === groupId)?.name
                  : "Danh sách thủ tục hành chính"}
              </h2>
              <span className="tthc-count-badge">({displayedProcedures.length} kết quả)</span>
            </div>

            <div className="tthc-toolbar-right">
              <label htmlFor="sort-select" className="tthc-sort-label">Sắp xếp:</label>
              <select
                id="sort-select"
                className="tthc-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="stt">Thứ tự từ STT 1 đến 417 (Mặc định)</option>
                <option value="popular">Phổ biến nhất</option>
                <option value="newest">Mới nhất (Từ 417 đến 1)</option>
                <option value="az">Tên A – Z</option>
              </select>
            </div>
          </div>

          {/* DANH SÁCH CARDS COMPACT */}
          {loading ? (
            <div className="tthc-skeleton-wrap">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="tthc-skeleton-card" />
              ))}
            </div>
          ) : currentPageItems.length > 0 ? (
            <div className="tthc-cards-list">
              {currentPageItems.map((item) => (
                <ProcedureCard
                  key={item.id}
                  item={item}
                  expanded={expandedId === item.id}
                  onToggleExpand={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  onEdit={handleEditProcedure}
                  onDelete={handleDeleteProcedure}
                  onActionToast={showToast}
                  isOfficer={!!localStorage.getItem("admin_token")}
                />
              ))}
            </div>
          ) : (
            <div className="tthc-empty-box">
              <p className="tthc-empty-msg">Không tìm thấy thủ tục hành chính phù hợp với từ khóa "{keyword}".</p>
              <button
                type="button"
                className="tthc-btn-reset"
                onClick={() => {
                  setKeyword("");
                  setGroupId("");
                  setStatFilter("all");
                  showToast("Đã khôi phục danh sách", "Đã hiển thị toàn bộ danh sách thủ tục hành chính niêm yết!", "info", "🔄");
                }}
              >
                Xem lại tất cả thủ tục
              </button>
            </div>
          )}

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <nav className="tthc-pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ‹ Trang trước
              </button>
              <span>Trang {page} / {totalPages}</span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Trang sau ›
              </button>
            </nav>
          )}
        </section>
      </main>

      {/* 11. FOOTER THÔNG TIN DỮ LIỆU */}
      <footer className="tthc-footer">
        <div className="tthc-footer-inner">
          <div className="tthc-footer-meta">
            <span>Tổng số thủ tục: <strong>{totalCount || MOCK_PROCEDURES.length}</strong></span>
            <span className="sep">•</span>
            <span>Ngày cập nhật: <strong>24/07/2026</strong></span>
            <span className="sep">•</span>
            <span>Phiên bản dữ liệu: <strong>v2.4.0 (HTML5 Standard)</strong></span>
          </div>
        </div>
      </footer>

      {/* 12. THÔNG BÁO DƯỚI PHẢI GIAO DIỆN CHUẨN HTML5 (5 GIÂY TỰ MẤT) */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}