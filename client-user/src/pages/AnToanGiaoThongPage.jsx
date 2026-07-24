import { useState, useEffect } from 'react';
import './AnToanGiaoThongPage.css';

// ── BỘ ICON SVG CHUẨN HTML5 ──
const SvgIcons = {
  Traffic: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="10" height="20" x="7" y="2" rx="3" />
      <circle cx="12" cy="6" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="18" r="1.5" />
    </svg>
  ),
  VolumeUp: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  ),
  SquareStop: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  ),
  Clipboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Pin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14l-1.5-6H6.5L5 17Z" />
      <path d="M9 11V4a3 3 0 0 1 6 0v7" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Siren: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 12a5 5 0 0 1 10 0v7H7v-7Z" />
      <path d="M5 19h14" />
      <path d="M12 2v3" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Landmark: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7 12 2" />
    </svg>
  ),
  BookOpen: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Scale: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h18" />
    </svg>
  ),
  Megaphone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  ),
  ExternalLink: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
};

const DATA = {
  title: 'Tuyên truyền An toàn Giao thông',
  subtitle: 'Chung tay xây dựng văn hóa giao thông an toàn, văn minh trên địa bàn xã Đăk Pxi',
  content:
    'Xã Đăk Pxi có địa hình đường nông thôn nhiều đèo dốc quanh co, sương mù và đường trơn trượt vào mùa mưa lũ. Để bảo vệ tính mạng, sức khỏe và tài sản của bản thân cùng gia đình, Phòng Văn hóa - Xã hội UBND xã Đăk Pxi đề nghị toàn thể bà con nhân dân, học sinh và các lực lượng tham gia giao thông nâng cao tinh thần tự giác, chấp hành nghiêm các quy định về an toàn giao thông đường bộ.',

  visualSteps: [
    {
      stt: '01',
      title: 'Tuyên truyền diễu hành & Đội mũ bảo hiểm đạt chuẩn cho con em',
      tag: 'Tuyên truyền lưu động',
      img: '/huong-dan/atgt-1.png',
      desc: 'Phòng Văn hóa - Xã hội xã Đăk Pxi phối hợp tổ chức tuyên truyền lưu động và diễu hành an toàn giao thông trên các tuyến đường chính. Vận động 100% bà con nhân dân và học sinh chấp hành nghiêm việc đội mũ bảo hiểm đạt chuẩn chất lượng, gài quai chắc chắn khi đi xe máy.',
      highlights: [
        'Đội mũ bảo hiểm đạt chuẩn CR khi đi xe máy, xe điện.',
        'Gài quai đúng quy cách, bảo vệ an toàn cho bản thân và con em.',
        'Giảm tốc độ và quan sát kỹ khi ra từ đường nhánh liên thôn.'
      ]
    },
    {
      stt: '02',
      title: 'Sinh hoạt tập trung & Tuyên truyền văn hóa giao thông tại Nhà Rông',
      tag: 'Sinh hoạt cộng đồng',
      img: '/huong-dan/atgt-2.png',
      desc: 'Tổ chức các buổi sinh hoạt tập trung tại Nhà Rông các thôn để hướng dẫn trực quan cho bà con nhân dân xã Đăk Pxi. Nhắc nhở thông điệp "An toàn giao thông là hạnh phúc của mọi nhà", nâng cao ý thức văn hóa giao thông chung.',
      highlights: [
        'Tuyệt đối "Đã uống rượu bia — Không điều khiển phương tiện".',
        'Tuyên truyền sâu rộng đến từng hộ gia đình và thôn làng.',
        'Nhường đường cho người đi bộ và xe ưu tiên.'
      ]
    },
    {
      stt: '03',
      title: 'Hướng dẫn trực quan Quy định & Biển báo Giao thông đường bộ',
      tag: 'Phổ biến pháp luật',
      img: '/huong-dan/atgt-3.png',
      desc: 'Cán bộ tuyên truyền trực tiếp giảng giải các biển báo nguy hiểm, độ tuổi được phép lái xe và mức phạt theo quy định pháp luật. Giúp bà con và học sinh dễ nhận biết, dễ nhớ và chủ động phòng tránh tai nạn giao thông.',
      highlights: [
        'Không giao xe máy cho học sinh chưa đủ tuổi, chưa có GPLX.',
        'Nhận biết các đoạn đường dốc nguy hiểm, cua hẹp và ngầm tràn.',
        'Chấp hành nghiêm sự chỉ dẫn của Cảnh sát Giao thông và biển báo.'
      ]
    }
  ],

  warning: [
    'Tuyệt đối không điều khiển phương tiện giao thông sau khi đã uống rượu, bia.',
    '100% người đi xe máy phải đội mũ bảo hiểm đạt chuẩn chất lượng và cài quai đúng quy cách.',
    'Giảm tốc độ dưới 30km/h tại các khúc cua hẹp, đường dốc quanh co và tuyến đường đèo dốc nông thôn.',
    'Không dùng điện thoại di động, tai nghe khi đang lái xe máy, ô tô.',
    'Chú ý quan sát các điểm ngầm tràn, sạt lở đá mùa mưa bão; không đi qua khi nước chảy xiết.',
    'Phụ huynh đưa đón con đi học dừng đỗ xe đúng nơi quy định, không gây ùn tắc trước cổng trường.',
  ],

  preparednessItems: [
    { title: 'Mũ bảo hiểm đạt chuẩn', desc: 'Có tem CR chất lượng, kính chắn gió chống bụi và quai cài chắc chắn.' },
    { title: 'Hệ thống đèn & Phanh xe', desc: 'Đèn pha chiếu sáng tốt khi sương mù, phanh ăn nhạy trước sau.' },
    { title: 'Áo mưa bộ gọn gàng', desc: 'Sử dụng áo mưa bộ hai mảnh để không bị vướng vào bánh xe máy.' },
  ],

  emergencyPhones: [
    { label: 'Cảnh sát Giao thông (CSGT)', number: '113' },
    { label: 'Cấp cứu Y tế khẩn cấp', number: '115' },
    { label: 'Công an xã Đăk Pxi', number: '0339310915' },
  ],

  slogans: [
    'An toàn giao thông là hạnh phúc của mọi nhà.',
    'Đã uống rượu bia — Không lái xe.',
    'Đội mũ bảo hiểm để bảo vệ chính mình.',
    'Chấp hành Luật Giao thông là trách nhiệm của mỗi công dân.',
    'Đi chậm một phút, an toàn cả đời.',
    'Nhường đường cho người đi bộ — Nét đẹp văn hóa giao thông.',
  ]
};

export default function AnToanGiaoThongPage() {
  const [activeImg, setActiveImg] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [sloganIdx, setSloganIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSloganIdx(prev => (prev + 1) % DATA.slogans.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  function handleSpeak() {
    if (!('speechSynthesis' in window)) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead =
      `Kính mời bà con xã Đăk Pxi lắng nghe thông báo tuyên truyền an toàn giao thông. ` +
      DATA.content +
      ` Các bước hướng dẫn an toàn giao thông trực quan. ` +
      DATA.visualSteps.map((s, idx) => `Bước ${idx + 1}: ${s.title}. ${s.desc}`).join(' ');

    const u = new SpeechSynthesisUtterance(textToRead);
    u.lang = 'vi-VN';
    u.rate = 0.92;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }

  return (
    <div className="atgt-page">
      <div className="atgt-container">

        {/* ── HEADER TIÊU ĐỀ TRANG + LOA PHÁT THANH ── */}
        <div className="atgt-header-top">
          <div className="atgt-header-left">
            <span className="atgt-header-badge">
              <SvgIcons.Traffic />
              <span>TUYÊN TRUYỀN AN TOÀN GIAO THÔNG</span>
            </span>
            <h1 className="atgt-title">{DATA.title}</h1>
            <p className="atgt-subtitle">{DATA.subtitle}</p>
          </div>

          <div className="atgt-header-right">
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
              className={`atgt-speak-btn ${speaking ? 'speaking' : ''}`}
              onClick={handleSpeak}
            >
              <span className="audio-icon">{speaking ? <SvgIcons.SquareStop /> : <SvgIcons.VolumeUp />}</span>
              <span>{speaking ? 'Dừng đọc phát thanh' : 'Nghe loa đọc tuyên truyền'}</span>
            </button>
          </div>
        </div>

        {/* ── KHUNG BỐ CỤC 2 CỘT ── */}
        <div className="atgt-layout">

          {/* CỘT TRÁI (MAIN CONTENT) */}
          <div className="atgt-main">

            {/* Mô tả tuyên truyền */}
            <section className="atgt-section">
              <p className="atgt-content-lead">{DATA.content}</p>
            </section>

            {/* HƯỚNG DẪN TRỰC QUAN */}
            <section className="atgt-section atgt-visual-section">
              <div className="atgt-steps-header">
                <h2 className="atgt-section-title">
                  <SvgIcons.Clipboard />
                  <span>Hướng dẫn an toàn giao thông từng bước trực quan</span>
                </h2>
                <span className="atgt-steps-sub">Hình ảnh tuyên truyền thực tế & Nội dung hướng dẫn sinh động cho bà con xã Đăk Pxi</span>
              </div>

              <div className="atgt-visual-steps-list">
                {DATA.visualSteps.map((step, i) => (
                  <div key={i} className={`atgt-vstep-card step-${i + 1}`}>

                    {/* Header thông tin bước */}
                    <div className="atgt-vstep-head">
                      <span className="atgt-vstep-stt">Bước {step.stt}</span>
                      <h3 className="atgt-vstep-title">{step.title}</h3>
                      <span className="atgt-vstep-tag">{step.tag}</span>
                    </div>

                    {/* Ảnh TO RỘNG minh họa */}
                    <div className="atgt-vstep-img-box" onClick={() => setActiveImg(step.img)}>
                      <img src={step.img} alt={step.title} className="atgt-vstep-img" />
                      <div className="atgt-vstep-img-badge">
                        <SvgIcons.Search />
                        <span>Bấm phóng to ảnh xem chi tiết</span>
                      </div>
                    </div>

                    {/* Nội dung chi tiết */}
                    <div className="atgt-vstep-content">
                      <p className="atgt-vstep-desc">{step.desc}</p>

                      <div className="atgt-vstep-highlights">
                        <strong>
                          <SvgIcons.Pin />
                          <span>Lưu ý quan trọng cho bà con:</span>
                        </strong>
                        <ul>
                          {step.highlights.map((h, idx) => (
                            <li key={idx}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </section>

            {/* Bộ thiết bị an toàn cần có */}
            <section className="atgt-section">
              <h2 className="atgt-section-title">
                <SvgIcons.ShieldCheck />
                <span>Thiết bị an toàn bắt buộc khi tham gia giao thông</span>
              </h2>
              <div className="atgt-prep-grid">
                {DATA.preparednessItems.map((item, i) => (
                  <div key={i} className="atgt-prep-card">
                    <div className="atgt-prep-body">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* CỘT PHẢI (SIDEBAR) */}
          <aside className="atgt-sidebar">

            {/* Số điện thoại khẩn cấp */}
            <div className="atgt-box atgt-box--danger">
              <div className="atgt-box-title">
                <SvgIcons.Siren />
                <span>Số điện thoại hỗ trợ khẩn cấp</span>
              </div>
              <div className="atgt-phones-list">
                {DATA.emergencyPhones.map((p, i) => (
                  <div key={i} className="atgt-phone-item">
                    <span>{p.label}:</span>
                    <a href={`tel:${p.number}`} className="atgt-phone-link">{p.number}</a>
                  </div>
                ))}
              </div>
              <p className="atgt-phone-note">Phòng VH-XH & Công an xã Đăk Pxi trực 24/7</p>
            </div>

            {/* Lưu ý quan trọng */}
            <div className="atgt-box">
              <div className="atgt-box-title">
                <SvgIcons.AlertTriangle />
                <span>Lưu ý an toàn giao thông</span>
              </div>
              <ul className="atgt-warning-list">
                {DATA.warning.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            {/* CỔNG THÔNG TIN PHÁP LUẬT QUỐC GIA */}
            <div className="atgt-box atgt-box--law">
              <div className="atgt-box-title">
                <SvgIcons.Landmark />
                <span>Cổng Thông tin Pháp luật Quốc gia</span>
              </div>
              <p className="atgt-law-box-desc">Tra cứu chính thức các quy định Luật Giao thông đường bộ & Nghị định xử phạt:</p>
              <div className="atgt-sidebar-law-links">
                <a
                  href="https://vbpl.vn/TW/Pages/home.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="atgt-side-law-btn"
                >
                  <span className="ico"><SvgIcons.BookOpen /></span>
                  <div>
                    <strong>Cơ sở dữ liệu VBPL Quốc gia</strong>
                    <span>vbpl.vn — Tra cứu Luật GTĐB</span>
                  </div>
                  <span className="arr"><SvgIcons.ExternalLink /></span>
                </a>

                <a
                  href="https://phapluat.gov.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="atgt-side-law-btn secondary"
                >
                  <span className="ico"><SvgIcons.Scale /></span>
                  <div>
                    <strong>Cổng Thông tin Pháp luật Quốc gia</strong>
                    <span>phapluat.gov.vn — Hệ thống văn bản</span>
                  </div>
                  <span className="arr"><SvgIcons.ExternalLink /></span>
                </a>

                <a
                  href="https://luatvietnam.vn/giao-thong.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="atgt-side-law-btn accent"
                >
                  <span className="ico"><SvgIcons.Search /></span>
                  <div>
                    <strong>Mức phạt Nghị định 100 & 123</strong>
                    <span>Tra cứu mức phạt vi phạm ATGT</span>
                  </div>
                  <span className="arr"><SvgIcons.ExternalLink /></span>
                </a>
              </div>
            </div>

            {/* Thông điệp tuyên truyền */}
            <div className="atgt-box atgt-box--slogan">
              <div className="atgt-box-title">
                <SvgIcons.Megaphone />
                <span>Thông điệp tuyên truyền</span>
              </div>
              <blockquote className="atgt-slogan-text">
                "{DATA.slogans[sloganIdx]}"
              </blockquote>
            </div>

          </aside>

        </div>
      </div>

      {/* MODAL XEM ẢNH RÕ NẾT */}
      {activeImg && (
        <div className="atgt-img-modal-overlay" onClick={() => setActiveImg(null)}>
          <div className="atgt-img-modal-content" onClick={e => e.stopPropagation()}>
            <button className="atgt-img-modal-close" onClick={() => setActiveImg(null)}>✕</button>
            <img src={activeImg} alt="Ảnh phóng to" className="atgt-modal-full-img" />
          </div>
        </div>
      )}

    </div>
  );
}
