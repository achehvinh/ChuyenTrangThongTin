import { useState } from 'react';
import './ThienTaiPage.css';

const DATA = {
  title: 'Phòng chống Thiên tai & Bão lũ',
  subtitle: 'Ban Chỉ huy PCTT & TKCN xã Đăk Pxi — Cẩm nang chủ động phòng chống mùa mưa bão',
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
    { title: '📦 Túi khẩn cấp', desc: 'Đèn pin, còi cứu hộ, pin dự phòng, áo mưa, giấy tờ bọc chống nước.' },
    { title: '💊 Y tế thiết yếu', desc: 'Thuốc hạ sốt, thuốc tiêu hóa, dầu gió, cồn sát trùng, băng gạc.' },
    { title: '🥫 Thực phẩm khô', desc: 'Mì tôm, nước đóng chai, lương khô, sữa hộp cho trẻ em.' },
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

            {/* Túi nhu yếu phẩm chuẩn bị khẩn cấp */}
            {DATA.preparednessItems && (
              <section className="tt-section tt-preparedness-section">
                <h2 className="tt-section-title">Nhu yếu phẩm khẩn cấp cần chuẩn bị sẵn</h2>
                <div className="tt-prep-grid">
                  {DATA.preparednessItems.map((item, i) => (
                    <div key={i} className="tt-prep-card">
                      <div className="tt-prep-icon">🎒</div>
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