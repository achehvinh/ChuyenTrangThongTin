import { useState } from "react";
import TTSButton from "../components/TTSButton";
import QuizGame from "./QuizGame";
import "./DuoiNuocPage.css";

// ─── Tab: Dành cho bé 👦 ────────────────────────────────
function ChildTab() {
  return (
    <div className="dn-tab-content">
      {/* Khung nghe bài học bằng giọng đọc */}
      <div className="dn-study-header">
        <TTSButton
          type="child"
          label="🔊 Nghe cô giáo đọc bài học"
          title="Bài học phòng chống đuối nước dành cho các bé"
        />
        <div className="dn-achievement-card">
          <span className="dn-badge-icon">🏆</span>
          <div>
            <h4>Thử thách Hiệp sĩ</h4>
            <p>Bé hãy học kỹ bài học rồi qua tab "Trò chơi" để nhận Bằng khen nhé!</p>
          </div>
        </div>
      </div>

      {/* Bài học bằng hình ảnh trực quan */}
      <section className="dn-visual-section">
        <h3 className="dn-section-title">🌟 4 Quy Tắc An Toàn Bé Cần Nhớ</h3>
        <div className="dn-visual-grid">
          <div className="dn-visual-card danger">
            <span className="dn-card-emoji">🚫</span>
            <h4>Không tự ý tắm sông, ao hồ</h4>
            <p>Tuyệt đối không tự ý ra sông, suối, ao, hồ, kênh rạch để tắm hoặc chơi đùa khi không có người lớn.</p>
          </div>

          <div className="dn-visual-card success">
            <span className="dn-card-emoji">👨‍👩‍👧‍👦</span>
            <h4>Luôn đi cùng người lớn</h4>
            <p>Khi đi bơi, tắm biển hoặc dã ngoại gần nguồn nước, bé bắt buộc phải đi cùng cha mẹ hoặc người bảo hộ biết bơi.</p>
          </div>

          <div className="dn-visual-card info">
            <span className="dn-card-emoji">🦺</span>
            <h4>Mặc áo phao đúng cách</h4>
            <p>Luôn mặc áo phao vừa vặn với người khi tắm, đi tàu thuyền, ca nô hoặc chơi đùa gần sông nước.</p>
          </div>

          <div className="dn-visual-card warning">
            <span className="dn-card-emoji">📢</span>
            <h4>Hét to để kêu cứu</h4>
            <p>Nếu thấy có người rơi xuống nước hoặc bản thân gặp nguy hiểm, hãy hét thật to kêu gọi người lớn đến giúp.</p>
          </div>
        </div>
      </section>

      {/* Video bài học sinh động */}
      <section className="dn-media-section">
        <div className="dn-card">
          <h3 className="dn-section-title">🎬 Video phim hoạt hình hướng dẫn kỹ năng</h3>
          <div className="dn-video-wrapper">
            <video controls className="dn-video-frame" poster="https://cdc.ninhbinh.gov.vn/upload/100765/20240719/Canh-bao-duoi-nuoc-mua-he-1_c06c0.jpg">
              <source src="/video/duoi_nuoc1.mp4" type="video/mp4" />
              Trình duyệt của bé không hỗ trợ xem video.
            </video>
          </div>
        </div>

        {/* Biển cảnh báo */}
        <div className="dn-warning-banner">
          <span className="dn-warning-icon">⚠️</span>
          <div>
            <strong>CẢNH BÁO NGUY HIỂM:</strong>
            <p>Khu vực ao, hồ, sông, suối quanh xã Đăk Pxi có độ sâu lớn và dòng nước chảy xiết nguy hiểm. Các em nhỏ không được tự ý đến gần!</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Tab: Người lớn 👨 ──────────────────────────────────
function AdultTab() {
  const callNumber = (num) => {
    window.location.href = `tel:${num}`;
  };

  return (
    <div className="dn-tab-content">
      {/* Header hướng dẫn */}
      <div className="dn-study-header">
        <TTSButton
          type="adult"
          label="🔊 Nghe hướng dẫn sơ cứu nhanh"
          title="Kỹ năng nhận biết và sơ cứu đuối nước cho người lớn"
        />
        <div className="dn-achievement-card info">
          <span className="dn-badge-icon">💡</span>
          <div>
            <h4>Thông tin hữu ích</h4>
            <p>Ghi nhớ các dấu hiệu im lặng của người đang đuối nước để ứng phó kịp thời.</p>
          </div>
        </div>
      </div>

      {/* Nhận biết dấu hiệu */}
      <section className="dn-signs-section">
        <h3 className="dn-section-title">⚠️ Nhận biết Dấu Hiệu Đuối Nước Im Lặng</h3>
        <p className="dn-section-intro">Không giống như trên phim ảnh, người bị đuối nước thực tế thường <strong>không thể kêu cứu</strong> hoặc vẫy tay. Hãy chú ý các biểu hiện sau:</p>
        
        <div className="dn-signs-grid">
          <div className="dn-sign-card">
            <span className="dn-sign-icon">😶</span>
            <h4>Không thể kêu la</h4>
            <p>Hệ hô hấp tập trung vào việc thở, nạn nhân không thể mở miệng để phát ra âm thanh.</p>
          </div>
          <div className="dn-sign-card">
            <span className="dn-sign-icon">🌊</span>
            <h4>Mặt/Đầu chìm dần</h4>
            <p>Miệng chìm sát mặt nước, đầu ngửa ra sau hoặc hướng về phía trước một cách bất lực.</p>
          </div>
          <div className="dn-sign-card">
            <span className="dn-sign-icon">👁️</span>
            <h4>Mắt đờ đẫn, trống rỗng</h4>
            <p>Mắt nhắm nghiền hoặc mở to nhưng vô thần, lờ đờ, không thể tập trung nhìn vào ai.</p>
          </div>
          <div className="dn-sign-card">
            <span className="dn-sign-icon">💪</span>
            <h4>Vùng vẫy yếu ớt</h4>
            <p>Hai tay quạt ngang mặt nước như muốn leo thang nhưng không thể nhô cao hay vẫy chào.</p>
          </div>
        </div>
      </section>

      {/* Các bước sơ cứu */}
      <section className="dn-rescue-section">
        <h3 className="dn-section-title">🫁 5 Bước Sơ Cứu Đuối Nước Khẩn Cấp</h3>
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
        <h3 className="dn-section-title">📞 Danh bạ điện thoại khẩn cấp</h3>
        <div className="dn-emergency-grid">
          <button className="dn-emergency-btn medical" onClick={() => callNumber("115")}>
            <span className="btn-icon">🚑</span>
            <div>
              <span className="btn-num">115</span>
              <span className="btn-label">Cấp cứu Y tế</span>
            </div>
          </button>
          <button className="dn-emergency-btn fire" onClick={() => callNumber("114")}>
            <span className="btn-icon">🚒</span>
            <div>
              <span className="btn-num">114</span>
              <span className="btn-label">Cứu hộ - Cứu nạn</span>
            </div>
          </button>
          <button className="dn-emergency-btn police" onClick={() => callNumber("113")}>
            <span className="btn-icon">👮</span>
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

// ─── Tab: Trò chơi 🎮 ─────────────────────────────────
function QuizTab() {
  return (
    <div className="dn-tab-content">
      <QuizGame />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────
const TABS = [
  { id: "child", icon: "👦", label: "Dành cho bé", component: <ChildTab /> },
  { id: "adult", icon: "👨", label: "Người lớn", component: <AdultTab /> },
  { id: "quiz", icon: "🎮", label: "Trò chơi nhận bằng", component: <QuizTab /> },
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

      {/* Hero Header */}
      <div className="dn-hero">
        <span className="dn-hero-icon">🏊‍♂️</span>
        <h1 className="dn-hero-title">CẨM NANG PHÒNG CHỐNG ĐUỐI NƯỚC</h1>
        <p className="dn-hero-sub">Ủy ban nhân dân xã Đăk Pxi • Vì cuộc sống bình yên của bản làng</p>
        
        {/* Sóng nước SVG đẹp mắt */}
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