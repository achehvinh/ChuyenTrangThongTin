import { useState } from "react";
import TTSButton from "../components/TTSButton";
import QuizGame from "./QuizGame";
import "./DuoiNuocPage.css";

// ── BỘ ICON SVG CHUẨN HTML5 (TAILWIND STYLED VECTOR ICONS) ──
const SvgIcons = {
  Swimmer: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2" />
      <path d="M2 14c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2" />
      <circle cx="16" cy="5" r="2" />
      <path d="m5 12 5-3 4 2 4-2" />
    </svg>
  ),
  Child: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    </svg>
  ),
  Adult: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21v-2a6 6 0 0 1 13 0v2" />
    </svg>
  ),
  Gamepad: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <circle cx="15" cy="13" r="1" />
      <circle cx="18" cy="11" r="1" />
      <rect width="20" height="12" x="2" y="6" rx="6" />
    </svg>
  ),
  Trophy: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  Prohibition: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m4.9 4.9 14.2 14.2" />
    </svg>
  ),
  Users: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  LifeJacket: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v18l6-3 6 3V3" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Megaphone: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  ),
  Video: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect width="15" height="14" x="1" y="5" rx="2" ry="2" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Lightbulb: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  ),
  Mute: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="15" x2="16" y2="15" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  Waves: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  ),
  Eye: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Arm: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-4e-1a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2H8.83a2 2 0 0 0-1.41.59L6 19" />
      <path d="M18 6a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4h6V6Z" />
    </svg>
  ),
  Ambulance: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="10" x="1" y="8" rx="2" />
      <polygon points="17 8 23 11 23 18 17 18 17 8" />
      <circle cx="6.5" cy="18.5" r="2.5" />
      <circle cx="17.5" cy="18.5" r="2.5" />
      <line x1="8" y1="13" x2="10" y2="13" />
      <line x1="9" y1="12" x2="9" y2="14" />
    </svg>
  ),
  Truck: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="12" x="1" y="6" rx="2" />
      <polygon points="17 10 23 13 23 18 17 18 17 10" />
      <circle cx="6.5" cy="18.5" r="2.5" />
      <circle cx="17.5" cy="18.5" r="2.5" />
    </svg>
  ),
  ShieldPolice: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="11" r="3" />
    </svg>
  ),
  Star: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
};

// ─── Tab: Dành cho bé ────────────────────────────────
function ChildTab() {
  return (
    <div className="dn-tab-content space-y-6">
      {/* Khung nghe bài học bằng giọng đọc */}
      <div className="dn-study-header">
        <TTSButton
          type="child"
          label="Nghe cô giáo đọc bài học"
          title="Bài học phòng chống đuối nước dành cho các bé"
        />
        <div className="dn-achievement-card">
          <span className="dn-badge-icon"><SvgIcons.Trophy /></span>
          <div>
            <h4 className="font-bold text-slate-800">Thử thách Hiệp sĩ</h4>
            <p className="text-sm text-slate-600">Bé hãy học kỹ bài học rồi qua tab "Trò chơi" để nhận Bằng khen nhé!</p>
          </div>
        </div>
      </div>

      {/* Bài học bằng hình ảnh trực quan */}
      <section className="dn-visual-section">
        <h3 className="dn-section-title">
          <SvgIcons.Star />
          <span>4 Quy Tắc An Toàn Bé Cần Nhớ</span>
        </h3>
        <div className="dn-visual-grid">
          <div className="dn-visual-card danger">
            <span className="dn-card-emoji text-rose-600"><SvgIcons.Prohibition /></span>
            <h4>Không tự ý tắm sông, ao hồ</h4>
            <p>Tuyệt đối không tự ý ra sông, suối, ao, hồ, kênh rạch để tắm hoặc chơi đùa khi không có người lớn.</p>
          </div>

          <div className="dn-visual-card success">
            <span className="dn-card-emoji text-emerald-600"><SvgIcons.Users /></span>
            <h4>Luôn đi cùng người lớn</h4>
            <p>Khi đi bơi, tắm biển hoặc dã ngoại gần nguồn nước, bé bắt buộc phải đi cùng cha mẹ hoặc người bảo hộ biết bơi.</p>
          </div>

          <div className="dn-visual-card info">
            <span className="dn-card-emoji text-sky-600"><SvgIcons.LifeJacket /></span>
            <h4>Mặc áo phao đúng cách</h4>
            <p>Luôn mặc áo phao vừa vặn với người khi tắm, đi tàu thuyền, ca nô hoặc chơi đùa gần sông nước.</p>
          </div>

          <div className="dn-visual-card warning">
            <span className="dn-card-emoji text-amber-600"><SvgIcons.Megaphone /></span>
            <h4>Hét to để kêu cứu</h4>
            <p>Nếu thấy có người rơi xuống nước hoặc bản thân gặp nguy hiểm, hãy hét thật to kêu gọi người lớn đến giúp.</p>
          </div>
        </div>
      </section>

      {/* Video bài học sinh động */}
      <section className="dn-media-section">
        <div className="dn-card">
          <h3 className="dn-section-title">
            <SvgIcons.Video />
            <span>Video phim hoạt hình hướng dẫn kỹ năng</span>
          </h3>
          <div className="dn-video-wrapper">
            <video controls className="dn-video-frame" poster="https://cdc.ninhbinh.gov.vn/upload/100765/20240719/Canh-bao-duoi-nuoc-mua-he-1_c06c0.jpg">
              <source src="/video/duoi_nuoc1.mp4" type="video/mp4" />
              Trình duyệt của bé không hỗ trợ xem video.
            </video>
          </div>
        </div>

        {/* Biển cảnh báo */}
        <div className="dn-warning-banner">
          <span className="dn-warning-icon text-amber-500"><SvgIcons.AlertTriangle /></span>
          <div>
            <strong>CẢNH BÁO NGUY HIỂM:</strong>
            <p>Khu vực ao, hồ, sông, suối quanh xã Đăk Pxi có độ sâu lớn và dòng nước chảy xiết nguy hiểm. Các em nhỏ không được tự ý đến gần!</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Tab: Người lớn ──────────────────────────────────
function AdultTab() {
  const callNumber = (num) => {
    window.location.href = `tel:${num}`;
  };

  return (
    <div className="dn-tab-content space-y-6">
      {/* Header hướng dẫn */}
      <div className="dn-study-header">
        <TTSButton
          type="adult"
          label="Nghe hướng dẫn sơ cứu nhanh"
          title="Kỹ năng nhận biết và sơ cứu đuối nước cho người lớn"
        />
        <div className="dn-achievement-card info">
          <span className="dn-badge-icon text-amber-500"><SvgIcons.Lightbulb /></span>
          <div>
            <h4 className="font-bold text-slate-800">Thông tin hữu ích</h4>
            <p className="text-sm text-slate-600">Ghi nhớ các dấu hiệu im lặng của người đang đuối nước để ứng phó kịp thời.</p>
          </div>
        </div>
      </div>

      {/* Nhận biết dấu hiệu */}
      <section className="dn-signs-section">
        <h3 className="dn-section-title">
          <SvgIcons.AlertTriangle />
          <span>Nhận biết Dấu Hiệu Đuối Nước Im Lặng</span>
        </h3>
        <p className="dn-section-intro">Không giống như trên phim ảnh, người bị đuối nước thực tế thường <strong>không thể kêu cứu</strong> hoặc vẫy tay. Hãy chú ý các biểu hiện sau:</p>
        
        <div className="dn-signs-grid">
          <div className="dn-sign-card">
            <span className="dn-sign-icon text-slate-600"><SvgIcons.Mute /></span>
            <h4>Không thể kêu la</h4>
            <p>Hệ hô hấp tập trung vào việc thở, nạn nhân không thể mở miệng để phát ra âm thanh.</p>
          </div>
          <div className="dn-sign-card">
            <span className="dn-sign-icon text-sky-600"><SvgIcons.Waves /></span>
            <h4>Mặt/Đầu chìm dần</h4>
            <p>Miệng chìm sát mặt nước, đầu ngửa ra sau hoặc hướng về phía trước một cách bất lực.</p>
          </div>
          <div className="dn-sign-card">
            <span className="dn-sign-icon text-indigo-600"><SvgIcons.Eye /></span>
            <h4>Mắt đờ đẫn, trống rỗng</h4>
            <p>Mắt nhắm nghiền hoặc mở to nhưng vô thần, lờ đờ, không thể tập trung nhìn vào ai.</p>
          </div>
          <div className="dn-sign-card">
            <span className="dn-sign-icon text-emerald-600"><SvgIcons.Arm /></span>
            <h4>Vùng vẫy yếu ớt</h4>
            <p>Hai tay quạt ngang mặt nước như muốn leo thang nhưng không thể nhô cao hay vẫy chào.</p>
          </div>
        </div>
      </section>

      {/* Các bước sơ cứu */}
      <section className="dn-rescue-section">
        <h3 className="dn-section-title">
          <SvgIcons.LifeJacket />
          <span>5 Bước Sơ Cứu Đuối Nước Khẩn Cấp</span>
        </h3>
        <div className="dn-rescue-list">
          <div className="dn-rescue-step">
            <div className="dn-step-number">1</div>
            <div className="dn-step-body">
              <h4>Gọi trợ giúp &amp; Đảm bảo an toàn</h4>
              <p>Hét to kêu gọi những người xung quanh giúp đỡ. <strong>Tuyệt đối không nhảy xuống nước cứu người</strong> nếu bạn không biết bơi hoặc không có kỹ năng cứu hộ chuyên nghiệp.</p>
            </div>
          </div>

          <div className="dn-rescue-step">
            <div className="dn-step-number">2</div>
            <div className="dn-step-body">
              <h4>Sử dụng vật trung gian để kéo</h4>
              <p>Nhanh chóng ném phao cứu sinh, dây thừng, sào tre, hoặc cành cây dài để nạn nhân dưới nước bám vào và kéo họ dần vào bờ.</p>
            </div>
          </div>

          <div className="dn-rescue-step">
            <div className="dn-step-number">3</div>
            <div className="dn-step-body">
              <h4>Đưa lên bờ &amp; Kiểm tra tỉnh táo</h4>
              <p>Đặt nạn nhân nằm ngửa trên mặt đất bằng phẳng, khô ráo và cứng. Kiểm tra xem nạn nhân còn thở hoặc có phản ứng hay không.</p>
            </div>
          </div>

          <div className="dn-rescue-step">
            <div className="dn-step-number">4</div>
            <div className="dn-step-body">
              <h4>Ép tim &amp; Hô hấp nhân tạo</h4>
              <p>Nếu nạn nhân ngừng thở, thực hiện ngay lập tức chu kỳ: ép tim ngoài lồng ngực 30 lần rồi thổi ngạt cứu hộ 2 lần. Làm liên tục không ngừng.</p>
            </div>
          </div>

          <div className="dn-rescue-step">
            <div className="dn-step-number">5</div>
            <div className="dn-step-body">
              <h4>Gọi 115 &amp; Giữ ấm cơ thể</h4>
              <p>Gọi ngay cấp cứu y tế 115. Cởi bỏ quần áo ướt, lau khô người và ủ ấm bằng chăn/áo ấm trong khi đợi nhân viên y tế tới.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nút gọi khẩn cấp */}
      <section className="dn-emergency-section">
        <h3 className="dn-section-title">
          <SvgIcons.Phone />
          <span>Danh bạ điện thoại khẩn cấp</span>
        </h3>
        <div className="dn-emergency-grid">
          <button className="dn-emergency-btn medical" onClick={() => callNumber("115")}>
            <span className="btn-icon"><SvgIcons.Ambulance /></span>
            <div>
              <span className="btn-num">115</span>
              <span className="btn-label">Cấp cứu Y tế</span>
            </div>
          </button>
          <button className="dn-emergency-btn fire" onClick={() => callNumber("114")}>
            <span className="btn-icon"><SvgIcons.Truck /></span>
            <div>
              <span className="btn-num">114</span>
              <span className="btn-label">Cứu hộ - Cứu nạn</span>
            </div>
          </button>
          <button className="dn-emergency-btn police" onClick={() => callNumber("113")}>
            <span className="btn-icon"><SvgIcons.ShieldPolice /></span>
            <div>
              <span className="btn-num">113</span>
              <span className="btn-label">Cảnh sát/Công an</span>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Tab: Trò chơi ─────────────────────────────────
function QuizTab() {
  return (
    <div className="dn-tab-content">
      <QuizGame />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────
const TABS = [
  { id: "child", icon: <SvgIcons.Child />, label: "Dành cho bé", component: <ChildTab /> },
  { id: "adult", icon: <SvgIcons.Adult />, label: "Người lớn", component: <AdultTab /> },
  { id: "quiz", icon: <SvgIcons.Gamepad />, label: "Trò chơi nhận bằng", component: <QuizTab /> },
];

export default function DuoiNuocPage() {
  const [activeTab, setActiveTab] = useState("child");
  const currentTab = TABS.find((t) => t.id === activeTab);

  return (
    <div className="duoinuoc-page">
      {/* Hiệu ứng bong bóng nước bay lên tự nhiên */}
      <div className="dn-bubble-container">
        {[...Array(15)].map((_, i) => (
          <span
            key={i}
            className="dn-bubble"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 8}s`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${10 + Math.random() * 15}px`,
              height: `${10 + Math.random() * 15}px`,
            }}
          />
        ))}
      </div>

      {/* Hero Header Tailwind Styled */}
      <div className="dn-hero">
        <span className="dn-hero-icon"><SvgIcons.Swimmer /></span>
        <h1 className="dn-hero-title">CẨM NANG PHÒNG CHỐNG ĐUỐI NƯỚC</h1>
        <p className="dn-hero-sub">Ủy ban nhân dân xã Đăk Pxi • Vì cuộc sống bình yên của bản làng</p>
        
        {/* Sóng nước SVG */}
        <div className="dn-wave-container">
          <svg className="dn-wave" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C150,90 350,30 500,60 C650,90 850,30 1000,60 C1150,90 1250,60 1300,60 L1300,120 L0,120 Z" fill="#ffffff" />
          </svg>
        </div>
      </div>

      {/* Điều hướng Tabs */}
      <div className="dn-tabs-container">
        <div className="dn-tabs-row">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`dn-tab-btn ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="dn-tab-icon">{t.icon}</span>
              <span className="dn-tab-label">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Thân trang hiển thị nội dung Tab */}
      <main className="dn-page-body">
        {currentTab.component}
      </main>
    </div>
  );
}