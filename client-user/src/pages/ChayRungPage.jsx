import { useState } from 'react';
import './ChayRungPage.css';

const DATA = {
  title: 'Phòng chống cháy rừng',
  subtitle: 'Phòng Văn hóa - Xã hội xã Đăk Pxi',
  images: [
    {
      src: '/huong-dan/chay-rung-1.png',
      caption: '1. Cán bộ xã Đăk Pxi cùng Kiểm lâm hướng dẫn bà con dọn thực bì, khoanh vùng phòng chống cháy lan.'
    },
    {
      src: '/huong-dan/chay-rung-2.png',
      caption: '2. Lực lượng kiểm lâm và bà con tích cực tham gia diễn tập khống chế đám cháy rừng giả định.'
    },
    {
      src: '/huong-dan/chay-rung-3.png',
      caption: '3. Phương tiện chuyên dụng cùng bình xịt chữa cháy được chuẩn bị sẵn sàng phản ứng nhanh.'
    }
  ],
  content:
    'Rừng là tài nguyên vô giá, mang lại nguồn nước, bầu không khí trong lành và cuộc sống ấm no cho bà con Đăk Pxi. Hiện nay đang vào cao điểm mùa khô, thời tiết nắng nóng kéo dài, nguy cơ cháy rừng cực kỳ cao. Chỉ cần một đốm lửa nhỏ sơ suất từ tàn thuốc hoặc việc đốt rẫy không kiểm soát có thể gây thảm họa thiêu rụi hàng chục héc-ta rừng lập tức. Vì sự an toàn của gia đình và bản làng, bà con hãy cùng nhau nâng cao cảnh giác, bảo vệ rừng xanh quê hương!',
  warning: [
    'Tuyệt đối KHÔNG mang lửa, chất dễ cháy vào rừng.',
    'Tuyệt đối KHÔNG tự ý đốt ong, đốt tổ côn trùng trong rừng.',
    'Tuyệt đối KHÔNG đốt thực bì, rơm rạ gần bìa rừng vào những ngày nắng nóng hanh khô.',
    'Tuyệt đối KHÔNG vứt tàn thuốc lá bừa bãi khi đi qua khu vực có nhiều cỏ khô.'
  ],
  steps: [
    { stt: '✍️ 01', title: 'Phải xin phép trước khi đốt nương rẫy', desc: 'Bà con phải liên hệ trực tiếp với trưởng thôn, kiểm lâm địa bàn hoặc UBND xã để được hướng dẫn và đăng ký trước khi dọn đốt rẫy.' },
    { stt: '🛤️ 02', title: 'Làm đường băng cản lửa xung quanh', desc: 'Trước khi đốt rẫy, bắt buộc phải dọn sạch cây cỏ xung quanh rẫy tạo thành một đường băng trống rộng từ 3m đến 5m để lửa không thể cháy lan vào rừng.' },
    { stt: '🧯 03', title: 'Chuẩn bị đầy đủ dụng cụ dập lửa', desc: 'Chuẩn bị sẵn xô nước, bình xịt nước cầm tay, dao phát và huy động từ 2 đến 3 người cùng hỗ trợ trông coi đám đốt rẫy.' },
    { stt: '📞 04', title: 'Chữa cháy khẩn cấp & Báo ngay lập tức', desc: 'Nếu lửa vượt tầm kiểm soát, hãy hô hoán bà con xung quanh dập lửa và gọi ngay số khẩn cấp của kiểm lâm hoặc chính quyền để được trợ giúp.' }
  ],
  emergencyPhone: '0339310915',
  videos: [
    {
      type: 'local',
      src: '/video/chay_rung.mp4',
      title: 'Xem video hướng dẫn: Kỹ năng phòng chống cháy rừng bà con cần biết',
    }
  ]
};

export default function ChayRungPage() {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  return (
    <div className="cr-page">
      {/* Thanh cảnh báo khẩn cấp đầu trang */}
      <div className="cr-alert-bar">
        <span className="cr-alert-pulse">🔴</span> BÁO ĐỘNG ĐỎ: CẢNH BÁO CHÁY RỪNG CẤP V (CẤP CỰC KỲ NGUY HIỂM) TRÊN ĐỊA BÀN XÃ ĐĂK PXI
      </div>

      <div className="cr-container">
        {/* Tiêu đề trang */}
        <header className="cr-header">
          <span className="cr-header-badge">🔥 TẬP TRUNG PHÒNG CHỐNG THIÊN TAI</span>
          <h1 className="cr-title">{DATA.title.toUpperCase()}</h1>
          <p className="cr-subtitle">{DATA.subtitle}</p>
        </header>

        <div className="cr-layout">
          {/* CỘT TRÁI - NỘI DUNG CHÍNH */}
          <main className="cr-main">
            {/* Lời kêu gọi gửi bà con */}
            <section className="cr-section intro-card">
              <h2 className="cr-section-title green">🌿 Thư gửi bà con về bảo vệ rừng</h2>
              <p className="cr-content">{DATA.content}</p>
            </section>

            {/* Mục ảnh thực tế phóng to */}
            <section className="cr-section gallery-card">
              <h2 className="cr-section-title orange">📸 Hình ảnh thực tế phòng chống cháy rừng</h2>
              <p className="cr-section-desc">Bấm vào các ảnh nhỏ bên dưới để xem hình to rõ nét hơn:</p>

              <div className="cr-gallery-wrapper">
                {/* Ảnh to chính */}
                <div className="cr-featured-image-box">
                  <img
                    src={DATA.images[activeImgIndex].src}
                    alt="Phóng to thực tế"
                    className="cr-featured-img"
                  />
                  <div className="cr-featured-caption">
                    {DATA.images[activeImgIndex].caption}
                  </div>
                </div>

                {/* Các ảnh nhỏ chọn lựa */}
                <div className="cr-thumbnails-grid">
                  {DATA.images.map((img, i) => (
                    <div
                      key={i}
                      className={`cr-thumbnail-wrap ${activeImgIndex === i ? 'active' : ''}`}
                      onClick={() => setActiveImgIndex(i)}
                    >
                      <img src={img.src} alt={`Ảnh nhỏ ${i + 1}`} className="cr-thumbnail-img" />
                      <span className="thumbnail-num">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Các bước cần thực hiện */}
            <section className="cr-section steps-card">
              <h2 className="cr-section-title blue">📋 4 Bước bắt buộc khi bà con đốt nương rẫy</h2>
              <div className="cr-steps-grid">
                {DATA.steps.map((s, i) => (
                  <div key={i} className="cr-step-card">
                    <div className="cr-step-badge">{s.stt}</div>
                    <div className="cr-step-body">
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Video tuyên truyền */}
            {DATA.videos.length > 0 && (
              <section className="cr-section video-card">
                <h2 className="cr-section-title red">🎬 Video hướng dẫn trực quan</h2>
                {DATA.videos.map((v, i) => (
                  <div key={i} className="cr-video-container">
                    <p className="cr-video-label">{v.title}</p>
                    <div className="cr-video-wrapper">
                      <video controls className="cr-video-player" poster="/huong-dan/chay-rung-1.png">
                        <source src={v.src} type="video/mp4" />
                        Trình duyệt của bà con không hỗ trợ xem video trực tiếp.
                      </video>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </main>

          {/* CỘT PHẢI - SIDEBAR CẢNH BÁO */}
          <aside className="cr-sidebar">
            {/* Nút điện thoại khẩn cấp */}
            <div className="cr-box phone-box">
              <div className="cr-box-header">🚨 BÁO CHÁY KHẨN CẤP</div>
              <div className="phone-box-body">
                <p>Phát hiện khói hoặc lửa cháy rừng, bà con hãy gọi ngay số điện thoại:</p>
                <a href={`tel:${DATA.emergencyPhone}`} className="cr-big-phone">
                  📞 {DATA.emergencyPhone}
                </a>
                <span className="phone-subtext">Đường dây nóng UBND xã &amp; Kiểm lâm địa bàn</span>
              </div>
            </div>

            {/* Cấm kỵ */}
            <div className="cr-box danger-box">
              <div className="cr-box-header warning">⚠️ TUYỆT ĐỐI KHÔNG ĐƯỢC</div>
              <div className="cr-box-body">
                <ul className="cr-sidebar-list danger">
                  {DATA.warning.map((w, i) => (
                    <li key={i}>
                      <span className="list-icon">❌</span>
                      <span className="list-text">{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Luật pháp cần nhớ */}
            <div className="cr-box info-box">
              <div className="cr-box-header info">⚖️ QUY ĐỊNH PHÁP LUẬT CẦN BIẾT</div>
              <div className="cr-box-body">
                <ul className="cr-sidebar-list info">
                  <li>
                    <span className="list-icon">📝</span>
                    <span className="list-text">Tự ý đốt rừng làm nương rẫy mà chưa được phép sẽ bị xử phạt nghiêm khắc.</span>
                  </li>
                  <li>
                    <span className="list-icon">💸</span>
                    <span className="list-text">Mọi hành vi gây cháy rừng dù vô ý hay cố ý đều phải bồi thường thiệt hại cây rừng.</span>
                  </li>
                  <li>
                    <span className="list-icon">⛓️</span>
                    <span className="list-text">Hành vi gây cháy rừng diện tích lớn có thể bị khởi tố hình sự và ngồi tù.</span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}