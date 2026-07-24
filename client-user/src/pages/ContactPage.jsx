import { Link } from "react-router-dom";
import "./ContactPage.css";
import ContactCard from "../components/ContactCard";
import GoogleMap from "../components/GoogleMap";
import FeedbackForm from "../components/FeedbackForm";

const SvgPhoneCall = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export default function ContactPage() {
  return (
    <div className="contact-page-root">
      {/* ── HEADER TRANG LIÊN HỆ ── */}
      <header className="contact-header">
        <div className="contact-header-inner">
          <div className="contact-brand">
            <div className="contact-brand-icon">
              <SvgPhoneCall />
            </div>
            <div className="contact-brand-text">
              <span className="sub-title">CỔNG THÔNG TIN ĐIỆN TỬ UBND XÃ ĐẮK PXI</span>
              <h1>Liên hệ & Hỗ trợ Nhân dân</h1>
              <p>Thông tin liên hệ chính thức, địa chỉ trụ sở và kênh tiếp nhận góp ý của nhân dân xã Đăk Pxi.</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── BREADCRUMB ── */}
      <nav className="contact-breadcrumb">
        <div className="contact-breadcrumb-inner">
          <Link to="/">Trang chủ</Link>
          <span className="sep">›</span>
          <span className="current">Liên hệ</span>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="contact-main-container">
        {/* GRID THÔNG TIN LIÊN HỆ & GOOGLE MAPS NHÚNG */}
        <div className="contact-top-grid">
          <ContactCard />
          <GoogleMap />
        </div>

        {/* FORM GÓP Ý Ở CUỐI TRANG */}
        <div className="contact-feedback-section">
          <FeedbackForm />
        </div>
      </main>

      {/* ── FOOTER ĐỒNG BỘ ── */}
      <footer className="contact-footer">
        <div className="contact-footer-inner">
          <div className="footer-left">
            <p><strong>© Phòng Văn hóa - Xã hội UBND xã Đăk Pxi</strong></p>
            <p>Đơn vị quản lý website: UBND xã Đăk Pxi, tỉnh Quảng Ngãi</p>
          </div>
          <div className="footer-right">
            <span>Phiên bản hệ thống: <strong>v2.4.0 (HTML5 Standard)</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
