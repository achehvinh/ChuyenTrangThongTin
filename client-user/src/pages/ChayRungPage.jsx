import { useState } from 'react';
import './ChayRungPage.css';

const DATA = {
  title: 'Phòng chống cháy rừng',
  subtitle: 'UBND xã Đăk Pxi — Cảnh báo mùa khô',
  images: [
    '/huong-dan/chay-rung-1.png',
    '/huong-dan/chay-rung-2.png',
    '/huong-dan/chay-rung-3.png',
  ],
  content:
    'Mùa khô nguy cơ cháy rừng rất cao. Bà con không đốt nương rẫy khi chưa được phép. Một đám lửa nhỏ có thể thiêu rụi hàng chục héc-ta rừng chỉ trong vài giờ, gây thiệt hại lớn về tài sản và môi trường.',
  warning: [
    'Không mang lửa vào rừng.',
    'Không đốt ong trong rừng.',
    'Không đốt thực bì gần khu vực rừng.',
  ],
  steps: [
    { stt: '01', title: 'Xin phép trước khi đốt', desc: 'Liên hệ UBND xã hoặc kiểm lâm để được cấp phép trước khi đốt nương rẫy.' },
    { stt: '02', title: 'Làm đường băng cản lửa', desc: 'Phát dọn thực bì, tạo đường băng xung quanh khu vực đốt trước khi tiến hành.' },
    { stt: '03', title: 'Chuẩn bị dụng cụ chữa cháy', desc: 'Chuẩn bị sẵn xô nước, bình xịt, dao phát để xử lý kịp thời khi lửa lan.' },
    { stt: '04', title: 'Báo ngay khi phát hiện cháy', desc: 'Gọi ngay số khẩn cấp và thông báo cho hàng xóm khi phát hiện đám cháy.' },
  ],
  emergencyPhone: '0339310915',
  videos: [
    {
      type: 'local',
      src: '/video/chay_rung.mp4',
      title: 'Kỹ năng phòng chống cháy rừng',
    },
  ],
};

export default function ChayRungPage() {
  const [activeImg, setActiveImg] = useState(null);

  return (
    <div className="cr-page">

      {/* Banner */}
      <div className="cr-alert-bar">
        🔥 Mùa khô — Nguy cơ cháy rừng cao — Bà con tuyệt đối không đốt lửa trong rừng
      </div>

      <div className="cr-container">

        {/* Tiêu đề */}
        <div className="cr-header">
          <h1 className="cr-title">🔥 {DATA.title}</h1>
          <p className="cr-subtitle">{DATA.subtitle}</p>
        </div>

        <div className="cr-layout">

          {/* CỘT TRÁI */}
          <div className="cr-main">

            <section className="cr-section">
              <p className="cr-content">{DATA.content}</p>
            </section>

            {DATA.images.length > 0 && (
              <section className="cr-section">
                <h2 className="cr-section-title">Hình ảnh thực tế</h2>
                <div className="cr-img-grid">
                  {DATA.images.map((src, i) => (
                    <div key={i} className="cr-img-wrap" onClick={() => setActiveImg(src)}>
                      <img src={src} alt={`Cháy rừng ${i + 1}`} className="cr-img" />
                      <span className="cr-img-zoom">🔍</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="cr-section">
              <h2 className="cr-section-title">Các bước cần thực hiện</h2>
              <div className="cr-steps">
                {DATA.steps.map((s, i) => (
                  <div key={i} className="cr-step">
                    <div className="cr-step-num">{s.stt}</div>
                    <div className="cr-step-body">
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {DATA.videos.length > 0 && (
              <section className="cr-section">
                <h2 className="cr-section-title">Video hướng dẫn</h2>
                {DATA.videos.map((v, i) => (
                  <div key={i} className="cr-video-wrap">
                    <p className="cr-video-title">🎬 {v.title}</p>
                    {v.type === 'youtube' ? (
                      <iframe src={v.src} title={v.title} frameBorder="0" allowFullScreen className="cr-video" />
                    ) : (
                      <video controls className="cr-video">
                        <source src={v.src} type="video/mp4" />
                        Trình duyệt không hỗ trợ video.
                      </video>
                    )}
                  </div>
                ))}
              </section>
            )}

          </div>

          {/* CỘT PHẢI */}
          <aside className="cr-sidebar">

            <div className="cr-box cr-box--danger">
              <div className="cr-box-title">🚒 Số điện thoại khẩn cấp</div>
              <a href={`tel:${DATA.emergencyPhone}`} className="cr-phone">
                {DATA.emergencyPhone}
              </a>
              <p className="cr-phone-note">UBND xã Đăk Pxi — Kiểm lâm địa bàn</p>
            </div>

            <div className="cr-box">
              <div className="cr-box-title">⚠️ Tuyệt đối không được</div>
              <ul className="cr-warning-list">
                {DATA.warning.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            <div className="cr-box">
              <div className="cr-box-title">📋 Quy định cần biết</div>
              <ul className="cr-place-list">
                <li>Đốt nương phải xin phép UBND xã</li>
                <li>Vi phạm có thể bị xử phạt hành chính</li>
                <li>Gây cháy rừng có thể bị truy cứu hình sự</li>
              </ul>
            </div>

          </aside>

        </div>
      </div>

      {/* Lightbox */}
      {activeImg && (
        <div className="cr-lightbox" onClick={() => setActiveImg(null)}>
          <img src={activeImg} alt="Phóng to" />
          <button className="cr-lightbox-close" onClick={() => setActiveImg(null)}>✕</button>
        </div>
      )}

    </div>
  );
}