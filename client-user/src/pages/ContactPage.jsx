import React from "react";
import { Link } from "react-router-dom";
import "./ContactPage.css";

/* ════════════════════════════════════════════════════════════════
   PURE HTML5 STANDARD SVG ICONS (CHUẨN HTML5 SVG VECTOR)
   ════════════════════════════════════════════════════════════════ */
const SvgIcons = {
  PhoneHeader: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      <path d="M15 2a6 6 0 0 1 6 6" />
      <path d="M15 6a2 2 0 0 1 2 2" />
    </svg>
  ),
  Building: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
    </svg>
  ),
  MapPin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Map: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  ),
  ShieldAlert: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Calendar: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  CheckCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

export default function ContactPage() {
  return (
    <div className="contact-page-root">
      {/* ── HEADER CHÍNH THỨC ── */}
      <header className="contact-header">
        <div className="contact-header-inner">
          <div className="contact-brand">
            <div className="contact-brand-icon">
              <SvgIcons.PhoneHeader />
            </div>
            <div className="contact-brand-text">
              <h1>Liên hệ & Hỗ trợ Nhân dân</h1>
              <p>Thông tin liên hệ chính thức, địa chỉ trụ sở làm việc và đường dây nóng hỗ trợ công dân.</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── BREADCRUMB ── */}
      <nav className="contact-breadcrumb">
        <div className="contact-breadcrumb-inner">
          <Link to="/">Trang chủ</Link>
          <span className="sep">›</span>
          <span className="current">Liên hệ & Hỗ trợ</span>
        </div>
      </nav>

      {/* ── MAIN CONTENT (KHÔNG BẢN ĐỒ - KHÔNG FORM PHẢN ÁNH) ── */}
      <main className="contact-main-container">
        
        {/* THÔNG TIN LIÊN HỆ CHÍNH THỨC (FULL WIDTH CARD) */}
        <section className="contact-info-card-panel contact-info-fullwidth">
          <div className="panel-header">
            <div className="panel-badge">THƯỜNG TRỰC CHÍNH THỨC</div>
            <h2>Thông tin Liên hệ & Trụ sở Hỗ trợ Công dân</h2>
            <p>Bộ phận Tiếp nhận & Trả kết quả Thủ tục Hành chính — Uỷ ban Nhân dân xã Đăk Pxi</p>
          </div>

          <div className="contact-details-grid">
            
            <div className="detail-item">
              <div className="icon-box blue">
                <SvgIcons.Building />
              </div>
              <div className="detail-content">
                <span className="detail-label">Cơ quan chủ quản & Quản lý:</span>
                <strong className="detail-value">Phòng Văn hóa - Xã hội & UBND xã Đăk Pxi</strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="icon-box red">
                <SvgIcons.MapPin />
              </div>
              <div className="detail-content">
                <span className="detail-label">Địa chỉ trụ sở làm việc:</span>
                <strong className="detail-value">Bộ phận Tiếp nhận và Trả kết quả TTHC xã Đăk Pxi, tỉnh Quảng Ngãi</strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="icon-box green">
                <SvgIcons.Phone />
              </div>
              <div className="detail-content">
                <span className="detail-label">Điện thoại Hotline tiếp dân:</span>
                <strong className="detail-value highlight-phone">
                  <a href="tel:0339310915">0339.310.915</a>
                </strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="icon-box purple">
                <SvgIcons.Mail />
              </div>
              <div className="detail-content">
                <span className="detail-label">Hòm thư Email công vụ:</span>
                <strong className="detail-value">
                  <a href="mailto:vhxh-dakpxi@quangngai.gov.vn">vhxh-dakpxi@quangngai.gov.vn</a>
                </strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="icon-box orange">
                <SvgIcons.Clock />
              </div>
              <div className="detail-content">
                <span className="detail-label">Thời gian làm việc & tiếp dân:</span>
                <strong className="detail-value">Thứ 2 – Thứ 6 (Sáng 7:30 – 11:30 | Chiều 13:30 – 17:00)</strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="icon-box teal">
                <SvgIcons.User />
              </div>
              <div className="detail-content">
                <span className="detail-label">Bộ phận thường trực hỗ trợ:</span>
                <strong className="detail-value">Chuyên viên Bộ phận Một cửa & Cán bộ Văn phòng</strong>
              </div>
            </div>

          </div>

        </section>

        {/* DẢI 4 CARD TÍNH NĂNG VÀ ĐƯỜNG DÂY NÓNG HỖ TRỢ */}
        <section className="contact-feature-cards">
          
          <div className="feature-card">
            <div className="card-icon-header gold">
              <SvgIcons.Calendar />
            </div>
            <h3>Lịch tiếp Công dân Định kỳ</h3>
            <p>Chủ tịch UBND xã tiếp dân định kỳ vào ngày <strong>Thứ 5 hàng tuần</strong> tại Phòng Tiếp công dân Trụ sở UBND xã.</p>
          </div>

          <div className="feature-card">
            <div className="card-icon-header blue">
              <SvgIcons.Map />
            </div>
            <h3>Trang Bản đồ Số Hành chính</h3>
            <p>Bản đồ vị trí trụ sở và mốc địa giới hành chính xã Đăk Pxi đã có giao diện riêng biệt trực quan.</p>
            <Link to="/ban-do" className="card-link">Truy cập Bản đồ ngay →</Link>
          </div>

          <div className="feature-card">
            <div className="card-icon-header red">
              <SvgIcons.ShieldAlert />
            </div>
            <h3>Đường dây nóng Khẩn cấp</h3>
            <p>
              Công an xã: <strong>0260.3891.113</strong><br />
              Trạm Y tế xã: <strong>0260.3891.115</strong><br />
              Cứu hộ PCCC: <strong>114</strong>
            </p>
          </div>

          <div className="feature-card">
            <div className="card-icon-header green">
              <SvgIcons.CheckCircle />
            </div>
            <h3>Đánh giá Mức độ Hài lòng</h3>
            <p>Bà con công dân sau khi làm thủ tục có thể đóng góp ý kiến về thái độ phục vụ của cán bộ Bộ phận Một cửa.</p>
          </div>

        </section>

      </main>

      {/* ── FOOTER CHUẨN HTML5 ── */}
      <footer className="contact-footer">
        <div className="contact-footer-inner">
          <div className="footer-left">
          </div>
          <div className="footer-right">
            <span>Phiên bản hệ thống: <strong>v2.4.0 (HTML5 Standard)</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
