import './InfoPages.css';

/* ═══════════════════════════════════════════════════════
   THÔNG TIN
═══════════════════════════════════════════════════════ */
// ── ThongBaoPage ──
export function ThongBaoPage() {
  const notices = [ /* giữ nguyên data */ ];
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="info-hero-inner">
          <div className="info-hero-badge">📢 Thông báo</div>
          <h1>Thông báo từ <span>UBND Xã Đăk Pxi</span></h1>
          <p>Các thông báo, thông tin mới nhất từ UBND Xã Đăk Pxi gửi đến người dân.</p>
        </div>
      </div>
      <div className="info-stats">
        <div className="info-stat"><strong>{notices.length}</strong><span>Thông báo</span></div>
        <div className="info-stat"><strong>Hôm nay</strong><span>Cập nhật lần cuối</span></div>
        <div className="info-stat"><strong>24/7</strong><span>Trực tuyến</span></div>
      </div>
      <div className="info-content">
        <div>
          <div className="section-bar">
            <div className="section-bar-dot"></div>
            <h2>Danh sách thông báo</h2>
            <span className="section-bar-count">{notices.length} thông báo</span>
          </div>
          <div className="notices-list">
            {notices.map(n => (
              <div className={`notice-card ${n.typeCls}`} key={n.title}>
                <div className="notice-icon-wrap">{n.icon || '📋'}</div>
                <div className="notice-body">
                  <div className="notice-meta">
                    <span className="notice-type-badge">{n.type}</span>
                    <span className="notice-date">📅 {n.date}</span>
                  </div>
                  <h3>{n.title}</h3>
                  <p>{n.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ThongTinPage ──
export function ThongTinPage() {
  const articles = [ /* giữ nguyên data */ ];
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="info-hero-inner">
          <div className="info-hero-badge">ℹ️ Thông tin</div>
          <h1>Thông tin <span>Bảo hiểm Xã hội</span></h1>
          <p>Các thông tin, quy định và chính sách BHYT mới nhất dành cho người dân xã Đăk Pxi.</p>
        </div>
      </div>
      <div className="info-stats">
        <div className="info-stat"><strong>{articles.length}</strong><span>Bài viết</span></div>
        <div className="info-stat"><strong>2026</strong><span>Cập nhật mới nhất</span></div>
        <div className="info-stat"><strong>100%</strong><span>Chính thống</span></div>
      </div>
      <div className="info-content">
        <div>
          <div className="section-bar">
            <div className="section-bar-dot" style={{background:'#d97706'}}></div>
            <h2>Thông tin BHYT</h2>
            <span className="section-bar-count">{articles.length} bài viết</span>
          </div>
          <div className="articles-grid">
            {articles.map(a => (
              <div className="article-card" key={a.title}>
                <div className="article-card-top">
                  <div className="article-icon">{a.icon}</div>
                  <h3>{a.title}</h3>
                </div>
                <p>{a.desc}</p>
                <div className="article-tags">
                  {a.tags.map(t => <span className="tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LienHePage ──
export function LienHePage() {
  const contacts = [ /* giữ nguyên data */ ];
  const staff = [ /* giữ nguyên data */ ];
  const avatarColors = ['#1d4ed8', '#7c3aed', '#0f766e'];
  return (
    <div className="info-page">
      <div className="info-hero">
        <div className="info-hero-inner">
          <div className="info-hero-badge">📞 Liên hệ</div>
          <h1>Liên hệ & <span>Hỗ trợ</span></h1>
          <p>Thông tin liên hệ UBND Xã Đăk Pxi và đội ngũ cán bộ hỗ trợ người dân.</p>
        </div>
      </div>
      <div className="info-content">
        <div className="contact-grid">
          <div className="contact-card">
            <h2>📍 Thông tin liên hệ</h2>
            <div className="contact-list">
              {contacts.map(c => (
                <div className="contact-row" key={c.label}>
                  <div className="contact-icon-box">{c.icon}</div>
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
              {staff.map((s, i) => (
                <div className="staff-row" key={s.name}>
                  <div className="staff-avatar" style={{background: avatarColors[i]}}>
                    {s.name.charAt(0)}
                  </div>
                  <div className="staff-info">
                    <strong>{s.name}</strong>
                    <span>{s.role}</span>
                    <a href={`tel:${s.phone.replace(/\s/g,'')}`} className="staff-phone">
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