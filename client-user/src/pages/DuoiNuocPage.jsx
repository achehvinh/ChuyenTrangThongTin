import { useState, useEffect, useRef } from "react";
import QuizGame from "./QuizGame";
import "./DuoiNuocPage.css";

// ── BỘ ICON VÀ MINH HỌA SVG VECTOR CHUẨN 100% THEO THIẾT KẾ MỚI ──
const SvgIcons = {
  // Brand / Header Logo
  ShieldWavesLogo: () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M20 3L5 10V19C5 27.5 11.5 34.5 20 37C28.5 34.5 35 27.5 35 19V10L20 3Z" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
      <path d="M9 18C12 16 15 20 18 18C21 16 24 20 27 18C30 16 31 19 31 19" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),

  // Speaker Icon for Sound Tuyên Truyền
  SpeakerIcon: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 5L6 9H2V15H6L11 19V5Z" />
      <path d="M15.54 8.46A5 5 0 0 1 15.54 15.54" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M19.07 4.93A10 10 0 0 1 19.07 19.07" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    </svg>
  ),

  // Play Icon
  PlayIcon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  ),

  // Arrow Right Circle
  ArrowCircleRight: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 8 16 12 12 16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),

  // 4 Feature Cards Icons
  BoyAvatar: () => (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="#e0f2fe" />
      <circle cx="20" cy="17" r="8" fill="#fed7aa" />
      <path d="M12 15 Q20 7 28 15 Z" fill="#451a03" />
      <path d="M10 35 Q20 28 30 35 V40 H10 Z" fill="#0284c7" />
    </svg>
  ),
  AdultAvatar: () => (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="#dcfce7" />
      <circle cx="20" cy="16" r="8" fill="#fed7aa" />
      <path d="M12 14 Q20 6 28 14 Z" fill="#1e293b" />
      <path d="M10 35 Q20 27 30 35 V40 H10 Z" fill="#16a34a" />
    </svg>
  ),
  LifebuoyIcon: () => (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="#fef3c7" />
      <circle cx="20" cy="20" r="14" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="6" fill="#ffffff" />
      <path d="M20 6 V14 M20 26 V34 M6 20 H14 M26 20 H34" stroke="#ffffff" strokeWidth="3" />
    </svg>
  ),
  PhoneRedIcon: () => (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="#ef4444" />
      <path d="M13 14 Q15 24 25 26 L28 22 L23 18 L21 20 Q18 18 16 15 L18 13 Z" fill="#ffffff" />
    </svg>
  ),

  // 4 ĐIỀU LUÔN GHI NHỚ Icons
  NoSwimCircleIcon: () => (
    <svg width="54" height="54" viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="26" fill="#ffffff" stroke="#dc2626" strokeWidth="4" />
      <path d="M15 38 Q25 32 35 38 T50 38" stroke="#0284c7" strokeWidth="3" />
      <circle cx="30" cy="20" r="5" fill="#0284c7" />
      <line x1="12" y1="48" x2="48" y2="12" stroke="#dc2626" strokeWidth="4" />
    </svg>
  ),
  LifeVestIcon: () => (
    <svg width="54" height="54" viewBox="0 0 60 60" fill="none">
      <path d="M14 10 Q30 5 46 10 L50 48 L36 50 L30 30 L24 50 L10 48 Z" fill="#f97316" stroke="#c2410c" strokeWidth="2.5" />
      <rect x="18" y="24" width="24" height="5" fill="#ffffff" rx="2" />
      <rect x="18" y="35" width="24" height="5" fill="#ffffff" rx="2" />
    </svg>
  ),
  MegaphoneIcon: () => (
    <svg width="54" height="54" viewBox="0 0 60 60" fill="none">
      <path d="M12 24 L26 18 V42 L12 36 Z" fill="#2563eb" />
      <path d="M26 18 L46 10 V50 L26 42 Z" fill="#3b82f6" />
      <ellipse cx="46" cy="30" rx="4" ry="20" fill="#60a5fa" />
      <path d="M18 36 L22 48 H14 L12 36 Z" fill="#1d4ed8" />
    </svg>
  ),
  KidsAdultWalkingIcon: () => (
    <svg width="54" height="54" viewBox="0 0 60 60" fill="none">
      {/* Adult */}
      <circle cx="22" cy="18" r="6" fill="#1e293b" />
      <path d="M14 30 Q22 24 30 30 V50 H14 Z" fill="#2563eb" />
      {/* Kids */}
      <circle cx="40" cy="24" r="5" fill="#f59e0b" />
      <path d="M34 34 Q40 29 46 34 V50 H34 Z" fill="#f97316" />
    </svg>
  ),

  // Nature River Scenery SVG Background for New Hero
  NewHeroScenery: () => (
    <svg className="new-hero-svg-bg" viewBox="0 0 1400 360" preserveAspectRatio="none" fill="none">
      <defs>
        <linearGradient id="skyGradNew" x1="0" y1="0" x2="0" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c7d2fe" />
          <stop offset="35%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#f0f9ff" />
        </linearGradient>
        <linearGradient id="hillGradNew" x1="0" y1="120" x2="0" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="riverGradNew" x1="0" y1="230" x2="0" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="1400" height="260" fill="url(#skyGradNew)" />

      {/* Soft Clouds */}
      <path d="M80 60 Q100 40 130 45 Q150 30 180 40 Q205 35 220 55 H80 Z" fill="#ffffff" opacity="0.8" />
      <path d="M450 50 Q470 35 500 40 Q520 25 550 35 Q575 30 590 50 H450 Z" fill="#ffffff" opacity="0.75" />
      <path d="M850 70 Q870 55 900 60 Q920 45 950 55 Q975 50 990 70 H850 Z" fill="#ffffff" opacity="0.8" />

      {/* Rolling Green Hills */}
      <path d="M0 170 Q350 110 750 160 T1400 150 V280 H0 Z" fill="url(#hillGradNew)" opacity="0.85" />

      {/* Blue River Water */}
      <path d="M0 240 Q450 220 800 250 T1400 235 V360 H0 Z" fill="url(#riverGradNew)" />
      <path d="M120 270 Q240 265 360 270" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <path d="M550 285 Q700 280 850 285" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.65" />

      {/* Green Trees on Right */}
      <circle cx="1320" cy="130" r="45" fill="#15803d" />
      <circle cx="1370" cy="145" r="35" fill="#166534" />
      <rect x="1312" y="170" width="16" height="70" fill="#78350f" />
    </svg>
  ),

  // Father & 2 Kids Illustration
  FatherAndKidsArt: () => (
    <svg width="260" height="190" viewBox="0 0 260 200" fill="none">
      {/* Father Center */}
      <g transform="translate(95, 10)">
        {/* Head */}
        <circle cx="35" cy="28" r="18" fill="#fed7aa" />
        <path d="M18 24 Q35 12 52 24 Q48 15 35 15 Q22 15 18 24 Z" fill="#1e293b" />
        <circle cx="29" cy="26" r="2" fill="#0f172a" />
        <circle cx="41" cy="26" r="2" fill="#0f172a" />
        <path d="M30 35 Q35 40 40 35" stroke="#e11d48" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Body Orange Vest */}
        <path d="M16 46 L54 46 L58 135 L12 135 Z" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
        <rect x="26" y="60" width="18" height="6" fill="#ffffff" rx="2" />
        <rect x="26" y="80" width="18" height="6" fill="#ffffff" rx="2" />
      </g>

      {/* Boy Left */}
      <g transform="translate(30, 45)">
        <circle cx="28" cy="24" r="15" fill="#fde047" />
        <circle cx="28" cy="24" r="14" fill="#fed7aa" />
        <path d="M15 20 Q28 10 41 20 Z" fill="#451a03" />
        <circle cx="23" cy="22" r="1.8" fill="#0f172a" />
        <circle cx="33" cy="22" r="1.8" fill="#0f172a" />
        <path d="M24 30 Q28 34 32 30" stroke="#e11d48" strokeWidth="1.8" fill="none" />
        <path d="M14 38 L42 38 L45 105 L11 105 Z" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
        <rect x="21" y="52" width="14" height="5" fill="#ffffff" rx="1.5" />
      </g>

      {/* Girl Right */}
      <g transform="translate(170, 50)">
        <circle cx="26" cy="22" r="14" fill="#fed7aa" />
        <path d="M12 18 Q26 8 40 18 Q42 40 38 55 H14 Q10 40 12 18 Z" fill="#78350f" />
        <circle cx="21" cy="20" r="1.8" fill="#0f172a" />
        <circle cx="31" cy="20" r="1.8" fill="#0f172a" />
        <path d="M22 28 Q26 32 30 28" stroke="#e11d48" strokeWidth="1.8" fill="none" />
        <path d="M12 36 L40 36 L43 100 L9 100 Z" fill="#f97316" stroke="#ea580c" strokeWidth="2" />
        <rect x="19" y="50" width="14" height="5" fill="#ffffff" rx="1.5" />
      </g>
    </svg>
  ),

  // Red Danger Sign on Right
  DangerSignPost: () => (
    <svg width="100" height="130" viewBox="0 0 110 140" fill="none">
      {/* Wooden Post */}
      <rect x="48" y="70" width="14" height="70" fill="#78350f" rx="2" />
      {/* Signboard */}
      <rect x="10" y="10" width="90" height="75" rx="8" fill="#ffffff" stroke="#dc2626" strokeWidth="4" />
      <text x="55" y="24" textAnchor="middle" fill="#dc2626" fontSize="8" fontWeight="900">KHU VỰC</text>
      {/* Prohibition Swimming Circle */}
      <circle cx="55" cy="46" r="16" fill="#ffffff" stroke="#dc2626" strokeWidth="3" />
      <path d="M46 52 Q55 48 64 52" stroke="#0284c7" strokeWidth="2" />
      <line x1="42" y1="58" x2="68" y2="34" stroke="#dc2626" strokeWidth="3" />
      <text x="55" y="72" textAnchor="middle" fill="#dc2626" fontSize="8" fontWeight="900">CẤM TẮM</text>
    </svg>
  ),

  // Lifebuoy Graphic for bottom right
  LifebuoyGround: () => (
    <svg width="80" height="40" viewBox="0 0 100 50" fill="none">
      <ellipse cx="50" cy="25" rx="42" ry="18" fill="#ef4444" stroke="#dc2626" strokeWidth="3" />
      <ellipse cx="50" cy="25" rx="20" ry="8" fill="#38bdf8" />
      <path d="M50 7 V17 M50 33 V43 M12 25 H28 M72 25 H88" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
    </svg>
  ),

  // 3D Cute White & Blue AI Robot Assistant
  AiRobotCute3D: () => (
    <svg width="130" height="150" viewBox="0 0 140 160" fill="none">
      {/* Speech Bubble */}
      <g transform="translate(100, 10)">
        <rect width="36" height="26" rx="10" fill="#c7d2fe" />
        <circle cx="12" cy="13" r="2.5" fill="#4338ca" />
        <circle cx="18" cy="13" r="2.5" fill="#4338ca" />
        <circle cx="24" cy="13" r="2.5" fill="#4338ca" />
      </g>

      {/* Robot Antenna */}
      <line x1="70" y1="15" x2="70" y2="30" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" />
      <circle cx="70" cy="12" r="7" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />

      {/* Head Outer */}
      <rect x="30" y="30" width="80" height="60" rx="24" fill="url(#headGrad3d)" stroke="#0284c7" strokeWidth="4" />
      <defs>
        <linearGradient id="headGrad3d" x1="30" y1="30" x2="110" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>

      {/* Head Screen Face */}
      <rect x="42" y="42" width="56" height="36" rx="14" fill="#0f172a" />

      {/* Eyes Glowing Blue */}
      <ellipse cx="58" cy="60" rx="6" ry="7" fill="#38bdf8" />
      <ellipse cx="82" cy="60" rx="6" ry="7" fill="#38bdf8" />
      <circle cx="60" cy="57" r="2" fill="#ffffff" />
      <circle cx="84" cy="57" r="2" fill="#ffffff" />

      {/* Ears */}
      <rect x="22" y="48" width="8" height="24" rx="4" fill="#0284c7" />
      <rect x="110" y="48" width="8" height="24" rx="4" fill="#0284c7" />

      {/* Body */}
      <rect x="40" y="94" width="60" height="50" rx="20" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
      <circle cx="70" cy="118" r="8" fill="#0284c7" />
      <path d="M66 118 L74 118" stroke="#ffffff" strokeWidth="2" />

      {/* Hands */}
      <path d="M40 105 Q25 115 30 130" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M100 105 Q115 115 110 130" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  )
};

const FAQ_DATA = [
  { q: "Trẻ bao nhiêu tuổi nên học bơi?", a: "Trẻ em từ 4 - 6 tuổi có thể bắt đầu học các kỹ năng làm quen với nước và các động tác bơi cơ bản dưới sự hướng dẫn trực tiếp của huấn luyện viên." },
  { q: "Khi thấy người bị đuối nước phải làm gì?", a: "Tuyệt đối không nhảy xuống nước cứu người nếu không biết bơi! Hãy hô hoán kêu gọi người lớn, ném phao cứu sinh, sào tre hoặc dây thừng kéo nạn nhân vào bờ và gọi cấp cứu 114 / 112 ngay." },
  { q: "Có nên nhảy xuống cứu người bị đuối nước?", a: "Chỉ người biết bơi giỏi và có kỹ năng cứu đuối chuyên nghiệp mới nên nhảy xuống. Nếu không, nguy cơ nạn nhân hoảng loạn kéo chìm cả hai là rất cao." },
  { q: "Làm sao để gọi cứu hộ nhanh nhất?", a: "Gọi trực tiếp đến số điện thoại khẩn cấp 114 (Cứu nạn cứu hộ) hoặc số điện thoại công an / trạm y tế địa phương được niêm yết sẵn." }
];

const VIDEOS_DATA = [
  { id: 1, title: "Hướng dẫn mặc áo phao đúng cách", src: "/video/duoi_nuoc1.mp4", poster: "https://cdc.ninhbinh.gov.vn/upload/100765/20240719/Canh-bao-duoi-nuoc-mua-he-1_c06c0.jpg" },
  { id: 2, title: "Kỹ năng tự bảo vệ khi đi bơi", src: "/video/duoi_nuoc1.mp4", poster: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=80" },
  { id: 3, title: "Sơ cứu người bị đuối nước", src: "/video/duoi_nuoc1.mp4", poster: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" }
];

export default function DuoiNuocPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [bannerImgError, setBannerImgError] = useState(false);

  const audioRef = useRef(null);

  const playTTS = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const text = "Kính mời bà con và các em học sinh lắng nghe cẩm nang phòng chống đuối nước. An toàn cho trẻ em và cộng đồng.";
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'vi-VN';
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    const audio = new Audio('/video/duoi_nuoc.mp3');
    audioRef.current = audio;

    const handleEnded = () => setSpeaking(false);
    audio.addEventListener('ended', handleEnded);

    // Tự động phát loa tuyên truyền khi vào trang
    const timer = setTimeout(() => {
      audio.currentTime = 0;
      audio.play()
        .then(() => setSpeaking(true))
        .catch(() => {
          // Trình duyệt chặn tự động phát âm thanh MP3 thì dùng giọng đọc TTS
          playTTS();
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      audio.removeEventListener('ended', handleEnded);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeak = () => {
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
          .then(() => setSpeaking(true))
          .catch(() => playTTS());
      } else {
        playTTS();
      }
    }
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="dn-page-v2">

      {/* ════════════ 1. HERO BANNER CHUẨN THIẾT KẾ MỚI ════════════ */}
      <section className={`new-hero-banner ${!bannerImgError ? 'has-custom-cover' : ''}`}>
        {!bannerImgError ? (
          <img 
            src="/huong-dan/anh-biaduoinuoc.jpg" 
            alt="Ảnh bìa Cẩm nang phòng chống đuối nước" 
            className="hero-banner-cover-img"
            onError={() => setBannerImgError(true)}
          />
        ) : (
          <SvgIcons.NewHeroScenery />
        )}

        <div className="new-hero-inner">
          
          {/* Trái: Tiêu đề + Dòng phụ + 2 Nút Action */}
          <div className="hero-left-content">
            <span className="hero-sub-header">CẨM NANG</span>
            <h1 className="hero-main-title">
              PHÒNG CHỐNG<br />ĐUỐI NƯỚC
            </h1>
            <p className="hero-tagline">An toàn cho trẻ em và cộng đồng</p>

            <div className="hero-action-buttons">
              <button type="button" className={`pill-btn-solid ${speaking ? 'speaking' : ''}`} onClick={toggleSpeak}>
                <SvgIcons.SpeakerIcon />
                <span>{speaking ? 'ĐANG PHÁT TUYÊN TRUYỀN...' : 'NGHE TUYÊN TRUYỀN'}</span>
              </button>

              <button type="button" className="pill-btn-white" onClick={() => setActiveVideo(VIDEOS_DATA[0])}>
                <SvgIcons.PlayIcon />
                <span>XEM VIDEO</span>
              </button>
            </div>
          </div>

          {/* Phải: Hình vẽ Bố & Trẻ Em + Biển Cấm Tắm + Phao Cứu Sinh */}
          <div className="hero-right-graphics">
            <div className="art-family">
              <SvgIcons.FatherAndKidsArt />
            </div>

            <div className="art-danger-sign">
              <SvgIcons.DangerSignPost />
            </div>

            <div className="art-lifebuoy-ground">
              <SvgIcons.LifebuoyGround />
            </div>
          </div>

        </div>
      </section>


      {/* ════════════ 2. 4 THẺ CHỨC NĂNG NỀN NHẠT (4 CỘT) ════════════ */}
      <section className="dn-section-4cards">
        <div className="cards-4grid">

          <article className="feature-card blue" onClick={() => setShowQuizModal(true)}>
            <div className="card-icon-avatar">
              <SvgIcons.BoyAvatar />
            </div>
            <div className="card-text-body">
              <h3>DÀNH CHO TRẺ EM</h3>
              <p>Học qua tranh ảnh và tình huống</p>
            </div>
            <span className="card-arrow-circle"><SvgIcons.ArrowCircleRight /></span>
          </article>

          <article className="feature-card green" onClick={() => setShowQuizModal(true)}>
            <div className="card-icon-avatar">
              <SvgIcons.AdultAvatar />
            </div>
            <div className="card-text-body">
              <h3>DÀNH CHO NGƯỜI LỚN</h3>
              <p>Kiến thức cần biết để bảo vệ gia đình</p>
            </div>
            <span className="card-arrow-circle"><SvgIcons.ArrowCircleRight /></span>
          </article>

          <article className="feature-card orange" onClick={() => setShowQuizModal(true)}>
            <div className="card-icon-avatar">
              <SvgIcons.LifebuoyIcon />
            </div>
            <div className="card-text-body">
              <h3>KỸ NĂNG SƠ CỨU</h3>
              <p>Hướng dẫn sơ cứu và xử lý khi có sự cố</p>
            </div>
            <span className="card-arrow-circle"><SvgIcons.ArrowCircleRight /></span>
          </article>

          <article className="feature-card red" onClick={() => window.location.href = "tel:114"}>
            <div className="card-icon-avatar">
              <SvgIcons.PhoneRedIcon />
            </div>
            <div className="card-text-body">
              <h3>SỐ ĐIỆN THOẠI KHẨN CẤP</h3>
              <p>Gọi ngay khi cần hỗ trợ</p>
            </div>
            <span className="card-arrow-circle"><SvgIcons.ArrowCircleRight /></span>
          </article>

        </div>
      </section>


      {/* ════════════ 3. 4 ĐIỀU LUÔN GHI NHỚ ════════════ */}
      <section className="dn-section-remember">
        <h2 className="section-head-title">
          <span className="title-icon">👤</span> 4 ĐIỀU LUÔN GHI NHỚ
        </h2>

        <div className="remember-4grid">

          <article className="remember-card">
            <div className="remember-icon-box">
              <SvgIcons.NoSwimCircleIcon />
            </div>
            <p>Không tắm sông, suối khi không có người lớn</p>
          </article>

          <article className="remember-card">
            <div className="remember-icon-box">
              <SvgIcons.LifeVestIcon />
            </div>
            <p>Luôn mặc áo phao khi đi thuyền</p>
          </article>

          <article className="remember-card">
            <div className="remember-icon-box">
              <SvgIcons.MegaphoneIcon />
            </div>
            <p>Hô to, gọi người lớn khi phát hiện người gặp nạn</p>
          </article>

          <article className="remember-card">
            <div className="remember-icon-box">
              <SvgIcons.KidsAdultWalkingIcon />
            </div>
            <p>Đi cùng người lớn, không chơi gần ao, hồ, sông suối</p>
          </article>

        </div>
      </section>


      {/* ════════════ 4. MAIN BỐ CỤC 2 CỘT (KIẾN THỨC & VIDEO) ════════════ */}
      <section className="dn-section-knowledge-video">
        <div className="split-2col-kv">

          {/* Trái: KIẾN THỨC CẦN BIẾT */}
          <article className="white-box-card card-knowledge">
            <h3 className="box-head-title">
              <span>📘</span> KIẾN THỨC CẦN BIẾT
            </h3>

            <ul className="knowledge-bullet-list">
              <li onClick={() => setShowQuizModal(true)}>
                <span className="k-badge">🎯</span>
                <span className="k-txt">Vì sao dễ bị đuối nước?</span>
                <span className="k-arr">→</span>
              </li>
              <li onClick={() => setShowQuizModal(true)}>
                <span className="k-badge">🎯</span>
                <span className="k-txt">Những nơi tiềm ẩn nguy hiểm</span>
                <span className="k-arr">→</span>
              </li>
              <li onClick={() => setShowQuizModal(true)}>
                <span className="k-badge">🎯</span>
                <span className="k-txt">Cách phòng tránh đuối nước</span>
                <span className="k-arr">→</span>
              </li>
              <li onClick={() => setShowQuizModal(true)}>
                <span className="k-badge">🔑</span>
                <span className="k-txt">Khi gặp người bị đuối nước</span>
                <span className="k-arr">→</span>
              </li>
              <li onClick={() => setShowQuizModal(true)}>
                <span className="k-badge">⚙️</span>
                <span className="k-txt">Hướng dẫn sơ cứu ban đầu</span>
                <span className="k-arr">→</span>
              </li>
            </ul>

            <div className="box-center-foot">
              <button type="button" className="pill-blue-btn" onClick={() => setShowQuizModal(true)}>
                XEM THÊM KIẾN THỨC
              </button>
            </div>
          </article>

          {/* Phải: VIDEO HƯỚNG DẪN */}
          <article className="white-box-card card-video-section">
            <div className="video-head-row">
              <h3 className="box-head-title">
                <span>▶</span> VIDEO HƯỚNG DẪN
              </h3>
              <a href="#tat-ca-video" className="see-all-link">Xem tất cả →</a>
            </div>

            <div className="videos-3grid">
              {VIDEOS_DATA.map((v) => (
                <div key={v.id} className="new-video-card" onClick={() => setActiveVideo(v)}>
                  <div className="video-poster-box">
                    <img src={v.poster} alt={v.title} className="poster-img" />
                    <span className="play-icon-overlay"><SvgIcons.PlayIcon /></span>
                  </div>
                  <h4 className="video-title">{v.title}</h4>
                </div>
              ))}
            </div>

            <div className="pagination-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </article>

        </div>
      </section>


      {/* ════════════ 5. BỐ CỤC 2 CỘT (CÂU HỎI THƯỜNG GẶP & TRỢ LÝ AI) ════════════ */}
      <section className="dn-section-faq-ai">
        <div className="split-2col-faq-ai">

          {/* Trái: CÂU HỎI THƯỜNG GẶP */}
          <article className="white-box-card card-faq-new">
            <h3 className="box-head-title">
              <span>❓</span> CÂU HỎI THƯỜNG GẶP
            </h3>

            <div className="faq-accordion-list">
              {FAQ_DATA.map((faq, i) => (
                <div key={i} className={`faq-item-new ${openFaq === i ? 'open' : ''}`}>
                  <button type="button" className="faq-head-btn" onClick={() => toggleFaq(i)}>
                    <span className="q-text">{faq.q}</span>
                    <span className="q-plus">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="faq-body-text">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="box-center-foot">
              <button type="button" className="pill-outline-btn" onClick={() => setOpenFaq(0)}>
                XEM TẤT CẢ CÂU HỎI
              </button>
            </div>
          </article>

          {/* Phải: TRỢ LÝ AI TUYÊN TRUYỀN */}
          <article className="purple-box-card card-ai-new">
            <h3 className="box-head-title purple">
              <span>🤖</span> TRỢ LÝ AI TUYÊN TRUYỀN
            </h3>

            <div className="ai-new-body flex-row">
              <div className="ai-left-info">
                <p className="ai-intro-text">Tôi có thể giải đáp cho bạn về:</p>
                <ul className="ai-check-list">
                  <li><span className="check">✓</span> Phòng chống đuối nước</li>
                  <li><span className="check">✓</span> Kỹ năng sơ cứu</li>
                  <li><span className="check">✓</span> Các tình huống nguy hiểm</li>
                </ul>

                <button type="button" className="pill-purple-btn" onClick={() => alert("Trợ lý AI sẵn sàng hỗ trợ giải đáp câu hỏi của bạn!")}>
                  💬 HỎI NGAY
                </button>
              </div>

              <div className="ai-right-robot">
                <SvgIcons.AiRobotCute3D />
              </div>
            </div>
          </article>

        </div>
      </section>


      {/* ════════════ 6. MODALS (VIDEO / QUIZ GAME) ════════════ */}
      {activeVideo && (
        <div className="dn-modal-overlay" onClick={() => setActiveVideo(null)}>
          <div className="dn-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="dn-modal-close-btn" onClick={() => setActiveVideo(null)}>✕</button>
            <h3 className="modal-video-title">{activeVideo.title}</h3>
            <video controls autoPlay className="modal-video-player" poster={activeVideo.poster}>
              <source src={activeVideo.src} type="video/mp4" />
              Trình duyệt không hỗ trợ xem video.
            </video>
          </div>
        </div>
      )}

      {showQuizModal && (
        <div className="dn-modal-overlay" onClick={() => setShowQuizModal(false)}>
          <div className="dn-modal-quiz-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="dn-modal-close-btn" onClick={() => setShowQuizModal(false)}>✕ Đóng</button>
            <QuizGame />
          </div>
        </div>
      )}

    </div>
  );
}