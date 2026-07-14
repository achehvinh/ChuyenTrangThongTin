import { useState, useRef, useEffect } from 'react';
import './TraCuuPage.css';
import FAQChatBot from "../components/Faqchatbot";

const HUONG_DAN_APP = [
  {
    id: 1,
    title: 'App VssID',
    subtitle: 'Bảo hiểm Xã hội Việt Nam',
    color: '#005bac',
    icon: '🔵',
    hinh: '/huong-dan/tracuuappbhyt.jpg',
    steps: [
      { title: 'Tải và cài đặt ứng dụng', desc: 'Tìm và tải ứng dụng VssID từ cửa hàng App Store hoặc Google Play (hoặc quét mã QR ở dưới).' },
      { title: 'Đăng nhập tài khoản', desc: 'Nhập Mã số BHXH (hoặc số định danh cá nhân) cùng mật khẩu cá nhân để đăng nhập vào ứng dụng.' },
      { title: 'Hiển thị thẻ BHYT', desc: 'Chọn mục "Thẻ BHYT" tại màn hình chính để hiển thị hình ảnh thẻ và mã QR đi khám chữa bệnh.' }
    ],
    btn: { label: '📲 Tải VssID ngay', url: 'https://play.google.com/store/apps/details?id=com.vssid' },
    qr: 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://play.google.com/store/apps/details?id=com.vssid',
  },
  {
    id: 2,
    title: 'App Sức khỏe điện tử',
    subtitle: 'Bộ Y tế',
    color: '#0891b2',
    icon: '🩺',
    hinh: '/huong-dan/suckhoe.jpg',
    steps: [
      { title: 'Tải ứng dụng về máy', desc: 'Tải ứng dụng "Sức khỏe điện tử" trên điện thoại của bạn từ cửa hàng ứng dụng CH Play hoặc App Store.' },
      { title: 'Đăng ký & Đăng nhập', desc: 'Nhập số điện thoại đăng ký và cập nhật mã định danh cá nhân (CCCD) để đồng bộ dữ liệu y tế.' },
      { title: 'Tra cứu thông tin BHYT', desc: 'Vào phần "Hồ sơ sức khỏe" hoặc mục "Thẻ BHYT" để tra cứu chi tiết giá trị sử dụng thẻ.' }
    ],
    btn: { label: '📲 Tải Sức khỏe điện tử', url: 'https://play.google.com/store/apps/details?id=vn.gov.moh.sk' },
    qr: 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://play.google.com/store/apps/details?id=vn.gov.moh.sk',
  },
  {
    id: 3,
    title: 'App VNeID',
    subtitle: 'Định danh điện tử quốc gia',
    color: '#7c3aed',
    icon: '🪪',
    hinh: '/huong-dan/tracuuvneid.jpg',
    steps: [
      { title: 'Kích hoạt tài khoản', desc: 'Đảm bảo bạn đã cài đặt ứng dụng VNeID và kích hoạt tài khoản định danh điện tử Mức độ 2 thành công.' },
      { title: 'Xác thực thông tin ví', desc: 'Đăng nhập vào VNeID, vào phần "Ví giấy tờ", nhập mật mã bảo mật (Passcode) và thực hiện xác thực.' },
      { title: 'Hiển thị thẻ BHYT', desc: 'Chọn thẻ "Bảo hiểm y tế" để hiển thị chi tiết hạn dùng và mã QR để sử dụng khi đi khám bệnh.' }
    ],
    btn: { label: '📲 Tải VNeID', url: 'https://play.google.com/store/apps/details?id=com.vnpt.vneid' },
    qr: 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://play.google.com/store/apps/details?id=com.vnpt.vneid',
  },
];

const HUONG_DAN_WEB = [
  {
    id: 2,
    title: 'dichvucong.gov.vn',
    subtitle: 'Cổng dịch vụ công quốc gia',
    color: '#dc2626',
    icon: '🖥️',
    hinh: '/huong-dan/tracuwdichvucong.jpg',
    steps: [
      { title: 'Truy cập cổng dịch vụ công', desc: 'Sử dụng trình duyệt trên điện thoại hoặc máy tính truy cập trang dichvucong.gov.vn.' },
      { title: 'Đăng nhập bằng tài khoản VNeID', desc: 'Nhấn Đăng nhập và chọn hình thức đăng nhập bằng Tài khoản định danh điện tử VNeID.' },
      { title: 'Tra cứu thẻ BHYT', desc: 'Tìm kiếm tiện ích "Tra cứu thông tin thẻ BHYT" để kiểm tra hạn sử dụng và quyền lợi của bạn.' }
    ],
    btn: { label: '🌐 Vào Cổng dịch vụ công', url: 'https://dichvucong.gov.vn' },
    qr: 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://dichvucong.gov.vn',
  },
  {
    id: 3,
    title: 'baohiemyte.vn',
    subtitle: 'Cổng Bảo hiểm Y tế',
    color: '#0369a1',
    icon: '💻',
    hinh: '/huong-dan/tracuubhyt.jpg',
    steps: [
      { title: 'Truy cập trang web', desc: 'Vào địa chỉ website baohiemyte.vn (hoặc trang tra cứu chính thức của Bảo hiểm xã hội Việt Nam).' },
      { title: 'Nhập thông tin cá nhân', desc: 'Điền đầy đủ Mã thẻ BHYT (hoặc số CCCD), họ tên, ngày tháng năm sinh vào biểu mẫu tra cứu.' },
      { title: 'Xác thực & Xem kết quả', desc: 'Tích chọn mã bảo mật captcha "Tôi không phải là người máy" và bấm "Tra cứu" để kiểm tra.' }
    ],
    btn: { label: '🌐 Vào baohiemyte.vn', url: 'https://baohiemyte.vn' },
    qr: 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://baohiemyte.vn',
  },
];

export default function TraCuuPage() {
  const [speaking, setSpeaking] = useState(false);
  const [tab, setTab] = useState('app');
  const [anhPhongTo, setAnhPhongTo] = useState(null);
  const audioRef = useRef(null);

  const readText = `
    Hướng dẫn tra cứu thẻ Bảo hiểm Y tế tại nhà, không cần lên UBND xã.
    Có hai cách tra cứu chính.
    Cách thứ nhất: Dùng điện thoại qua các ứng dụng VssID, Sức khỏe điện tử, hoặc VNeID.
    Cách thứ hai: Dùng máy tính hoặc điện thoại vào các trang web baohiemxahoi.gov.vn, dichvucong.gov.vn, hoặc baohiemyte.vn.
    Bà con chỉ cần có số căn cước công dân là tra cứu được ngay tại nhà.
  `;

  useEffect(() => {
    const timer = setTimeout(async () => {
      setSpeaking(true);
      try {
        const response = await fetch('https://api.fpt.ai/hmi/tts/v5', {
          method: 'POST',
          headers: {
            'api-key': 't0GDbvE0lBxIjW3SKxcGeoaKMxrACwOH',
            'speed': '',
            'voice': 'linhsan',
          },
          body: readText,
        });
        const result = await response.json();
        if (result.async) {
          const audio = new Audio(result.async);
          audioRef.current = audio;
          audio.play();
          audio.onended = () => setSpeaking(false);
        } else {
          setSpeaking(false);
        }
      } catch {
        setSpeaking(false);
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      setSpeaking(false);
    };
  }, []);

  const danhSach = tab === 'app' ? HUONG_DAN_APP : HUONG_DAN_WEB;

  return (
    <div className="tracuu-page">
      <div className="tracuu-inner">

        {/* Header */}
        <header className="tracuu-header">
          <div className="tracuu-header-icon">🏥</div>
          <h1>Tra cứu thẻ BHYT tại nhà<br /><span>không cần lên xã!</span></h1>
          <p>Chỉ cần điện thoại hoặc máy tính là xong</p>
          {speaking && <div className="tts-indicator">🔊 Đang đọc hướng dẫn...</div>}
        </header>

        {/* Chuẩn bị */}
        <div className="tracuu-chuan-bi">
          <div className="chuan-bi-title">📋 Bà con cần chuẩn bị:</div>
          <div className="chuan-bi-list">
            <div className="chuan-bi-item">
              <div className="chuan-bi-icon">🪪</div>
              <div className="chuan-bi-text">Thẻ CCCD<br /><span>12 chữ số</span></div>
            </div>
            <div className="chuan-bi-arrow">→</div>
            <div className="chuan-bi-item">
              <div className="chuan-bi-icon">📱</div>
              <div className="chuan-bi-text">Điện thoại<br /><span>hoặc máy tính</span></div>
            </div>
            <div className="chuan-bi-arrow">→</div>
            <div className="chuan-bi-item">
              <div className="chuan-bi-icon">📶</div>
              <div className="chuan-bi-text">Internet<br /><span>wifi hoặc 4G</span></div>
            </div>
            <div className="chuan-bi-arrow">→</div>
            <div className="chuan-bi-item chuan-bi-item--result">
              <div className="chuan-bi-icon">✅</div>
              <div className="chuan-bi-text">Tra cứu<br /><span>được ngay!</span></div>
            </div>
          </div>
        </div>

        {/* Emergency */}
        <div className="tracuu-emergency">
          <span>🚨</span>
          <div>
            <strong>Cần hỗ trợ ngay?</strong>
            <p>Gọi tổng đài BHXH miễn phí: <a href="tel:1900936936">1900 936 936</a> (24/7)</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-wrapper">
          <button className={'tab-btn' + (tab === 'app' ? ' tab-active' : '')} onClick={() => setTab('app')}>
            <span className="tab-icon">📱</span>
            <span>Dùng điện thoại</span>
            <span className="tab-sub">Tải app về máy</span>
          </button>
          <button className={'tab-btn' + (tab === 'web' ? ' tab-active' : '')} onClick={() => setTab('web')}>
            <span className="tab-icon">🌐</span>
            <span>Dùng trình duyệt</span>
            <span className="tab-sub">Không cần cài app</span>
          </button>
        </div>

        {/* Cards */}
        <div className="huong-dan-list">
          {danhSach.map((hd) => (
            <div className="huong-dan-card" key={hd.id}>

              {/* Header */}
              <div className="huong-dan-card-header" style={{ background: hd.color }}>
                <span className="hd-header-icon">{hd.icon}</span>
                <div>
                  <div className="hd-header-title">{hd.title}</div>
                  <div className="hd-header-sub">{hd.subtitle}</div>
                </div>
              </div>

              {/* Card Body: 2 Columns on Desktop */}
              <div className="hd-card-body">
                {/* Left Column: Steps */}
                <div className="hd-steps-section">
                  <h3 className="hd-section-title" style={{ color: hd.color }}>Các bước thực hiện</h3>
                  <div className="hd-steps-list">
                    {hd.steps.map((step, i) => (
                      <div className="hd-step-item" key={i}>
                        <div className="hd-step-num" style={{ background: hd.color }}>{i + 1}</div>
                        <div className="hd-step-content">
                          <h4>{step.title}</h4>
                          <p>{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Image */}
                <div className="hd-image-section">
                  <h3 className="hd-section-title" style={{ color: hd.color }}>Ảnh minh họa giao diện</h3>
                  <div className="hd-img-container">
                    <img
                      src={hd.hinh}
                      alt={hd.title}
                      className="hd-img-thumb"
                      onClick={() => setAnhPhongTo(hd.hinh)}
                      onError={e => { e.target.parentNode.style.display = 'none'; }}
                    />
                    <div className="hd-img-overlay">🔍 Nhấn để phóng to ảnh</div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="hd-card-footer">
                <div className="hd-qr-box">
                  <img src={hd.qr} alt="QR" className="hd-qr-img"
                    onError={e => { e.target.style.display = 'none'; }} />
                  <div className="hd-qr-label">Quét QR để mở</div>
                </div>
                <a href={hd.btn.url} target="_blank" rel="noreferrer"
                  className="hd-main-btn" style={{ background: hd.color }}>
                  {hd.btn.label}
                </a>
              </div>

            </div>
          ))}
        </div>

        {/* Video */}
        <div className="video-section">
          <div className="video-header">
            {tab === 'app' ? '🎬 Video hướng dẫn tra cứu qua App' : '🎬 Video hướng dẫn tra cứu qua Website'}
          </div>
          <video key={tab} className="video-main" controls playsInline preload="metadata">
            <source src={tab === 'app' ? '/video/huongdan-bhyt.mp4' : '/video/huongdan-bhytweb.mp4'} type="video/mp4" />
          </video>
        </div>
        <FAQChatBot type="bhyt" />
        
        {/* Footer */}
        <div className="tracuu-footer-tip">
          <span>🏛️</span>
          <div>
            <strong>Vẫn chưa tra cứu được?</strong>
            <p>Bà con đến trực tiếp <strong>UBND xã Đăk Pxi</strong> — cán bộ hỗ trợ miễn phí!</p>
          </div>
          
        </div>
      
      </div>
     {anhPhongTo && (
  <div
    onClick={() => setAnhPhongTo(null)}
    style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      cursor: 'zoom-out',
    }}
  >
    <img
      src={anhPhongTo}
      alt="Phóng to"
      style={{
        maxWidth: '95vw', maxHeight: '85vh',
        borderRadius: '12px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        objectFit: 'contain',
      }}
      onClick={e => e.stopPropagation()}
    />
    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
      <a
        href={anhPhongTo}
        download
        onClick={e => e.stopPropagation()}
        style={{
          padding: '10px 24px', background: '#005bac', color: 'white',
          borderRadius: '10px', fontWeight: '700', fontSize: '15px',
          textDecoration: 'none',
        }}
      >
        💾 Lưu ảnh
      </a>
      <button
        onClick={() => setAnhPhongTo(null)}
        style={{
          padding: '10px 24px', background: '#dc2626', color: 'white',
          border: 'none', borderRadius: '10px', fontWeight: '700',
          fontSize: '15px', cursor: 'pointer',
        }}
      >
        ✕ Đóng
      </button>
    </div>
    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '10px' }}>
      Nhấn ra ngoài ảnh để đóng
    </p>
  </div>
)}
    </div>
    
  );
}