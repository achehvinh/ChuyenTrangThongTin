import "./ContactCard.css";

const SvgIcons = {
  Building: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
    </svg>
  ),
  MapPin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Phone: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Mail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Clock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Navigation: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  )
};

export default function ContactCard() {
  const mapDirectionsUrl = "https://maps.google.com/?q=UBND+Xã+Đăk+Pxi";

  return (
    <div className="contact-card">
      <div className="contact-card-header">
        <h3>Thông tin liên hệ UBND xã Đăk Pxi</h3>
        <p>Thường trực Bộ phận Một cửa & Văn phòng Hỗ trợ Nhân dân</p>
      </div>

      <div className="contact-info-list">
        <div className="contact-info-item">
          <div className="contact-icon blue">
            <SvgIcons.Building />
          </div>
          <div className="contact-text">
            <span className="label">Đơn vị quản lý:</span>
            <strong className="val">Phòng Văn hóa - Xã hội UBND xã Đăk Pxi</strong>
          </div>
        </div>

        <div className="contact-info-item">
          <div className="contact-icon red">
            <SvgIcons.MapPin />
          </div>
          <div className="contact-text">
            <span className="label">Địa chỉ trụ sở:</span>
            <strong className="val">Trụ sở UBND xã Đăk Pxi, tỉnh Quảng Ngãi</strong>
          </div>
        </div>

        <div className="contact-info-item">
          <div className="contact-icon green">
            <SvgIcons.Phone />
          </div>
          <div className="contact-text">
            <span className="label">Điện thoại Hotline:</span>
            <strong className="val"><a href="tel:0339310915">0339.310.915</a></strong>
          </div>
        </div>

        <div className="contact-info-item">
          <div className="contact-icon purple">
            <SvgIcons.Mail />
          </div>
          <div className="contact-text">
            <span className="label">Email công vụ:</span>
            <strong className="val"><a href="mailto:ubnddakpxi@quangngai.gov.vn">ubnddakpxi@quangngai.gov.vn</a></strong>
          </div>
        </div>

        <div className="contact-info-item">
          <div className="contact-icon orange">
            <SvgIcons.Clock />
          </div>
          <div className="contact-text">
            <span className="label">Giờ làm việc:</span>
            <strong className="val">Thứ 2 – Thứ 6 (7:30 – 11:30 | 13:30 – 17:00)</strong>
          </div>
        </div>

        <div className="contact-info-item">
          <div className="contact-icon teal">
            <SvgIcons.User />
          </div>
          <div className="contact-text">
            <span className="label">Người phụ trách:</span>
            <strong className="val">Công chức Văn hóa - Xã hội UBND xã Đăk Pxi</strong>
          </div>
        </div>
      </div>

      {/* CỤM NÚT THAO TÁC NHANH */}
      <div className="contact-action-btns">
        <a href="tel:0339310915" className="contact-btn btn-call">
          <SvgIcons.Phone />
          <span>Gọi ngay</span>
        </a>
        <a href="mailto:ubnddakpxi@quangngai.gov.vn" className="contact-btn btn-email">
          <SvgIcons.Mail />
          <span>Gửi Email</span>
        </a>
        <a href={mapDirectionsUrl} target="_blank" rel="noreferrer" className="contact-btn btn-map">
          <SvgIcons.Navigation />
          <span>Chỉ đường</span>
        </a>
      </div>
    </div>
  );
}
