import { useState, useEffect, useRef } from 'react';
import './ThienTaiPage.css';

// ── BỘ ICON SVG CHUẨN HTML5 ──
const SvgIcons = {
  AlertTriangle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Wind: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
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
  Image: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Clipboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  ),
  Home: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Package: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  FileText: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  Siren: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 12a5 5 0 0 1 10 0v7H7v-7Z" />
      <path d="M5 19h14" />
      <path d="M12 2v3" />
    </svg>
  ),
  Kit: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M12 11v6" />
      <path d="M9 14h6" />
    </svg>
  ),
  Video: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect width="15" height="14" x="1" y="5" rx="2" ry="2" />
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
  )
};

const DATA = {
  title: 'Phòng chống Thiên tai & Bão lũ',
  subtitle: 'Hướng dẫn chủ động ứng phó thiên tai, bảo vệ tính mạng và tài sản theo phương châm 4 tại chỗ',
  images: [
    '/huong-dan/thien-tai-1.png',
    '/huong-dan/thien-tai-2.png',
    '/huong-dan/thien-tai-3.png',
  ],
  content:
    'Xã Đăk Pxi nằm trong khu vực miền núi có địa hình dốc, mùa mưa bão thường xảy ra lũ quét, lũ ống, sạt lở đất nghiêm trọng và giông lốc mạnh. Để bảo vệ tính mạng và tài sản, bà con cần đặc biệt nâng cao tinh thần cảnh giác, chủ động thực hiện tốt các phương án phòng tránh theo phương châm "4 tại chỗ" (Chỉ huy tại chỗ; Lực lượng tại chỗ; Vật tư, phương tiện tại chỗ; Hậu cần tại chỗ).',
  warning: [
    'Tuyệt đối không đi qua sông, suối, ngầm tràn, cầu phao hoặc vùng ngập sâu khi nước đang dâng cao, dòng chảy xiết.',
    'Không đánh bắt cá, vớt củi trên sông suối khi có lũ.',
    'Không ngủ hoặc ở lại trong các lán trại tạm thời, khu vực sườn dốc có nguy cơ sạt lở cao khi trời mưa lớn kéo dài.',
    'Chủ động ngắt toàn bộ thiết bị điện và cầu dao chính khi nước tràn vào nhà.',
    'Tuyệt đối tuân thủ lệnh di dời, di tản của Ban chỉ huy phòng chống thiên tai địa phương.',
  ],
  steps: [
    {
      stt: '01',
      title: 'Gia cố nhà cửa & Bảo vệ tài sản',
      desc: 'Trước mùa mưa bão, bà con cần kiểm tra và giằng chống mái nhà, cắt tỉa các cành cây cao gần nhà đề phòng đổ gãy. Di chuyển vật nuôi, nông sản và tài sản có giá trị lên các khu vực cao ráo, an toàn.'
    },
    {
      stt: '02',
      title: 'Dự trữ nhu yếu phẩm thiết yếu',
      desc: 'Chuẩn bị sẵn lương thực khô (gạo, mì tôm, lương khô), nước uống đóng chai, diêm, nến, đèn pin và các loại thuốc y tế thông dụng (thuốc cảm sốt, bông băng, thuốc sát trùng) đủ dùng trong ít nhất 3 đến 5 ngày.'
    },
    {
      stt: '03',
      title: 'Bảo vệ giấy tờ & Thiết bị liên lạc',
      desc: 'Bọc kín các giấy tờ tùy thân quan trọng (CCCD, sổ hộ khẩu, giấy tờ đất) trong túi nilon chống nước và cất ở nơi an toàn. Sạc đầy pin điện thoại, chuẩn bị pin dự phòng để duy trì liên lạc với người thân và chính quyền.'
    },
    {
      stt: '04',
      title: 'Theo dõi thông tin & Di tản khẩn cấp',
      desc: 'Thường xuyên lắng nghe thông báo khẩn cấp phát trên loa truyền thanh của xã hoặc từ trưởng thôn. Khi nhận lệnh di tản, lập tức khóa gas, ngắt điện và nhanh chóng di chuyển đến điểm lánh nạn an toàn theo hướng dẫn.'
    },
  ],
  preparednessItems: [
    { title: 'Túi khẩn cấp', desc: 'Đèn pin, còi cứu hộ, pin dự phòng, áo mưa, giấy tờ bọc chống nước.' },
    { title: 'Y tế thiết yếu', desc: 'Thuốc hạ sốt, thuốc tiêu hóa, dầu gió, cồn sát trùng, băng gạc.' },
    { title: 'Thực phẩm khô', desc: 'Mì tôm, nước đóng chai, lương khô, sữa hộp cho trẻ em.' },
  ],
  emergencyPhone: '0339310915',
  videos: [
    {
      type: 'local',
      src: '/video/thien_tai.mp4',
      title: 'Kỹ năng phòng tránh lũ quét',
    },
  ],
};

export default function ThienTaiPage() {
  const [activeImg, setActiveImg] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio('/video/thien-tai.mp3');
    audioRef.current = audio;

    const handleEnded = () => setSpeaking(false);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function playTTSFallback() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const fullText = `Kính mời bà con xã Đăk Pxi lắng nghe hướng dẫn quy trình 4 bước phòng chống thiên tai và bão lũ. ` +
      DATA.steps.map((s, idx) => `Bước ${idx + 1}: ${s.title}. ${s.desc}`).join(' ');

    const u = new SpeechSynthesisUtterance(fullText);
    u.lang = 'vi-VN';
    u.rate = 0.92;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }

  function handleSpeak() {
    if (speaking) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeaking(false);
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play()
          .then(() => {
            setSpeaking(true);
          })
          .catch(() => {
            const altAudio = new Audio('/video/thien-tai.mp3');
            altAudio.play()
              .then(() => {
                audioRef.current = altAudio;
                altAudio.onended = () => setSpeaking(false);
                setSpeaking(true);
              })
              .catch(() => {
                playTTSFallback();
              });
          });
      } else {
        playTTSFallback();
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setSpeaking(true);
          })
          .catch(() => {
            playTTSFallback();
          });
      }
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="tt-page">
      <div className="tt-container">

        {/* ── HEADER ── */}
        <div className="tt-header">
          <div className="tt-header-left">
            <span className="tt-header-badge">
              <SvgIcons.AlertTriangle />
              <span>CẢNH BÁO MÙA MƯA BẢO</span>
            </span>
            <h1 className="tt-title">
              <SvgIcons.Wind />
              <span>{DATA.title}</span>
            </h1>
            <p className="tt-subtitle">{DATA.subtitle}</p>
          </div>

          <div className="tt-header-right">
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
              className={`tt-speak-btn ${speaking ? 'speaking' : ''}`}
              onClick={handleSpeak}
            >
              <span className="audio-icon">{speaking ? <SvgIcons.SquareStop /> : <SvgIcons.VolumeUp />}</span>
              <span>{speaking ? 'Dừng đọc phát thanh' : 'Nghe loa đọc phát thanh'}</span>
            </button>
          </div>
        </div>

        <div className="tt-layout">

          {/* CỘT TRÁI */}
          <div className="tt-main">

            {/* Mô tả */}
            <section className="tt-section">
              <p className="tt-content">{DATA.content}</p>
            </section>

            {/* Hình ảnh thực tế */}
            {DATA.images.length > 0 && (
              <section className="tt-section tt-big-images-section">
                <h2 className="tt-section-title">
                  <SvgIcons.Image />
                  <span>Hình ảnh thực tế & Biển cảnh báo</span>
                </h2>
                <div className="tt-big-img-grid">
                  {DATA.images.map((src, i) => (
                    <div key={i} className="tt-big-img-card" onClick={() => setActiveImg(src)}>
                      <img src={src} alt={`Hình ảnh thiên tai ${i + 1}`} className="tt-big-img" />
                      <div className="tt-big-img-badge">
                        <SvgIcons.Search />
                        <span>Phóng to xem ảnh rõ nét</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Các bước thực hiện */}
            <section className="tt-section tt-steps-canva-section">
              <div className="canva-steps-header">
                <h2 className="tt-section-title">
                  <SvgIcons.Clipboard />
                  <span>Các bước cần thực hiện</span>
                </h2>
                <span className="canva-steps-subtitle">Sơ đồ 4 bước chủ động phòng chống thiên tai dành cho bà con</span>
              </div>

              <div className="canva-steps-flow">
                {DATA.steps.map((s, i) => {
                  const stepIcons = [<SvgIcons.Home key="h"/>, <SvgIcons.Package key="p"/>, <SvgIcons.FileText key="f"/>, <SvgIcons.Siren key="s"/>];
                  const stepTags = ['Trước mưa bão', 'Chuẩn bị 3 - 5 ngày', 'Túi chống nước', 'Khẩn cấp'];
                  return (
                    <div key={i} className={`canva-step-card canva-step-${i + 1}`}>
                      <div className="canva-step-left">
                        <div className="canva-step-num-badge">
                          <span>{s.stt}</span>
                        </div>
                        {i < DATA.steps.length - 1 && <div className="canva-step-line" />}
                      </div>

                      <div className="canva-step-body">
                        <div className="canva-step-top">
                          <span className="canva-step-icon">{stepIcons[i]}</span>
                          <h3 className="canva-step-title">{s.title}</h3>
                          <span className="canva-step-tag">{stepTags[i]}</span>
                        </div>
                        <p className="canva-step-desc">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Túi nhu yếu phẩm */}
            {DATA.preparednessItems && (
              <section className="tt-section tt-preparedness-section">
                <h2 className="tt-section-title">
                  <SvgIcons.Kit />
                  <span>Nhu yếu phẩm khẩn cấp cần chuẩn bị sẵn</span>
                </h2>
                <div className="tt-prep-grid">
                  {DATA.preparednessItems.map((item, i) => (
                    <div key={i} className="tt-prep-card">
                      <div className="tt-prep-icon"><SvgIcons.Kit /></div>
                      <div className="tt-prep-body">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Video */}
            {DATA.videos.length > 0 && (
              <section className="tt-section">
                <h2 className="tt-section-title">
                  <SvgIcons.Video />
                  <span>Video hướng dẫn</span>
                </h2>
                {DATA.videos.map((v, i) => (
                  <div key={i} className="tt-video-wrap">
                    <p className="tt-video-title">{v.title}</p>
                    <video controls className="tt-video">
                      <source src={v.src} type="video/mp4" />
                      Trình duyệt không hỗ trợ video.
                    </video>
                  </div>
                ))}
              </section>
            )}

          </div>

          {/* CỘT PHẢI — Sidebar */}
          <aside className="tt-sidebar">

            {/* Số khẩn cấp */}
            <div className="tt-box tt-box--danger">
              <div className="tt-box-title">
                <SvgIcons.Phone />
                <span>Số điện thoại khẩn cấp</span>
              </div>
              <a href={`tel:${DATA.emergencyPhone}`} className="tt-phone">
                {DATA.emergencyPhone}
              </a>
              <p className="tt-phone-note">UBND xã Đăk Pxi — Trực 24/7 mùa mưa bão</p>
            </div>

            {/* Cảnh báo */}
            <div className="tt-box">
              <div className="tt-box-title">
                <SvgIcons.AlertTriangle />
                <span>Lưu ý quan trọng</span>
              </div>
              <ul className="tt-warning-list">
                {DATA.warning.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            {/* Điểm sơ tán */}
            <div className="tt-box">
              <div className="tt-box-title">
                <SvgIcons.MapPin />
                <span>Điểm sơ tán an toàn</span>
              </div>
              <ul className="tt-place-list">
                <li>Trường tiểu học xã Đăk Pxi</li>
                <li>Nhà văn hóa thôn Pa Cheng</li>
                <li>Trụ sở UBND xã Đăk Pxi</li>
              </ul>
            </div>

          </aside>

        </div>
      </div>

      {/* Lightbox */}
      {activeImg && (
        <div className="tt-lightbox" onClick={() => setActiveImg(null)}>
          <img src={activeImg} alt="Phóng to" />
          <button className="tt-lightbox-close" onClick={() => setActiveImg(null)}>✕</button>
        </div>
      )}

    </div>
  );
}