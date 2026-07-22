import { useState, useEffect, useRef } from 'react';
import './AnToanGiaoThongPage.css';

const DATA = {
  title: 'Tuyên truyền An toàn Giao thông',
  subtitle: 'Chung tay xây dựng văn hóa giao thông an toàn, văn minh trên địa bàn xã Đăk Pxi',
  content:
    'Xã Đăk Pxi có địa hình đường nông thôn nhiều đèo dốc quanh co, sương mù và đường trơn trượt vào mùa mưa lũ. Để bảo vệ tính mạng, sức khỏe và tài sản của bản thân cùng gia đình, Phòng Văn hóa - Xã hội UBND xã Đăk Pxi đề nghị toàn thể bà con nhân dân, học sinh và các lực lượng tham gia giao thông nâng cao tinh thần tự giác, chấp hành nghiêm các quy định về an toàn giao thông đường bộ.',
  
  // 📸 CƠ CẤU MỚI: TỪNG BƯỚC HƯỚNG DẪN ĐI LIỀN VỚI ẢNH MINH HỌA TO RỘNG
  visualSteps: [
    {
      stt: '01',
      title: '📢 Tuyên truyền diễu hành & Đội mũ bảo hiểm đạt chuẩn cho con em',
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
      title: '🏛️ Sinh hoạt tập trung & Tuyên truyền văn hóa giao thông tại Nhà Rông',
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
      title: '📜 Hướng dẫn trực quan Quy định & Biển báo Giao thông đường bộ',
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
    { title: '⛑️ Mũ bảo hiểm đạt chuẩn', desc: 'Có tem CR chất lượng, kính chắn gió chống bụi và quai cài chắc chắn.' },
    { title: '💡 Hệ thống đèn & Phanh xe', desc: 'Đèn pha chiếu sáng tốt khi sương mù, phanh ăn nhạy trước sau.' },
    { title: '🌧️ Áo mưa bộ gọn gàng', desc: 'Sử dụng áo mưa bộ hai mảnh để không bị vướng vào bánh xe máy.' },
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
  const [speaking, setSpeaking]   = useState(false);
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
            <span className="atgt-header-badge">🚦 TUYÊN TRUYỀN AN TOÀN GIAO THÔNG</span>
            <h1 className="atgt-title">{DATA.title}</h1>
            <p className="atgt-subtitle">{DATA.subtitle}</p>
            <div className="atgt-meta-tags">
              <span>🏛️ UBND xã Đăk Pxi</span>
              <span className="sep">•</span>
              <span>📋 Phòng Văn hóa - Xã hội</span>
              <span className="sep">•</span>
              <span>🏔️ Tỉnh Quảng Ngãi</span>
            </div>
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
              <span className="audio-icon">{speaking ? '⏹' : '📢'}</span>
              <span>{speaking ? 'Dừng đọc phát thanh' : 'Nghe loa đọc tuyên truyền'}</span>
            </button>
          </div>
        </div>

        {/* ── KHUNG BỐ CỤC 2 CỘT (Cột trái chính + Cột phải Sidebar) ── */}
        <div className="atgt-layout">

          {/* ════════════ CỘT TRÁI (MAIN CONTENT) ════════════ */}
          <div className="atgt-main">

            {/* Mô tả tuyên truyền */}
            <section className="atgt-section">
              <p className="atgt-content-lead">{DATA.content}</p>
            </section>

            {/* ── HƯỚNG DẪN TRỰC QUAN: TỪNG BƯỚC ĐI LIỀN VỚI ẢNH TO RỘNG ── */}
            <section className="atgt-section atgt-visual-section">
              <div className="atgt-steps-header">
                <h2 className="atgt-section-title">📋 Hướng dẫn an toàn giao thông từng bước trực quan</h2>
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

                    {/* Ảnh TO RỘNG minh họa sinh động */}
                    <div className="atgt-vstep-img-box" onClick={() => setActiveImg(step.img)}>
                      <img src={step.img} alt={step.title} className="atgt-vstep-img" />
                      <div className="atgt-vstep-img-badge">
                        <span>🔍 Bấm phóng to ảnh xem chi tiết</span>
                      </div>
                    </div>

                    {/* Nội dung chi tiết & Điểm cần nhớ */}
                    <div className="atgt-vstep-content">
                      <p className="atgt-vstep-desc">{step.desc}</p>
                      
                      <div className="atgt-vstep-highlights">
                        <strong>📌 Lưu ý quan trọng cho bà con:</strong>
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

            {/* ── Bộ thiết bị an toàn cần có ── */}
            <section className="atgt-section">
              <h2 className="atgt-section-title">🎒 Thiết bị an toàn bắt buộc khi tham gia giao thông</h2>
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

          {/* ════════════ CỘT PHẢI (SIDEBAR - TỪ DƯỚI LÊN) ════════════ */}
          <aside className="atgt-sidebar">

            {/* 🚨 Số điện thoại khẩn cấp */}
            <div className="atgt-box atgt-box--danger">
              <div className="atgt-box-title">🚨 Số điện thoại hỗ trợ khẩn cấp</div>
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

            {/* ⚠️ Lưu ý quan trọng */}
            <div className="atgt-box">
              <div className="atgt-box-title">⚠️ Lưu ý an toàn giao thông</div>
              <ul className="atgt-warning-list">
                {DATA.warning.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            {/* 🏛️ KHUNG CỔNG THÔNG TIN PHÁP LUẬT QUỐC GIA */}
            <div className="atgt-box atgt-box--law">
              <div className="atgt-box-title">🏛️ Cổng Thông tin Pháp luật Quốc gia</div>
              <p className="atgt-law-box-desc">Tra cứu chính thức các quy định Luật Giao thông đường bộ & Nghị định xử phạt:</p>
              <div className="atgt-sidebar-law-links">
                <a
                  href="https://vbpl.vn/TW/Pages/home.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="atgt-side-law-btn"
                >
                  <span className="ico">📚</span>
                  <div>
                    <strong>Cơ sở dữ liệu VBPL Quốc gia</strong>
                    <span>vbpl.vn — Tra cứu Luật GTĐB</span>
                  </div>
                  <span className="arr">↗</span>
                </a>

                <a
                  href="https://phapluat.gov.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="atgt-side-law-btn secondary"
                >
                  <span className="ico">⚖️</span>
                  <div>
                    <strong>Cổng Thông tin Pháp luật Quốc gia</strong>
                    <span>phapluat.gov.vn — Hệ thống văn bản</span>
                  </div>
                  <span className="arr">↗</span>
                </a>

                <a
                  href="https://luatvietnam.vn/giao-thong.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="atgt-side-law-btn accent"
                >
                  <span className="ico">🔍</span>
                  <div>
                    <strong>Mức phạt Nghị định 100 & 123</strong>
                    <span>Tra cứu mức phạt vi phạm ATGT</span>
                  </div>
                  <span className="arr">↗</span>
                </a>
              </div>
            </div>

            {/* 📢 Khung Thông điệp tuyên truyền */}
            <div className="atgt-box atgt-box--slogan">
              <div className="atgt-box-title">📢 Thông điệp tuyên truyền</div>
              <blockquote className="atgt-slogan-text">
                "{DATA.slogans[sloganIdx]}"
              </blockquote>
            </div>

          </aside>

        </div>
      </div>

      {/* ── MODAL XEM ẢNH RÕ NẾT ── */}
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
