import { useState } from 'react';
import './ThienTaiPage.css';

const DATA = {
  title: 'Phòng chống Thiên tai',
  subtitle: 'UBND xã Đăk Pxi — Thông tin khẩn cấp mùa mưa bão',
  images: [
    '/huong-dan/thien-tai-1.png',
    '/huong-dan/thien-tai-2.png',
    '/huong-dan/thien-tai-3.png',
  ],
  content:
    'Mùa mưa bão thường xuất hiện lũ quét, sạt lở đất và giông lốc. Bà con cần theo dõi thông báo của chính quyền địa phương và chuẩn bị sẵn sàng di tản khi có lệnh.',
  warning: [
    'Không đi qua suối khi nước dâng cao.',
    'Không ngủ tại khu vực có nguy cơ sạt lở.',
    'Di chuyển người già và trẻ em đến nơi an toàn.',
  ],
  steps: [
    { stt: '01', title: 'Theo dõi thông báo', desc: 'Nghe đài, loa phát thanh xã và thông báo từ trưởng thôn.' },
    { stt: '02', title: 'Chuẩn bị đồ dùng', desc: 'Giấy tờ quan trọng, thuốc men, lương thực đủ dùng 3 ngày.' },
    { stt: '03', title: 'Di tản kịp thời', desc: 'Khi có lệnh, di chuyển ngay đến điểm tập kết an toàn của thôn.' },
    { stt: '04', title: 'Liên hệ chính quyền', desc: 'Gọi ngay số khẩn cấp nếu có người bị kẹt hoặc cần hỗ trợ.' },
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

  return (
    <div className="tt-page">

      {/* ── Banner cảnh báo ── */}
      <div className="tt-alert-bar">
        ⚠️ Mùa mưa bão — Bà con hãy đề cao cảnh giác, theo dõi thông báo từ UBND xã
      </div>

      <div className="tt-container">

        {/* ── Tiêu đề ── */}
        <div className="tt-header">
          <h1 className="tt-title">🌪️ {DATA.title}</h1>
          <p className="tt-subtitle">{DATA.subtitle}</p>
        </div>

        <div className="tt-layout">

          {/* ── CỘT TRÁI ── */}
          <div className="tt-main">

            {/* Mô tả */}
            <section className="tt-section">
              <p className="tt-content">{DATA.content}</p>
            </section>

            {/* Ảnh */}
            {DATA.images.length > 0 && (
              <section className="tt-section">
                <h2 className="tt-section-title">Hình ảnh thực tế</h2>
                <div className="tt-img-grid">
                  {DATA.images.map((src, i) => (
                    <div key={i} className="tt-img-wrap" onClick={() => setActiveImg(src)}>
                      <img src={src} alt={`Thiên tai ${i + 1}`} className="tt-img" />
                      <span className="tt-img-zoom">🔍</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Các bước cần làm */}
            <section className="tt-section">
              <h2 className="tt-section-title">Các bước cần thực hiện</h2>
              <div className="tt-steps">
                {DATA.steps.map((s, i) => (
                  <div key={i} className="tt-step">
                    <div className="tt-step-num">{s.stt}</div>
                    <div className="tt-step-body">
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Video */}
            {DATA.videos.length > 0 && (
              <section className="tt-section">
                <h2 className="tt-section-title">Video hướng dẫn</h2>
                {DATA.videos.map((v, i) => (
                  <div key={i} className="tt-video-wrap">
                    <p className="tt-video-title">🎬 {v.title}</p>
                    {v.type === 'youtube' ? (
                      <iframe
                        src={v.src}
                        title={v.title}
                        frameBorder="0"
                        allowFullScreen
                        className="tt-video"
                      />
                    ) : (
                      <video controls className="tt-video">
                        <source src={v.src} type="video/mp4" />
                        Trình duyệt không hỗ trợ video.
                      </video>
                    )}
                  </div>
                ))}
              </section>
            )}

          </div>

          {/* ── CỘT PHẢI — Sidebar ── */}
          <aside className="tt-sidebar">

            {/* Số khẩn cấp */}
            <div className="tt-box tt-box--danger">
              <div className="tt-box-title">🚨 Số điện thoại khẩn cấp</div>
              <a href={`tel:${DATA.emergencyPhone}`} className="tt-phone">
                {DATA.emergencyPhone}
              </a>
              <p className="tt-phone-note">UBND xã Đăk Pxi — Trực 24/7 mùa mưa bão</p>
            </div>

            {/* Cảnh báo */}
            <div className="tt-box">
              <div className="tt-box-title">⚠️ Lưu ý quan trọng</div>
              <ul className="tt-warning-list">
                {DATA.warning.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            {/* Điểm sơ tán */}
            <div className="tt-box">
              <div className="tt-box-title">📍 Điểm sơ tán an toàn</div>
              <ul className="tt-place-list">
                <li>Trường tiểu học xã Đăk Pxi</li>
                <li>Nhà văn hóa thôn Pa Cheng</li>
                <li>Trụ sở UBND xã Đăk Pxi</li>
              </ul>
            </div>

          </aside>

        </div>
      </div>

      {/* ── Lightbox ── */}
      {activeImg && (
        <div className="tt-lightbox" onClick={() => setActiveImg(null)}>
          <img src={activeImg} alt="Phóng to" />
          <button className="tt-lightbox-close" onClick={() => setActiveImg(null)}>✕</button>
        </div>
      )}

    </div>
  );
}