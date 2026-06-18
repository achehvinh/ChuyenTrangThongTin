import { useState } from "react";
import TTSButton from "../components/TTSButton";
import QuizGame from "./QuizGame";
import DragDrop from "../components/DragDrop";
import "./DuoiNuocPage.css";

// ─── Tab: Dành cho bé ────────────────────────────────
function ChildTab() {
  return (
    <div className="tab-section">
      <TTSButton
        type="child"
        label="Nhấn để nghe"
        title="Cô giáo đọc bài cho bé"
      />
      <div className="badge-card">

  <div className="badge-icon">
    🏅
  </div>

  <div className="badge-title">
    Hoàn thành bài học
  </div>

  <div className="badge-desc">
    Chơi trò chơi để nhận huy hiệu
  </div>

</div>

<div className="card">

  <div className="card-title">
    🌟 NHÌN HÌNH ĐỂ NHỚ
  </div>

  <div className="visual-grid">

    <div className="visual-card">
      <img
        src="/images/no-alone-swim.jpg"
        alt=""
        className="visual-img"
      />
      <div className="visual-text">
        🚫 Không tắm một mình
      </div>
    </div>

    <div className="visual-card">
      <img
        src="/images/adult.jpg"
        alt=""
        className="visual-img"
      />
      <div className="visual-text">
        👨‍👩‍👧 Có người lớn đi cùng
      </div>
    </div>

    <div className="visual-card">
      <img
        src="/images/life-jacket.jpg"
        alt=""
        className="visual-img"
      />
      <div className="visual-text">
        🦺 Luôn mặc áo phao
      </div>
    </div>

    <div className="visual-card">
      <img
        src="/images/help.jpg"
        alt=""
        className="visual-img"
      />
      <div className="visual-text">
        📢 Hét to gọi người lớn
      </div>
    </div>

  </div>

</div>

      <div className="card">
        <div className="card-title">🎬 Video hướng dẫn</div>
        <video controls className="video-frame">
          <source src="/video/duoi_nuoc1.mp4" type="video/mp4" />
          Trình duyệt không hỗ trợ video.
        </video>
        <div className="danger-banner">

  <img
    src="/images/danger-water.jpg"
    alt=""
    className="danger-image"
  />

  <div className="danger-banner-text">
    ⚠️ AO HỒ - SÔNG SUỐI CÓ THỂ GÂY NGUY HIỂM
  </div>
    <div className="card">

  <div className="card-title">
    📍 Khu vực nguy hiểm
  </div>

  <img
    src="/images/map-danger.jpg"
    className="map-image"
    alt=""
  />

</div>
</div>
      </div>
    </div>
  );
}

// ─── Tab: Người lớn ──────────────────────────────────
function AdultTab() {
  const callNumber = (num) => {
    window.location.href = `tel:${num}`;
  };

  return (
    <div className="tab-section">
      <TTSButton
        type="adult"
        label="Nhấn để nghe"
        title="Hướng dẫn sơ cứu đuối nước"
      />

      <div className="danger-card">
        <div className="danger-title"><div className="sign-grid">

  <div className="sign-item">
    <img src="/images/drowning1.jpg" />
    <div className="sign-text">
      😶 Không kêu được
    </div>
  </div>

  <div className="sign-item">
    <img src="/images/drowning2.jpg" />
    <div className="sign-text">
      🌊 Đầu chìm dần
    </div>
  </div>

  <div className="sign-item">
    <img src="/images/drowning3.jpg" />
    <div className="sign-text">
      👁️ Mắt lờ đờ
    </div>
  </div>

  <div className="sign-item">
    <img src="/images/drowning4.jpg" />
    <div className="sign-text">
      💪 Vùng vẫy yếu
    </div>
  </div>

</div></div>
        <div className="sign-grid">
          {[
            { e: "😶", t: "Không kêu cứu được" },
            { e: "💪", t: "Vùng vẫy rất yếu" },
            { e: "🌊", t: "Đầu chìm dần xuống" },
            { e: "👁️", t: "Mắt lờ đờ, trống rỗng" },
          ].map((s, i) => (
            <div key={i} className="sign-item">
              <span className="sign-emoji">{s.e}</span>
              <div className="sign-text">{s.t}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">🫁 Các bước sơ cứu</div>
        {[
          "Gọi to nhờ người giúp, KHÔNG nhảy xuống nước một mình nếu không biết bơi",
          "Ném phao, dây thừng, sào tre hoặc bất cứ thứ gì để nạn nhân bám vào",
          "Đưa nạn nhân lên bờ, đặt nằm ngửa trên mặt phẳng cứng",
          "Kiểm tra nhịp thở — nếu không thở, tiến hành hô hấp nhân tạo",
          "Gọi 115 ngay lập tức và giữ ấm cho nạn nhân",
        ].map((step, i) => (
          <div key={i} className="rescue-step">
            <div className="step-num">{i + 1}</div>
            <div className="step-text">{step}</div>
          </div>
        ))}
      </div>

      <div className="emergency-card">
        <div className="emergency-title">📞 Số khẩn cấp</div>
        {[
          { num: "115", icon: "🚑", label: "Cấp cứu y tế" },
          { num: "113", icon: "👮", label: "Công an" },
          { num: "114", icon: "🚒", label: "Cứu hỏa — cứu nạn" },
        ].map((e) => (
          <button key={e.num} className="emergency-btn" onClick={() => callNumber(e.num)}>
            <span className="emergency-icon">{e.icon}</span>
            <div>
              <div className="emergency-num">{e.num}</div>
              <div className="emergency-label">{e.label}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Trò chơi ───────────────────────────────────
function QuizTab() {
  return (
    <div className="tab-section">
      <QuizGame />
      <DragDrop />
    </div>
  );
}

// ─── Main page ───────────────────────────────────────
const TABS = [
  { id: "child", icon: "👦", label: "Dành cho bé", component: <ChildTab /> },
  { id: "adult", icon: "👨", label: "Người lớn", component: <AdultTab /> },
  { id: "quiz", icon: "🎮", label: "Trò chơi", component: <QuizTab /> },
];

export default function DuoiNuocPage() {
  const [activeTab, setActiveTab] = useState("child");
  const current = TABS.find((t) => t.id === activeTab);

  return (
    <div className="duoinuoc-page">

  <div className="snow-container">
    {[...Array(25)].map((_, i) => (
      <span
        key={i}
        className="snowflake"
        style={{
          left: `${Math.random() * 100}%`,
          animationDuration: `${5 + Math.random() * 5}s`,
          fontSize: `${10 + Math.random() * 15}px`
        }}
      >
        💧
      </span>
    ))}
  </div>
      {/* Hero */}
      <div className="hero">
        <span className="hero-icon">🏊</span>
        <h1 className="hero-title">PHÒNG CHỐNG ĐUỐI NƯỚC</h1>
        <p className="hero-sub">Xã Đăk Pxi • An toàn cho cả gia đình</p>
        <svg className="hero-wave" viewBox="0 0 400 40" preserveAspectRatio="none">
          <path d="M0,20 Q100,5 200,20 Q300,35 400,20 L400,40 L0,40 Z" fill="#e1f5ee" />
        </svg>
      </div>
      <div className="hero-gallery">

  <img src="/images/duoinuoc1.jpg" />
  <img src="/images/duoinuoc2.jpg" />
  <img src="/images/duoinuoc3.jpg" />

</div>
      {/* Tabs */}
      <div className="tabs-row">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="page-body">{current.component}</div>
    </div>
  );
}