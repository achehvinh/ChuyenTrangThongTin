import { Link } from "react-router-dom";
import "./HelpPage.css";
import FAQAccordion from "../components/FAQAccordion";

const SvgIcons = {
  Help: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  FileText: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Sprout: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 20h10" />
      <path d="M10 20c0-4.3 1.4-7 4-10 1.2-1.4 2.8-2.3 4-2.6-1.7 4-1.7 7.7-1 12.6" />
      <path d="M14 20c0-3 .5-5.5 2-8 1.5-2.5 3.5-4 5-4.5-1.5 3.5-1.2 7-.5 12.5" />
    </svg>
  ),
  Megaphone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  ),
  Bot: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="12" x="3" y="8" rx="2" />
      <path d="M12 2v6" />
      <circle cx="8" cy="14" r="1.5" />
      <circle cx="16" cy="14" r="1.5" />
    </svg>
  ),
  Video: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect width="15" height="14" x="1" y="5" rx="2" ry="2" />
    </svg>
  ),
  Pdf: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Image: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  ),
  Phone: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
};

export default function HelpPage() {
  return (
    <div className="help-page-root">
      {/* ── HEADER TRANG TRỢ GIÚP ── */}
      <header className="help-header">
        <div className="help-header-inner">
          <div className="help-brand">
            <div className="help-brand-icon">
              <SvgIcons.Help />
            </div>
            <div className="help-brand-text">
              <span className="sub-title">CỔNG THÔNG TIN ĐIỆN TỬ UBND XÃ ĐẮK PXI</span>
              <h1>Trung tâm trợ giúp</h1>
              <p>Hỗ trợ người dân tra cứu và sử dụng các chức năng trên website một cách dễ dàng và nhanh chóng.</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── BREADCRUMB ── */}
      <nav className="help-breadcrumb">
        <div className="help-breadcrumb-inner">
          <Link to="/">Trang chủ</Link>
          <span className="sep">›</span>
          <span className="current">Trung tâm trợ giúp</span>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="help-main-container">
        {/* NHÓM 1: HƯỚNG DẪN SỬ DỤNG WEBSITE */}
        <section className="help-section">
          <div className="help-section-title">
            <h2>📌 Hướng dẫn sử dụng website</h2>
            <p>Chọn chức năng bà con muốn xem hướng dẫn chi tiết</p>
          </div>

          <div className="help-guide-grid">
            <Link to="/thu-tuc-hanh-chinh" className="guide-card">
              <div className="guide-icon blue">
                <SvgIcons.FileText />
              </div>
              <div className="guide-info">
                <h3>Tra cứu thủ tục hành chính</h3>
                <p>Hướng dẫn xem thành phần hồ sơ, lệ phí, quy trình làm Giấy khai sinh, Sổ đỏ, Khai tử, Đăng ký kết hôn.</p>
              </div>
            </Link>

            <Link to="/huong-dan-bhxh" className="guide-card">
              <div className="guide-icon green">
                <SvgIcons.Shield />
              </div>
              <div className="guide-info">
                <h3>Tra cứu BHYT & BHXH</h3>
                <p>Cách kiểm tra thời hạn thẻ Bảo hiểm Y tế, quyền lợi khám chữa bệnh và thủ tục cấp thẻ BHYT miễn phí cho hộ nghèo.</p>
              </div>
            </Link>

            <Link to="/gia-nong-san" className="guide-card">
              <div className="guide-icon orange">
                <SvgIcons.Sprout />
              </div>
              <div className="guide-info">
                <h3>Tra cứu giá nông sản</h3>
                <p>Cập nhật giá tham khảo hằng ngày các mặt hàng Cà phê, Tiêu, Mì (Sắn), Lúa rẫy trên địa bàn xã Đăk Pxi.</p>
              </div>
            </Link>

            <Link to="/chuyen-muc" className="guide-card">
              <div className="guide-icon purple">
                <SvgIcons.Megaphone />
              </div>
              <div className="guide-info">
                <h3>Xem tin tuyên truyền</h3>
                <p>Tra cứu thông tin Chuyển đổi số, Bầu cử, Phòng chống thiên tai, An toàn giao thông, Phòng chống đuối nước.</p>
              </div>
            </Link>

            <div className="guide-card">
              <div className="guide-icon teal">
                <SvgIcons.Bot />
              </div>
              <div className="guide-info">
                <h3>Sử dụng Trợ lý AI</h3>
                <p>Nhấp nút nổi "Hỏi thủ tục AI" ở góc màn hình để được Trợ lý AI giải đáp thắc mắc thủ tục tự động 24/7.</p>
              </div>
            </div>
          </div>
        </section>

        {/* NHÓM 2: CÂU HỎI THƯỜNG GẶP (FAQ ACCORDION) */}
        <section className="help-section">
          <div className="help-section-title">
            <h2>📖 Câu hỏi thường gặp (FAQ)</h2>
            <p>Các thắc mắc phổ biến của cử tri và bà con nhân dân khi tra cứu thông tin</p>
          </div>

          <FAQAccordion />
        </section>

        {/* NHÓM 3: HƯỚNG DẪN NHANH */}
        <section className="help-section">
          <div className="help-section-title">
            <h2>🎥 Hướng dẫn nhanh theo định dạng</h2>
            <p>Bà con có thể chọn xem hướng dẫn qua Video, Tài liệu PDF hoặc Hình ảnh minh họa</p>
          </div>

          <div className="quick-media-buttons">
            <Link to="/video" className="media-btn btn-video">
              <SvgIcons.Video />
              <span>Video hướng dẫn</span>
            </Link>

            <a href="/docs/huong-dan-su-dung-cong-thong-tin.pdf" target="_blank" rel="noreferrer" className="media-btn btn-pdf">
              <SvgIcons.Pdf />
              <span>Tài liệu PDF</span>
            </a>

            <Link to="/thu-vien-anh" className="media-btn btn-img">
              <SvgIcons.Image />
              <span>Hướng dẫn bằng hình ảnh</span>
            </Link>
          </div>
        </section>

        {/* NHÓM 4: CẦN HỖ TRỢ THÊM */}
        <section className="help-support-box">
          <div className="support-content">
            <h2>🆘 Bà con vẫn cần hỗ trợ thêm?</h2>
            <p>Nếu chưa tìm thấy câu trả lời, bà con có thể liên hệ trực tiếp cán bộ Bộ phận Một cửa UBND xã Đăk Pxi.</p>
          </div>
          <Link to="/lien-he" className="support-action-btn">
            <SvgIcons.Phone />
            <span>Liên hệ cán bộ</span>
          </Link>
        </section>
      </main>

      {/* ── FOOTER ĐỒNG BỘ ── */}
      <footer className="help-footer">
        <div className="help-footer-inner">
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
