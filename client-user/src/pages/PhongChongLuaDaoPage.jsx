import { useState, useEffect } from 'react';
import './PhongChongLuaDaoPage.css';

// Danh mục lọc chủ đề
const CATEGORIES = [
  'Tất cả',
  'Giả danh cơ quan Nhà nước',
  'Giả danh Công an',
  'Giả danh ngân hàng',
  'Lừa đảo chuyển khoản',
  'Đầu tư tài chính giả',
  'Bảo vệ tài khoản cá nhân',
  'Khuyến cáo',
];

// Danh sách bài viết tuyên truyền phòng chống lừa đảo mạng
const ARTICLES = [
  {
    id: 1,
    category: 'Giả danh Công an',
    title: 'Cảnh báo cuộc gọi giả danh Công an, Viện kiểm sát đe dọa yêu cầu chuyển tiền "điều tra"',
    desc: 'Đối tượng xấu gọi điện xưng là Cán bộ Công an, Viện kiểm sát thông báo người dân liên quan đến vụ án ma túy, rửa tiền và ép chuyển tiền vào "tài khoản tạm giữ" để chiếm đoạt.',
    date: '22/07/2026',
    image: '/huong-dan/gia-ca.png',
    details: [
      'Công an, Viện kiểm sát, Tòa án TUYỆT ĐỐI KHÔNG làm việc qua điện thoại hay yêu cầu chuyển tiền vào tài khoản cá nhân.',
      'Khi nhận cuộc gọi đe dọa, bà con hãy giữ bình tĩnh, tuyệt đối không làm theo và không chuyển bất kỳ khoản tiền nào.',
      'Đến ngay Trụ sở Công an xã Đăk Pxi hoặc gọi số 0339310915 để trình báo và xác minh thông tin.'
    ]
  },
  {
    id: 2,
    category: 'Giả danh ngân hàng',
    title: 'Thủ đoạn gửi tin nhắn SMS, Zalo chứa đường link giả mạo Ngân hàng để lấy mã OTP',
    desc: 'Cảnh giác với các tin nhắn giả mạo Ngân hàng thông báo "Tài khoản của bạn bị khóa", "Có giao dịch bất thường" kèm đường link lạ nhằm chiếm đoạt tài khoản ngân hàng.',
    date: '21/07/2026',
    image: '/huong-dan/gia-nganhang.png',
    details: [
      'Không bấm vào bất kỳ đường link lạ gửi qua SMS, Zalo, Messenger.',
      'Ngân hàng không bao giờ yêu cầu khách hàng cung cấp tên đăng nhập, mật khẩu hay mã xác thực OTP.',
      'Chỉ truy cập ứng dụng ngân hàng chính thức tải từ Google Play hoặc App Store.'
    ]
  },
  {
    id: 3,
    category: 'Giả danh cơ quan Nhà nước',
    title: 'Cảnh báo chiêu trò gọi điện hướng dẫn "Cập nhật ứng dụng VNeID mức 2" để kích hoạt mã độc',
    desc: 'Kẻ gian xưng là Cán bộ Công an xã hoặc Cán bộ Tư pháp hướng dẫn cài đặt phần mềm VNeID giả mạo chứa mã độc để điều khiển điện thoại và rút sạch tiền trong tài khoản.',
    date: '20/07/2026',
    image: '/huong-dan/gia-vneid.png',
    details: [
      'Cán bộ Công an xã Đăk Pxi chỉ hỗ trợ kích hoạt VNeID trực tiếp tại Trụ sở Công an hoặc Nhà Rông các thôn.',
      'Tuyệt đối không tải ứng dụng qua đường link `.apk` gửi qua tin nhắn Zalo/Telegram.',
      'Không cấp quyền truy cập Màn hình (Accessibility) cho các ứng dụng lạ.'
    ]
  },
  {
    id: 4,
    category: 'Đầu tư tài chính giả',
    title: 'Cảnh giác các ứng dụng "Tuyển cộng tác viên làm việc online", "Đầu tư tài chính siêu lợi nhuận"',
    desc: 'Lừa đảo tuyển người xem video, thả tim bài viết hoặc nạp tiền đầu tư chứng khoán, tiền ảo hứa hẹn lợi nhuận 20% - 50%/ngày rồi khóa tài khoản khi nạp số tiền lớn.',
    date: '19/07/2026',
    image: '/huong-dan/gia-dt.png',
    details: [
      'Cảnh giác trước các lời mời gọi "việc nhẹ lương cao", đầu tư không làm cũng có ăn.',
      'Không nạp tiền vào các sàn giao dịch lạ không rõ nguồn gốc pháp lý.',
      'Khi bị lừa đảo, lập tức chụp ảnh màn hình tin nhắn, hóa đơn chuyển khoản để báo Công an.'
    ]
  },
  {
    id: 5,
    category: 'Lừa đảo chuyển khoản',
    title: 'Thủ đoạn lừa đảo "Chuyển nhầm tiền vào tài khoản" rồi bắt trả lãi suất cao',
    desc: 'Đối tượng cố tình chuyển một khoản tiền nhỏ vào tài khoản của bà con, sau đó giả danh công ty tài chính đòi nợ ép trả tiền gốc kèm lãi suất cắt cổ.',
    date: '18/07/2026',
    image: '/huong-dan/chuyen-tien.png',
    details: [
      'Khi nhận tiền lạ chuyển vào tài khoản, không tự ý chuyển trả lại cho người gọi đòi.',
      'Đến ngân hàng hoặc Trụ sở Công an xã nhờ tra soát và hỗ trợ hoàn trả chính chủ.',
      'Tuyệt đối không tiêu xài số tiền chuyển nhầm.'
    ]
  },
  {
    id: 6,
    category: 'Bảo vệ tài khoản cá nhân',
    title: 'Hướng dẫn 5 bước bảo mật tài khoản Facebook, Zalo & Ngân hàng chống bị hack',
    desc: 'Phòng Văn hóa - Xã hội hướng dẫn bà con thiết lập mật khẩu mạnh, bật xác thực hai yếu tố (2FA) và không chia sẻ giấy tờ cá nhân CCCD lên mạng xã hội.',
    date: '17/07/2026',
    image: '/huong-dan/bao-mat.png',
    details: [
      'Bật tính năng Xác thực 2 bước (2FA) qua số điện thoại hoặc Google Authenticator.',
      'Không chụp và đăng tải hình ảnh Mặt trước/Mặt sau Căn cước công dân lên mạng.',
      'Định kỳ đổi mật khẩu tài khoản ngân hàng và ứng dụng Zalo/Facebook 6 tháng/lần.'
    ]
  },
  {
    id: 7,
    category: 'Khuyến cáo',
    title: 'Thông điệp 5 KHÔNG & 2 NÊN giúp bà con xã Đăk Pxi phòng tránh mọi thủ đoạn lừa đảo',
    desc: 'Bộ quy tắc an toàn thông tin dễ nhớ dành cho toàn thể nhân dân xã Đăk Pxi khi tham gia sử dụng điện thoại thông minh và mạng xã hội.',
    date: '16/07/2026',
    image: '/huong-dan/khong.png',
    details: [
      '5 KHÔNG: Không tin ngay — Không ấn link lạ — Không cung cấp OTP — Không chuyển tiền trước — Không tải app ngoài.',
      '2 NÊN: Nên xác minh trực tiếp — Nên báo ngay cho Công an xã khi thấy nghi vấn.'
    ]
  }
];

// Các nội dung tuyên truyền tập trung
const CORE_WARNINGS = [
  { icon: '🚫', title: 'Không cung cấp thông tin bảo mật', text: 'Tuyệt đối KHÔNG cung cấp số CCCD, mã OTP, mật khẩu tài khoản ngân hàng cho bất kỳ ai, kể cả người tự xưng là Cán bộ Ngân hàng hay Công an.' },
  { icon: '💸', title: 'Không chuyển tiền khi chưa xác minh', text: 'Không chuyển tiền cho tài khoản lạ hoặc người quen nhắn tin hỏi vay tiền khi chưa gọi điện thoại kiểm tra lại bằng giọng nói trực tiếp.' },
  { icon: '📞', title: 'Cảnh giác cuộc gọi giả danh', text: 'Tòa án, Công an, Viện kiểm sát KHÔNG BAO GIỜ gọi điện đe dọa, yêu cầu chuyển tiền hay làm việc trực tuyến qua Zalo, Messenger.' },
  { icon: '🏦', title: 'Cảnh giác đường link, website giả mạo', text: 'Không click vào đường link lạ gửi qua tin nhắn. Chỉ truy cập ứng dụng ngân hàng và Cổng dịch vụ công chính thức.' },
  { icon: '📈', title: 'Nói KHÔNG với đầu tư siêu lợi nhuận', text: 'Tránh xa các lời mời gọi tuyển cộng tác viên online, nạp tiền đầu tư chứng khoán, tiền ảo hứa hẹn lợi nhuận cao bất thường.' },
  { icon: '🔐', title: 'Bật xác thực 2 lớp bảo vệ tài khoản', text: 'Kích hoạt ngay tính năng bảo mật 2 lớp (2FA) cho Zalo, Facebook, Email và Ngân hàng số để tránh bị kẻ gian chiếm đoạt.' },
  { icon: '🚨', title: 'Tích cực tố giác & báo Công an', text: 'Khi phát hiện dấu hiệu nghi vấn lừa đảo, hãy báo ngay cho Công an xã Đăk Pxi theo SĐT 0339310915 để được hỗ trợ kịp thời.' },
];

export default function PhongChongLuaDaoPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery]           = useState('');
  const [speaking, setSpeaking]                   = useState(false);
  const [activeArticle, setActiveArticle]         = useState(null);

  // Lọc bài viết theo danh mục và ô tìm kiếm
  const filteredArticles = ARTICLES.filter(item => {
    const matchCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
    const matchSearch   = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Chức năng loa phát thanh tuyên truyền
  function handleSpeak(customText) {
    if (!('speechSynthesis' in window)) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = customText || (
      `Kính mời bà con xã Đăk Pxi lắng nghe thông báo tuyên truyền phòng chống lừa đảo trên không gian mạng. ` +
      `Nâng cao nhận thức, chủ động phòng ngừa các hành vi lừa đảo trên môi trường mạng. ` +
      `Bà con hãy ghi nhớ 7 nội dung cảnh giác trọng tâm: ` +
      CORE_WARNINGS.map((w, idx) => `Thứ ${idx + 1}: ${w.title}. ${w.text}`).join(' ')
    );

    const u = new SpeechSynthesisUtterance(textToRead);
    u.lang = 'vi-VN';
    u.rate = 0.92;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }

  // Tự động cuộn lên đầu khi chọn xem bài hoặc đổi tab
  function handleOpenArticle(article) {
    setActiveArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="pc-ld-page">
      <div className="pc-ld-container">

        {/* ── BANNER TOP CHÍNH PHỦ & UBND XÃ ĐĂK PXI ── */}
        <div className="pc-ld-banner">
          <div className="pc-ld-banner-left">
            <div className="pc-ld-badge">
              🛡️ TUYÊN TRUYỀN PHÒNG, CHỐNG LỪA ĐẢO TRÊN KHÔNG GIAN MẠNG
            </div>
            <h1 className="pc-ld-banner-title">
              Nâng cao nhận thức, chủ động phòng ngừa các hành vi lừa đảo trên môi trường mạng
            </h1>
            <p className="pc-ld-banner-sub">
              Trang thông tin tuyên truyền chính thức từ Phòng Văn hóa - Xã hội UBND xã Đăk Pxi, tỉnh Quảng Ngãi
            </p>

            <div className="pc-ld-meta-tags">
              <span>🏛️ UBND xã Đăk Pxi</span>
              <span className="sep">•</span>
              <span>📋 Phòng Văn hóa - Xã hội</span>
              <span className="sep">•</span>
              <span>🏔️ Tỉnh Quảng Ngãi</span>
            </div>
          </div>

          <div className="pc-ld-banner-right">
            {speaking && (
              <div className="sound-wave">
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
              </div>
            )}
            <button
              type="button"
              className={`pc-ld-speak-btn ${speaking ? 'speaking' : ''}`}
              onClick={() => handleSpeak()}
            >
              <span className="audio-icon">{speaking ? '⏹' : '📢'}</span>
              <span>{speaking ? 'Dừng đọc phát thanh' : 'Nghe loa đọc tuyên truyền'}</span>
            </button>
          </div>
        </div>

        {/* ── GIỮ NGUYÊN TAB DANH MỤC TRÊN CÙNG ĐỂ KHÔNG BỎ TAB KHI XEM BÀI ── */}
        <div className="pc-ld-cat-nav-wrapper">
          <div className="pc-ld-cat-bar">
            {CATEGORIES.map((cat, idx) => (
              <button
                key={idx}
                className={`pc-ld-cat-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveArticle(null); // Trở về danh sách lọc theo tab
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
           TRƯỜNG HỢP 1: HIỂN THỊ CHI TIẾT BÀI VIẾT FULL MÀN HÌNH (XEM BÀI)
        ════════════════════════════════════════════════════════════════ */}
        {activeArticle ? (
          <div className="pc-ld-full-article-wrapper">
            
            {/* Thanh công cụ điều hướng bài viết */}
            <div className="pc-ld-article-nav-top">
              <button className="pc-ld-back-btn" onClick={() => setActiveArticle(null)}>
                ⬅ Quay lại danh sách tất cả bài viết tuyên truyền
              </button>
              <div className="pc-ld-article-cat-tag">
                Danh mục: <strong>{activeArticle.category}</strong>
              </div>
            </div>

            <div className="pc-ld-layout">
              {/* CỘT CHÍNH NỘI DUNG BÀI VIẾT TOÀN MÀN HÌNH */}
              <main className="pc-ld-main">
                <article className="pc-ld-full-article-card">
                  
                  <div className="pc-ld-full-header">
                    <span className="pc-ld-full-badge">{activeArticle.category}</span>
                    <h1 className="pc-ld-full-title">{activeArticle.title}</h1>
                    <div className="pc-ld-full-meta">
                      <span>🗓️ Ngày phát hành: {activeArticle.date}</span>
                      <span className="sep">•</span>
                      <span>🏛️ Phòng VH-XH UBND xã Đăk Pxi</span>
                    </div>
                  </div>

                  {/* Ảnh bài viết TO RỘNG RÕ NÉT FULL CONTAINER */}
                  <div className="pc-ld-full-img-box">
                    <img src={activeArticle.image} alt={activeArticle.title} className="pc-ld-full-img" />
                    <div className="pc-ld-full-img-caption">
                      📷 Hình ảnh minh họa tình huống cảnh báo an ninh mạng
                    </div>
                  </div>

                  {/* Nội dung bài viết chữ to rõ nét */}
                  <div className="pc-ld-full-body">
                    <p className="pc-ld-full-lead">{activeArticle.desc}</p>

                    <div className="pc-ld-full-details-box">
                      <h3>📌 Hướng dẫn & Biện pháp phòng tránh trọng tâm cho bà con:</h3>
                      <ul>
                        {activeArticle.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pc-ld-full-footer-actions">
                    <button className="pc-ld-speak-article-btn" onClick={() => handleSpeak(`${activeArticle.title}. ${activeArticle.desc}`)}>
                      📢 Nghe đọc bài viết này
                    </button>
                    <button className="pc-ld-back-btn-secondary" onClick={() => setActiveArticle(null)}>
                      ⬅ Trở về danh sách bài viết
                    </button>
                  </div>

                </article>

                {/* CÁC BÀI VIẾT KHÁC CÙNG CHỦ ĐỀ */}
                <section className="pc-ld-related-section">
                  <h3 className="pc-ld-related-title">📰 Các bài viết tuyên truyền khác cho bà con:</h3>
                  <div className="pc-ld-related-grid">
                    {ARTICLES.filter(a => a.id !== activeArticle.id).slice(0, 3).map(rel => (
                      <div key={rel.id} className="pc-ld-related-card" onClick={() => handleOpenArticle(rel)}>
                        <img src={rel.image} alt={rel.title} className="rel-img" />
                        <div className="rel-info">
                          <span className="rel-cat">{rel.category}</span>
                          <h4>{rel.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </main>

              {/* CỘT PHẢI SIDEBAR GIỮ NGUYÊN HOÀN TOÀN */}
              <aside className="pc-ld-sidebar">
                <SidebarComponent />
              </aside>
            </div>

          </div>
        ) : (
          
          /* ════════════════════════════════════════════════════════════════
             TRƯỜNG HỢP 2: DANH SÁCH TẤT CẢ BÀI VIẾT
          ════════════════════════════════════════════════════════════════ */
          <div className="pc-ld-layout">

            {/* CỘT TRÁI: DANH SÁCH BÀI VIẾT TUYÊN TRUYỀN */}
            <main className="pc-ld-main">

              {/* Ô TÌM KIẾM BÀI VIẾT */}
              <div className="pc-ld-search-bar">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="pc-ld-search-input"
                  placeholder="Tìm kiếm bài tuyên truyền..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="clear-btn" onClick={() => setSearchQuery('')}>✕ Xóa</button>
                )}
              </div>

              {/* DANH SÁCH THẺ BÀI VIẾT TUYÊN TRUYỀN */}
              {filteredArticles.length === 0 ? (
                <div className="pc-ld-empty">
                  <p>🔍 Không tìm thấy bài viết tuyên truyền nào với từ khóa "{searchQuery}".</p>
                  <button onClick={() => { setSearchQuery(''); setSelectedCategory('Tất cả'); }}>
                    Xem lại tất cả bài viết
                  </button>
                </div>
              ) : (
                <div className="pc-ld-article-grid">
                  {filteredArticles.map(article => (
                    <div key={article.id} className="pc-ld-article-card">
                      
                      <div className="pc-ld-card-img-wrap" onClick={() => handleOpenArticle(article)}>
                        <img src={article.image} alt={article.title} className="pc-ld-card-img" />
                        <span className="pc-ld-card-cat">{article.category}</span>
                      </div>

                      <div className="pc-ld-card-body">
                        <div className="pc-ld-card-date">🗓️ Ngày đăng: {article.date}</div>
                        <h3 className="pc-ld-card-title">{article.title}</h3>
                        <p className="pc-ld-card-desc">{article.desc}</p>
                        
                        <button
                          className="pc-ld-card-btn"
                          onClick={() => handleOpenArticle(article)}
                        >
                          Xem chi tiết bài hướng dẫn ➔
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </main>

            {/* CỘT PHẢI: HOTLINE KHẨN CẤP & CẢNH BÁO */}
            <aside className="pc-ld-sidebar">
              <SidebarComponent />
            </aside>

          </div>
        )}

        {/* ── 7 KHUYẾN CÁO TRỌNG TÂM (ĐƯỢC CHUYỂN XUỐNG DƯỚI CÙNG) ── */}
        <section className="pc-ld-section pc-ld-core-warnings" style={{ marginTop: '36px' }}>
          <h2 className="pc-ld-section-title">
            🛑 7 Khuyên cáo An ninh mạng trọng tâm cho bà con xã Đăk Pxi
          </h2>
          <div className="pc-ld-warning-grid">
            {CORE_WARNINGS.map((item, idx) => (
              <div key={idx} className="pc-ld-warning-card">
                <div className="pc-ld-warning-icon">{item.icon}</div>
                <div className="pc-ld-warning-content">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

// Sub component Sidebar
function SidebarComponent() {
  return (
    <>
      {/* 🚨 SỐ ĐIỆN THOẠI HỖ TRỢ KHẨN CẤP */}
      <div className="pc-ld-box pc-ld-box--danger">
        <div className="pc-ld-box-title">🚨 HOTLINE TỐ GIÁC LỪA ĐẢO MẠNG</div>
        <div className="pc-ld-phone-list">
          <div className="pc-ld-phone-item">
            <span>Công an xã Đăk Pxi:</span>
            <a href="tel:0339310915" className="phone-num">0339310915</a>
          </div>
          <div className="pc-ld-phone-item">
            <span>Cảnh sát Khẩn cấp:</span>
            <a href="tel:113" className="phone-num">113</a>
          </div>
          <div className="pc-ld-phone-item">
            <span>Phòng An ninh mạng PA05:</span>
            <a href="tel:0692348560" className="phone-num">069.2348560</a>
          </div>
        </div>
        <p className="phone-note">Phòng VH-XH & Công an xã Đăk Pxi tiếp nhận thông tin 24/7</p>
      </div>

      {/* 🏛️ TRANG CẢNH BÁO KHÔNG GIAN MẠNG QUỐC GIA */}
      <div className="pc-ld-box pc-ld-box--law">
        <div className="pc-ld-box-title">🏛️ CỔNG CẢNH BÁO AN TOÀN MẠNG</div>
        <p className="law-desc">Tra cứu chính thức các danh sách trang web, số điện thoại lừa đảo đã bị cảnh báo:</p>
        
        <a
          href="https://canhbao.khonggianmang.vn"
          target="_blank"
          rel="noopener noreferrer"
          className="pc-ld-law-btn"
        >
          <span>🛡️ Cổng Cảnh báo Không gian mạng Quốc gia</span>
          <span className="arr">↗</span>
        </a>

        <a
          href="https://tinnhiemmang.vn"
          target="_blank"
          rel="noopener noreferrer"
          className="pc-ld-law-btn secondary"
        >
          <span>🔒 Cổng Tín nhiệm mạng Quốc gia (tinnhiemmang.vn)</span>
          <span className="arr">↗</span>
        </a>
      </div>

      {/* 📢 THÔNG ĐIỆP TUYÊN TRUYỀN KHẨU HIỆU */}
      <div className="pc-ld-box pc-ld-box--slogan">
        <div className="pc-ld-box-title">📢 KHI NÓI CHUYỆN VỚI NGƯỜI LẠ</div>
        <blockquote className="slogan-quote">
          "Không vội tin — Không làm theo — Không chuyển tiền — Báo ngay Công an xã Đăk Pxi khi thấy nghi ngờ!"
        </blockquote>
      </div>
    </>
  );
}
