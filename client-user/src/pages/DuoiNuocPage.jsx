import { useEffect, useRef, useState } from "react";
import "./DuoiNuocPage.css";
import QuizGame from "./QuizGame";

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

// ── ICON MINH HỌA SVG VECTOR CHUẨN HTML5 CHO TỪNG MỤC KIẾN THỨC ──
const KIcons = {
  Swimmer: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="28" fill="#dbeafe"/><circle cx="38" cy="18" r="5" fill="#0284c7"/><path d="M12 34Q20 28 30 34Q40 40 48 34" stroke="#0284c7" strokeWidth="3" fill="none" strokeLinecap="round"/><path d="M22 26L36 22L32 28" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>),
  LifeVest: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><rect x="6" y="6" width="48" height="48" rx="10" fill="#fef3c7"/><path d="M16 12Q30 8 44 12L48 46L36 48L30 28L24 48L12 46Z" fill="#f97316" stroke="#ea580c" strokeWidth="1.5"/><rect x="20" y="24" width="20" height="4" fill="#fff" rx="2"/><rect x="20" y="34" width="20" height="4" fill="#fff" rx="2"/></svg>),
  NoSwim: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="26" fill="#fff" stroke="#dc2626" strokeWidth="3.5"/><path d="M15 38Q25 32 35 38T50 38" stroke="#0284c7" strokeWidth="2.5" fill="none"/><circle cx="30" cy="20" r="4.5" fill="#0284c7"/><line x1="13" y1="47" x2="47" y2="13" stroke="#dc2626" strokeWidth="3.5"/></svg>),
  Fence: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><rect x="6" y="6" width="48" height="48" rx="10" fill="#dcfce7"/><rect x="12" y="16" width="5" height="30" rx="1" fill="#16a34a"/><rect x="27" y="16" width="5" height="30" rx="1" fill="#16a34a"/><rect x="42" y="16" width="5" height="30" rx="1" fill="#16a34a"/><rect x="12" y="22" width="35" height="4" rx="1" fill="#22c55e"/><rect x="12" y="34" width="35" height="4" rx="1" fill="#22c55e"/></svg>),
  Warning: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><path d="M30 8L54 50H6Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round"/><text x="30" y="42" textAnchor="middle" fontSize="22" fontWeight="900" fill="#7c2d12">!</text></svg>),
  River: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><rect x="6" y="6" width="48" height="48" rx="10" fill="#dbeafe"/><path d="M10 26Q20 20 30 26Q40 32 50 26" stroke="#0284c7" strokeWidth="2.5" fill="none" strokeLinecap="round"/><path d="M10 36Q20 30 30 36Q40 42 50 36" stroke="#0369a1" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>),
  Hole: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><rect x="6" y="6" width="48" height="48" rx="10" fill="#fef9c3"/><ellipse cx="30" cy="36" rx="18" ry="10" fill="#78350f" opacity="0.3"/><path d="M18 28V38Q30 48 42 38V28Q30 18 18 28Z" fill="#92400e" opacity="0.5"/></svg>),
  Well: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><rect x="6" y="6" width="48" height="48" rx="10" fill="#e0e7ff"/><circle cx="30" cy="32" r="12" fill="#e2e8f0" stroke="#64748b" strokeWidth="2"/><circle cx="30" cy="32" r="5" fill="#0284c7"/><rect x="28" y="12" width="4" height="12" fill="#64748b" rx="1"/><rect x="20" y="10" width="20" height="4" rx="2" fill="#475569"/></svg>),
  Pool: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><rect x="6" y="6" width="48" height="48" rx="10" fill="#dbeafe"/><rect x="12" y="20" width="36" height="24" rx="4" fill="#bae6fd" stroke="#0284c7" strokeWidth="2"/><path d="M12 30Q20 26 28 30Q36 34 44 30" stroke="#0284c7" strokeWidth="2" fill="none"/></svg>),
  Flood: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><rect x="6" y="6" width="48" height="48" rx="10" fill="#dbeafe"/><path d="M8 32Q16 26 24 32Q32 38 40 32Q48 26 52 30" stroke="#0284c7" strokeWidth="3" fill="none" strokeLinecap="round"/><path d="M8 42Q16 36 24 42Q32 48 40 42Q48 36 52 40" stroke="#0369a1" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>),
  Shout: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="28" fill="#fef3c7"/><circle cx="30" cy="20" r="7" fill="#fed7aa"/><path d="M20 32Q30 26 40 32V48H20Z" fill="#f97316"/><path d="M42 18L50 14M42 22L52 22M42 26L50 30" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/></svg>),
  NoDive: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="28" fill="#fee2e2"/><circle cx="30" cy="18" r="5" fill="#dc2626"/><path d="M24 28L30 36L36 28" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round"/><line x1="12" y1="48" x2="48" y2="12" stroke="#dc2626" strokeWidth="3"/></svg>),
  Rope: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="28" fill="#dcfce7"/><circle cx="22" cy="18" r="5" fill="#fed7aa"/><path d="M16 28Q22 24 28 28V44H16Z" fill="#16a34a"/><path d="M28 30Q36 24 48 28" stroke="#92400e" strokeWidth="3" strokeLinecap="round" fill="none"/><circle cx="48" cy="28" r="6" fill="#f97316" stroke="#ea580c" strokeWidth="1.5"/></svg>),
  Pull: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><rect x="6" y="6" width="48" height="48" rx="10" fill="#ede9fe"/><circle cx="20" cy="20" r="5" fill="#fed7aa"/><path d="M14 30Q20 26 26 30V44H14Z" fill="#7c3aed"/><path d="M26 32L38 28" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round"/><circle cx="42" cy="34" r="5" fill="#fed7aa"/></svg>),
  Phone114: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="28" fill="#fee2e2"/><circle cx="30" cy="30" r="18" fill="#ef4444"/><path d="M22 22Q24 32 34 34L38 30L33 26L31 28Q28 26 26 23L28 21Z" fill="#fff"/></svg>),
  CPR1: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><rect x="6" y="6" width="48" height="48" rx="10" fill="#dbeafe"/><path d="M14 32H46" stroke="#0284c7" strokeWidth="2"/><circle cx="30" cy="24" r="6" fill="#fed7aa"/><path d="M22 32Q30 28 38 32V46H22Z" fill="#0284c7"/></svg>),
  CPR2: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><rect x="6" y="6" width="48" height="48" rx="10" fill="#dcfce7"/><circle cx="30" cy="20" r="5" fill="#fed7aa"/><path d="M24 28Q30 24 36 28V34H24Z" fill="#16a34a"/><path d="M28 36L30 44L32 36" stroke="#16a34a" strokeWidth="2.5" fill="none"/></svg>),
  CPR3: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><rect x="6" y="6" width="48" height="48" rx="10" fill="#fef3c7"/><path d="M20 30L28 24L28 28L40 28L40 32L28 32L28 36Z" fill="#f59e0b"/><circle cx="16" cy="30" r="4" fill="#f59e0b"/></svg>),
  CPR4: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><rect x="6" y="6" width="48" height="48" rx="10" fill="#fee2e2"/><path d="M20 20L30 12L40 20Z" fill="#ef4444"/><rect x="22" y="20" width="16" height="18" fill="#fca5a5"/><rect x="28" y="24" width="4" height="6" fill="#ef4444"/></svg>),
  Blanket: () => (<svg width="48" height="48" viewBox="0 0 60 60" fill="none"><rect x="6" y="6" width="48" height="48" rx="10" fill="#ede9fe"/><circle cx="30" cy="22" r="6" fill="#fed7aa"/><path d="M16 30Q30 24 44 30V48H16Z" fill="#7c3aed" opacity="0.7"/><path d="M18 32Q30 26 42 32V46H18Z" fill="#8b5cf6" opacity="0.5"/></svg>),
};

const KNOWLEDGE_DETAILS = [
  {
    id: 1, badge: "🎯",
    title: "Vì sao trẻ em và người dân dễ bị đuối nước?",
    summary: "Nhận biết các nguyên nhân cốt lõi gây tai nạn đuối nước thương tâm để phòng tránh hiệu quả.",
    content: [
      { text: "Không biết bơi hoặc chưa được trang bị kỹ năng an toàn trong môi trường nước.", Icon: KIcons.Swimmer },
      { text: "Thiếu sự giám sát trực tiếp của cha mẹ, người lớn khi chơi gần ao, hồ, sông, suối, kênh rạch.", Icon: KIcons.NoDive },
      { text: "Tự ý tắm sông suối một mình hoặc đi tắm vào buổi trưa, thời điểm nắng nóng dễ bị co thắt cơ (chuột rút).", Icon: KIcons.NoSwim },
      { text: "Do hoảng loạn khi ngã xuống nước, hít phải nước vào phổi gây ngạt thở và chìm nhanh chóng.", Icon: KIcons.River },
      { text: "Chủ quan tại các công trình xây dựng có hố sâu tích nước hoặc khu vực cảnh báo nguy hiểm không có rào chắn.", Icon: KIcons.Warning }
    ]
  },
  {
    id: 2, badge: "⚠️",
    title: "Những nơi tiềm ẩn nguy cơ đuối nước nguy hiểm",
    summary: "Các địa điểm cần đặc biệt chú ý và phòng ngừa tai nạn bất ngờ.",
    content: [
      { text: "Ao, hồ, sông, suối, kênh rạch có mực nước sâu, dòng chảy xiết hoặc lòng sông sạt lở.", Icon: KIcons.River },
      { text: "Các hố công trình xây dựng, hố móng đào dở đọng nước mưa không có biển cảnh báo và nắp đậy.", Icon: KIcons.Hole },
      { text: "Giếng nước, bể nước ngầm, lu/chậu chứa nước sinh hoạt gia đình không có nắp đậy an toàn.", Icon: KIcons.Well },
      { text: "Bể bơi công cộng không có nhân viên cứu hộ túc trực hoặc khu vực nước sâu dành cho người lớn.", Icon: KIcons.Pool },
      { text: "Các vùng lũ lụt, suối chảy xiết vào mùa mưa bão.", Icon: KIcons.Flood }
    ]
  },
  {
    id: 3, badge: "🛡️",
    title: "Biện pháp phòng tránh đuối nước hiệu quả",
    summary: "Các nguyên tắc vàng để bảo vệ an toàn bản thân và trẻ em.",
    content: [
      { text: "Cho trẻ em học bơi an toàn và rèn luyện kỹ năng thả nổi ngửa từ sớm.", Icon: KIcons.Swimmer },
      { text: "Luôn mặc áo phao bảo hộ đúng quy cách khi tham gia giao thông đường thủy hoặc chơi đùa gần sông nước.", Icon: KIcons.LifeVest },
      { text: "Tuyệt đối không đi tắm sông, suối, ao, hồ một mình hoặc chỉ rủ các bạn nhỏ đi cùng.", Icon: KIcons.NoSwim },
      { text: "Làm rào chắn an toàn xung quanh ao hồ gia đình; đậy nắp kín tất cả lu, bể chứa nước.", Icon: KIcons.Fence },
      { text: "Chấp hành nghiêm các biển cảnh báo nguy hiểm, biển cấm tắm tại địa phương.", Icon: KIcons.Warning }
    ]
  },
  {
    id: 4, badge: "🔑",
    title: "Kỹ năng xử lý khi gặp người bị đuối nước",
    summary: "Quy tắc cứu hộ an toàn từ trên bờ - Bảo vệ tính mạng cho cả người cứu và nạn nhân.",
    content: [
      { text: "Bước 1: Hô to thật lớn để gọi người lớn xung quanh đến cứu giúp ngay lập tức.", Icon: KIcons.Shout },
      { text: "Bước 2: Tuyệt đối KHÔNG tự ý nhảy xuống nước cứu người nếu em chưa có kỹ năng bơi cứu hộ chuyên nghiệp.", Icon: KIcons.NoDive },
      { text: "Bước 3: Đứng chắc chắn trên bờ, tìm vật dụng trung gian như sào tre, cành cây dài, dây thừng hoặc ném phao nổi cho nạn nhân bám vào.", Icon: KIcons.Rope },
      { text: "Bước 4: Kéo nạn nhân vào bờ một cách cẩn trọng và giữ an toàn cho bản thân.", Icon: KIcons.Pull },
      { text: "Bước 5: Gọi ngay số điện thoại khẩn cấp 114 (Cứu hộ) hoặc 115 (Cấp cứu y tế).", Icon: KIcons.Phone114 }
    ]
  },
  {
    id: 5, badge: "⚙️",
    title: "Hướng dẫn kỹ thuật sơ cứu ban đầu (CPR)",
    summary: "Các bước sơ cứu sống còn khi đưa nạn nhân đuối nước lên bờ.",
    content: [
      { text: "Đặt nạn nhân nằm ngửa trên mặt phẳng cứng, thoáng mát.", Icon: KIcons.CPR1 },
      { text: "Khai thông đường thở: Kiểm tra và móc sạch dị vật, đờm dãi, đất cát trong miệng nạn nhân.", Icon: KIcons.CPR2 },
      { text: "Nếu nạn nhân ngừng thở: Thực hiện ngay 2 lần hà hơi thổi ngạt và 30 lần ép tim ngoài lồng ngực (tần số 100-120 lần/phút).", Icon: KIcons.CPR3 },
      { text: "Tiếp tục kiên trì thực hiện CPR cho đến khi nạn nhân tự thở lại được hoặc y tế cấp cứu 115 tới nơi.", Icon: KIcons.CPR4 },
      { text: "Lau khô người, ủ ấm cho nạn nhân và đưa ngay đến cơ sở y tế gần nhất.", Icon: KIcons.Blanket }
    ]
  }
];

export default function DuoiNuocPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [bannerImgError, setBannerImgError] = useState(false);
  const [activeKnowledge, setActiveKnowledge] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiMessages, setAiMessages] = useState([
    {
      sender: "bot",
      text: "Xin chào! Tôi là Trợ lý AI Tuyên truyền Phòng chống Đuối nước. Bạn cần tư vấn về kỹ năng sơ cứu, quy tắc an toàn hay tình huống khẩn cấp nào?"
    }
  ]);

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
    const audio = new Audio('/video/duoi-nuoc01.mp3');
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

  const handleSendAiMessage = (queryText) => {
    const text = (queryText || aiQuery).trim();
    if (!text) return;

    const userMsg = { sender: "user", text };
    setAiMessages((prev) => [...prev, userMsg]);
    setAiQuery("");

    setTimeout(() => {
      let reply = "Cảm ơn câu hỏi của bạn. Để đảm bảo an toàn đuối nước, bạn hãy ghi nhớ: Luôn có người lớn đi cùng, mặc áo phao đúng quy cách, ném phao/sào khi gặp nạn và gọi 114/115 ngay khi cần thiết.";
      const lower = text.toLowerCase();
      if (lower.includes("sơ cứu") || lower.includes("cpr") || lower.includes("ép tim")) {
        reply = "Kỹ thuật sơ cứu CPR khi nạn nhân ngừng thở: 1. Đặt nạn nhân nằm ngửa trên mặt phẳng cứng. 2. Làm sạch đờm dãi trong miệng. 3. Thực hiện 2 lần hà hơi thổi ngạt phối hợp 30 lần ép tim lồng ngực. Kiên trì thực hiện đến khi y tế 115 tới.";
      } else if (lower.includes("chuột rút") || lower.includes("vọp bẻ")) {
        reply = "Khi bị chuột rút dưới nước: Hãy giữ bình tĩnh, nín thở ngửa đầu ra sau thả nổi ngửa, gọi to người cứu hộ. Không hoảng loạn vẫy vùng sẽ làm nhanh đuối sức.";
      } else if (lower.includes("số điện thoại") || lower.includes("114") || lower.includes("115")) {
        reply = "Số điện thoại khẩn cấp: 114 (Cứu nạn cứu hộ đường thủy/phòng cháy), 115 (Cấp cứu Y tế). Hãy gọi ngay khi phát hiện sự cố.";
      } else if (lower.includes("áo phao") || lower.includes("đi bơi")) {
        reply = "Khi đi bơi/đi thuyền: Luôn chọn áo phao có kích cỡ vừa vặn với cơ thể, cài chặt tất cả các khóa an toàn trước khi xuống nước.";
      }

      setAiMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 500);
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
              <p>Thi trắc nghiệm tình huống vui</p>
            </div>
            <span className="card-arrow-circle"><SvgIcons.ArrowCircleRight /></span>
          </article>

          <article className="feature-card green" onClick={() => setActiveKnowledge(KNOWLEDGE_DETAILS[2])}>
            <div className="card-icon-avatar">
              <SvgIcons.AdultAvatar />
            </div>
            <div className="card-text-body">
              <h3>DÀNH CHO NGƯỜI LỚN</h3>
              <p>Kiến thức bảo vệ gia đình</p>
            </div>
            <span className="card-arrow-circle"><SvgIcons.ArrowCircleRight /></span>
          </article>

          <article className="feature-card orange" onClick={() => setActiveKnowledge(KNOWLEDGE_DETAILS[4])}>
            <div className="card-icon-avatar">
              <SvgIcons.LifebuoyIcon />
            </div>
            <div className="card-text-body">
              <h3>KỸ NĂNG SƠ CỨU</h3>
              <p>Hướng dẫn sơ cứu CPR ban đầu</p>
            </div>
            <span className="card-arrow-circle"><SvgIcons.ArrowCircleRight /></span>
          </article>

          <article className="feature-card red" onClick={() => window.location.href = "tel:114"}>
            <div className="card-icon-avatar">
              <SvgIcons.PhoneRedIcon />
            </div>
            <div className="card-text-body">
              <h3>SỐ ĐIỆN THOẠI KHẨN CẤP</h3>
              <p>Gọi ngay 114 / 115 khi cần</p>
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
              {KNOWLEDGE_DETAILS.map((k, i) => (
                <li key={k.id} onClick={() => setActiveKnowledge(k)}>
                  <span className="k-badge">{k.badge}</span>
                  <span className="k-txt">{k.title}</span>
                  <span className="k-arr">→</span>
                </li>
              ))}
            </ul>

            <div className="box-center-foot">
              <button type="button" className="pill-blue-btn" onClick={() => setActiveKnowledge(KNOWLEDGE_DETAILS[0])}>
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

                <button type="button" className="pill-purple-btn" onClick={() => setShowAiModal(true)}>
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
            <QuizGame onClose={() => setShowQuizModal(false)} />
          </div>
        </div>
      )}

      {/* TRANG CHI TIẾT KIẾN THỨC PHÒNG CHỐNG ĐUỐI NƯỚC — FULL SCREEN */}
      {activeKnowledge && (
        <div className="dn-modal-overlay" style={{ padding: 0 }} onClick={() => setActiveKnowledge(null)}>
          <div className="dn-modal-knowledge-card" onClick={(e) => e.stopPropagation()}>

            <div className="k-modal-header">
              <span className="k-modal-badge">{activeKnowledge.badge}</span>
              <div style={{ flex: 1 }}>
                <h3 className="k-modal-title">{activeKnowledge.title}</h3>
                <p className="k-modal-summary">{activeKnowledge.summary}</p>
              </div>
              <button type="button" className="k-modal-close-circle" onClick={() => setActiveKnowledge(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="k-modal-body">
              <h4 className="k-modal-section-h4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0284c7"><path d="M4 4h16v16H4z" opacity="0.15"/><path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm1 4v2h10V6H7zm0 4v2h10v-2H7zm0 4v2h7v-2H7z" fill="#0284c7"/></svg>
                <span>Nội dung hướng dẫn chi tiết:</span>
              </h4>
              <ul className="k-modal-content-list">
                {activeKnowledge.content.map((item, idx) => {
                  const ItemIcon = item.Icon;
                  return (
                    <li key={idx} className={idx % 2 === 1 ? 'k-row-alt' : ''}>
                      <span className="k-check-circle">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#16a34a"/><path d="M7 12.5l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      <span className="k-item-text">{item.text}</span>
                      <span className="k-item-icon">{ItemIcon && <ItemIcon />}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="k-modal-footer">
              <button type="button" className="k-modal-quiz-btn" onClick={() => { setActiveKnowledge(null); setShowQuizModal(true); }}>
                🎮 Thi trắc nghiệm tình huống →
              </button>
              <button type="button" className="k-modal-close-foot-btn" onClick={() => setActiveKnowledge(null)}>
                ← Quay lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TRỢ LÝ AI TUYÊN TRUYỀN HỎI ĐÁP INTERACTIVE */}
      {showAiModal && (
        <div className="dn-modal-overlay" onClick={() => setShowAiModal(false)}>
          <div className="dn-modal-ai-card" onClick={(e) => e.stopPropagation()}>
            <div className="ai-modal-header">
              <div className="ai-header-title">
                <SvgIcons.AiRobotCute3D />
                <div>
                  <h3>TRỢ LÝ AI TUYÊN TRUYỀN</h3>
                  <span>Tư vấn kỹ năng phòng chống đuối nước 24/7</span>
                </div>
              </div>
              <button type="button" className="dn-modal-close-btn" onClick={() => setShowAiModal(false)}>✕</button>
            </div>

            <div className="ai-modal-chat-body">
              {aiMessages.map((msg, idx) => (
                <div key={idx} className={`ai-chat-bubble ${msg.sender}`}>
                  {msg.sender === "bot" && <span className="bot-avatar-icon">🤖</span>}
                  <div className="bubble-text">{msg.text}</div>
                </div>
              ))}
            </div>

            <div className="ai-quick-prompts">
              <span className="quick-label">Gợi ý hỏi nhanh:</span>
              <button type="button" onClick={() => handleSendAiMessage("Kỹ thuật sơ cứu CPR khi ngừng thở?")}>Sơ cứu CPR</button>
              <button type="button" onClick={() => handleSendAiMessage("Làm gì khi bị chuột rút dưới nước?")}>Xử lý chuột rút</button>
              <button type="button" onClick={() => handleSendAiMessage("Số điện thoại cứu hộ khẩn cấp?")}>Gọi cứu hộ 114</button>
            </div>

            <form className="ai-modal-input-row" onSubmit={(e) => { e.preventDefault(); handleSendAiMessage(); }}>
              <input
                type="text"
                placeholder="Nhập thắc mắc của bạn về phòng chống đuối nước..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
              />
              <button type="submit" className="ai-send-btn">Gửi câu hỏi</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
