import './InfoPages.css';

/* ═══════════════════════════════════════════════════════
   THÔNG TIN
═══════════════════════════════════════════════════════ */
export function ThongTinPage() {
  const articles = [
    {
      icon: '📋',
      title: 'Quyền lợi của người tham gia BHYT',
      desc: 'Người tham gia BHYT được hưởng các quyền lợi khám chữa bệnh tại các cơ sở y tế trong phạm vi thanh toán của quỹ BHYT theo mức hưởng được quy định.',
      tags: ['Quyền lợi', 'BHYT'],
    },
    {
      icon: '🏥',
      title: 'Đăng ký khám chữa bệnh ban đầu',
      desc: 'Người tham gia BHYT phải đăng ký khám chữa bệnh ban đầu tại một cơ sở khám chữa bệnh. Việc thay đổi nơi đăng ký chỉ được thực hiện vào đầu mỗi quý.',
      tags: ['KCB', 'Đăng ký'],
    },
    {
      icon: '💊',
      title: 'Mức hưởng BHYT theo đối tượng',
      desc: 'Mức hưởng BHYT được tính theo tỷ lệ % chi phí khám chữa bệnh: 100% cho người nghèo, người dân tộc thiểu số vùng khó khăn; 95% cho người hưu trí, thân nhân người có công...',
      tags: ['Mức hưởng', 'Đối tượng'],
    },
    {
      icon: '📅',
      title: 'Thời hạn thẻ BHYT và gia hạn',
      desc: 'Thẻ BHYT có thời hạn sử dụng tối thiểu 3 tháng. Người tham gia cần gia hạn trước khi thẻ hết hạn để đảm bảo quyền lợi liên tục không bị gián đoạn.',
      tags: ['Thời hạn', 'Gia hạn'],
    },
    {
      icon: '⚕️',
      title: 'Thủ tục chuyển tuyến khám chữa bệnh',
      desc: 'Khi cần điều trị tuyến trên, người bệnh cần có giấy chuyển tuyến từ cơ sở KCB ban đầu. Trường hợp cấp cứu không cần giấy chuyển tuyến.',
      tags: ['Chuyển tuyến', 'Thủ tục'],
    },
    {
      icon: '📞',
      title: 'Khiếu nại và giải quyết tranh chấp',
      desc: 'Người tham gia BHYT có quyền khiếu nại khi quyền lợi bị vi phạm. Cơ quan BHXH có trách nhiệm giải quyết khiếu nại trong vòng 30 ngày làm việc.',
      tags: ['Khiếu nại', 'Quyền lợi'],
    },
  ];

  return (
    <div className="info-page">
      <div className="info-inner">
        <div className="page-header">
          <span className="page-badge">ℹ️ Thông tin</span>
          <h1>Thông tin Bảo hiểm Xã hội</h1>
          <p>Các thông tin, quy định và chính sách BHYT mới nhất dành cho người dân xã Đăk Pxi.</p>
        </div>

        <div className="articles-grid">
          {articles.map((a) => (
            <div className="article-card" key={a.title}>
              <div className="article-icon">{a.icon}</div>
              <div className="article-body">
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
                <div className="article-tags">
                  {a.tags.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   THÔNG BÁO
═══════════════════════════════════════════════════════ */
export function ThongBaoPage() {
  const notices = [
    {
      date: '28/05/2026',
      type: 'Quan trọng',
      typeCls: 'type-urgent',
      title: 'Thông báo gia hạn thẻ BHYT quý III/2026',
      content: 'UBND Xã Đăk Pxi thông báo: Người dân có thẻ BHYT hết hạn vào 30/06/2026 cần đến UBND xã để làm thủ tục gia hạn trước ngày 20/06/2026.',
    },
    {
      date: '20/05/2026',
      type: 'Thông báo',
      typeCls: 'type-normal',
      title: 'Lịch khám sức khỏe định kỳ cho hộ nghèo',
      content: 'Trạm y tế xã Đăk Pxi tổ chức khám sức khỏe định kỳ miễn phí cho các hộ nghèo và cận nghèo vào ngày 05/06/2026. Người dân mang theo thẻ BHYT và CCCD.',
    },
    {
      date: '15/05/2026',
      type: 'Hướng dẫn',
      typeCls: 'type-guide',
      title: 'Hướng dẫn sử dụng hệ thống tra cứu BHYT trực tuyến',
      content: 'Để tra cứu thông tin thẻ BHYT, người dân truy cập hệ thống này và nhập số CCCD 12 chữ số. Hệ thống hoạt động 24/7, không cần đến UBND xã.',
    },
    {
      date: '10/05/2026',
      type: 'Thông báo',
      typeCls: 'type-normal',
      title: 'Cập nhật danh sách hộ được hỗ trợ đóng BHYT năm 2026',
      content: 'Danh sách hộ nghèo, hộ cận nghèo được ngân sách nhà nước hỗ trợ 100% mức đóng BHYT năm 2026 đã được cập nhật. Người dân kiểm tra thông tin tại UBND xã.',
    },
    {
      date: '02/05/2026',
      type: 'Thông báo',
      typeCls: 'type-normal',
      title: 'Thay đổi nơi đăng ký KCB ban đầu quý II/2026',
      content: 'Thời gian đăng ký thay đổi nơi KCB ban đầu quý II/2026 kết thúc vào ngày 31/03/2026. Người dân có thể thay đổi vào đầu quý III (tháng 7/2026).',
    },
  ];

  return (
    <div className="info-page">
      <div className="info-inner">
        <div className="page-header">
          <span className="page-badge">📢 Thông báo</span>
          <h1>Thông báo từ UBND Xã Đăk Pxi</h1>
          <p>Các thông báo, thông tin mới nhất từ UBND Xã Đăk Pxi gửi đến người dân.</p>
        </div>

        <div className="notices-list">
          {notices.map((n) => (
            <div className="notice-card" key={n.title}>
              <div className="notice-meta">
                <span className={`notice-type ${n.typeCls}`}>{n.type}</span>
                <span className="notice-date">📅 {n.date}</span>
              </div>
              <h3>{n.title}</h3>
              <p>{n.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LIÊN HỆ
═══════════════════════════════════════════════════════ */
export function LienHePage() {
  const contacts = [
    { icon: '🏢', label: 'Địa chỉ',       value: 'Thôn Pa Cheng, Xã Đăk Pxi, Tỉnh Quảng Ngãi' },
    { icon: '📞', label: 'Điện thoại',    value: '(0260) 123 4567' },
    { icon: '✉️', label: 'Email',          value: 'ubnd.dakpxi@quangngai.gov.vn' },
    { icon: '🕐', label: 'Giờ làm việc',  value: 'Thứ 2 – Thứ 6: 7:30 – 11:30 và 13:30 – 17:00' },
  ];

  const staff = [
    { name: 'Nguyễn Văn B',  role: 'Cán bộ BHXH xã',         phone: '0900 123 456' },
    { name: 'Trần Thị C',    role: 'Cán bộ tư pháp - hộ tịch', phone: '0900 234 567' },
    { name: 'Lê Văn D',      role: 'Cán bộ y tế xã',          phone: '0900 345 678' },
  ];

  return (
    <div className="info-page">
      <div className="info-inner">
        <div className="page-header">
          <span className="page-badge">📞 Liên hệ</span>
          <h1>Liên hệ & Hỗ trợ</h1>
          <p>Thông tin liên hệ UBND Xã Đăk Pxi và đội ngũ cán bộ hỗ trợ người dân.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <h2>📍 Thông tin liên hệ</h2>
            <div className="contact-list">
              {contacts.map((c) => (
                <div className="contact-row" key={c.label}>
                  <span className="contact-icon">{c.icon}</span>
                  <div>
                    <div className="contact-label">{c.label}</div>
                    <div className="contact-value">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-card">
            <h2>👤 Cán bộ hỗ trợ BHYT</h2>
            <div className="staff-list">
              {staff.map((s) => (
                <div className="staff-row" key={s.name}>
                  <div className="staff-avatar">{s.name.charAt(0)}</div>
                  <div className="staff-info">
                    <strong>{s.name}</strong>
                    <span>{s.role}</span>
                    <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="staff-phone">
                      📞 {s.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="emergency-banner">
          <span className="emergency-icon">🚨</span>
          <div>
            <strong>Đường dây hỗ trợ BHXH toàn quốc</strong>
            <p>Gọi miễn phí: <a href="tel:1900936936">1900 936 936</a> (24/7)</p>
          </div>
        </div>
      </div>
    </div>
  );
}