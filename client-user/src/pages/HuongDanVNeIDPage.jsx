import { useState, useRef, useEffect } from 'react';
import './HuongDanVNeIDPage.css';
import FAQChatBot from '../components/Faqchatbot';

const TINH_NANG = [
  { icon: '🪪', label: 'CCCD điện tử', desc: 'Thay thế CCCD vật lý trong nhiều thủ tục' },
  { icon: '🏥', label: 'Thẻ BHYT', desc: 'Xem và dùng thẻ BHYT điện tử' },
  { icon: '🚗', label: 'Giấy phép lái xe', desc: 'Xuất trình GPLX khi cần' },
  { icon: '📋', label: 'Dịch vụ công', desc: 'Nộp hồ sơ trực tuyến tại nhà' },
  { icon: '💰', label: 'Trợ cấp xã hội', desc: 'Nhận thông báo và theo dõi trợ cấp' },
  { icon: '🔐', label: 'Ký số điện tử', desc: 'Ký văn bản, hợp đồng điện tử' },
];

const BUOC_DANG_KY = [
  {
    id: 1,
    icon: '📲',
    title: 'Tải app VNeID',
    desc: 'Tải app VNeID trên CH Play (Android) hoặc App Store (iPhone)',
    color: '#1d4ed8',
  },
  {
    id: 2,
    icon: '📝',
    title: 'Đăng ký tài khoản',
    desc: 'Nhập số CCCD 12 chữ số, số điện thoại và tạo mật khẩu',
    color: '#0891b2',
  },
  {
    id: 3,
    icon: '📸',
    title: 'Chụp ảnh CCCD',
    desc: 'Chụp mặt trước và mặt sau CCCD gắn chip rõ nét, đủ ánh sáng',
    color: '#16a34a',
  },
  {
    id: 4,
    icon: '🤳',
    title: 'Xác thực khuôn mặt',
    desc: 'Quay video khuôn mặt theo hướng dẫn trên màn hình',
    color: '#d97706',
  },
  {
    id: 5,
    icon: '✅',
    title: 'Hoàn tất đăng ký',
    desc: 'Chờ xác nhận từ hệ thống (thường trong vòng 24 giờ)',
    color: '#16a34a',
  },
];

const KICH_HOAT_MUC2 = [
  {
    id: 1,
    title: 'Cách 1: Đến UBND xã hoặc CA xã',
    steps: [
      'Mang CCCD gắn chip đến UBND xã Đăk Pxi hoặc Công an xã',
      'Cán bộ sẽ đọc chip CCCD bằng thiết bị chuyên dụng',
      'Xác thực sinh trắc học trực tiếp tại chỗ',
      'Nhận thông báo kích hoạt mức độ 2 thành công',
    ],
    color: '#1d4ed8',
    icon: '🏛️',
    tag: 'Nhanh nhất',
  },
  {
    id: 2,
    title: 'Cách 2: Tự kích hoạt qua app',
    steps: [
      'Mở app VNeID, vào mục "Kích hoạt tài khoản mức độ 2"',
      'Đặt CCCD gắn chip lên mặt sau điện thoại (cần NFC)',
      'Chờ app đọc chip CCCD tự động',
      'Xác thực khuôn mặt lần cuối để hoàn tất',
    ],
    color: '#7c3aed',
    icon: '📱',
    tag: 'Tại nhà',
  },
];

export default function HuongDanVNeIDPage() {
  const [tab, setTab] = useState('dang-ky');
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);

  const readText = `
    Hướng dẫn đăng ký và sử dụng tài khoản VNeID.
    VNeID là ứng dụng định danh điện tử quốc gia, giúp bà con làm thủ tục hành chính ngay tại nhà mà không cần mang giấy tờ.
    Để đăng ký, bà con tải app VNeID, nhập số căn cước công dân, chụp ảnh thẻ và xác thực khuôn mặt.
    Để kích hoạt mức độ hai, bà con có thể đến UBND xã Đăk Pxi hoặc tự kích hoạt qua app nếu điện thoại có NFC.
    Sau khi kích hoạt, bà con có thể dùng VNeID thay thế căn cước công dân, xem thẻ bảo hiểm y tế và nộp hồ sơ trực tuyến.
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
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setSpeaking(false);
    };
  }, []);

  return (
    <div className="vneid-page">
      <div className="vneid-inner">

        {/* Header */}
        <header className="vneid-header">
          <div className="vneid-logo-row">
            <img
              src="https://image3.luatvietnam.vn/uploaded/images/original/2025/04/16/yeu-cau-100-ho-kinh-doanh-dang-ky-thanh-lap-tren-vneid_1604095754.png"
              alt="VNeID"
              className="vneid-logo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <span className="vneid-badge">📱 Định danh điện tử quốc gia</span>
          <h1>Hướng dẫn đăng ký VNeID</h1>
          <p>Bà con dùng VNeID thay thế CCCD, xem thẻ BHYT và làm thủ tục hành chính ngay tại nhà!</p>
          {speaking && (
            <div className="vneid-tts">🔊 Đang đọc hướng dẫn...</div>
          )}
        </header>

        {/* Banner khẩn cấp */}
        <div className="vneid-emergency">
          <span>🚨</span>
          <div>
            <strong>Cần hỗ trợ đăng ký VNeID?</strong>
            <p>Đến trực tiếp <strong>UBND xã Đăk Pxi</strong> hoặc gọi tổng đài: <a href="tel:1800599996">1800 599 996</a> (miễn phí)</p>
          </div>
        </div>

        {/* Chuẩn bị */}
        <div className="vneid-notice">
          <span>💡</span>
          <p>Bà con cần chuẩn bị: <strong>CCCD gắn chip</strong> + <strong>Số điện thoại đang dùng</strong> + <strong>Điện thoại thông minh</strong></p>
        </div>

        {/* Tính năng */}
        <div className="vneid-section">
          <h2 className="vneid-section-title">VNeID giúp bà con làm được gì?</h2>
          <div className="vneid-tinh-nang-grid">
            {TINH_NANG.map((tn, i) => (
              <div className="vneid-tinh-nang-item" key={i}>
                <span className="vneid-tn-icon">{tn.icon}</span>
                <div>
                  <div className="vneid-tn-label">{tn.label}</div>
                  <div className="vneid-tn-desc">{tn.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="vneid-tab-wrapper">
          <button
            className={'vneid-tab-btn' + (tab === 'dang-ky' ? ' vneid-tab-active' : '')}
            onClick={() => setTab('dang-ky')}
          >
            📝 Đăng ký tài khoản
          </button>
          <button
            className={'vneid-tab-btn' + (tab === 'kich-hoat' ? ' vneid-tab-active' : '')}
            onClick={() => setTab('kich-hoat')}
          >
            🔐 Kích hoạt mức độ 2
          </button>
        </div>

        {/* Nội dung tab */}
        {tab === 'dang-ky' && (
          <div className="vneid-tab-content">
            <p className="vneid-tab-desc">Thực hiện theo 5 bước đơn giản dưới đây để tạo tài khoản VNeID</p>

            <div className="vneid-buoc-list">
              {BUOC_DANG_KY.map((buoc) => (
                <div className="vneid-buoc-item" key={buoc.id}>
                  <div className="vneid-buoc-left">
                    <div className="vneid-buoc-num" style={{ background: buoc.color }}>{buoc.id}</div>
                    {buoc.id < BUOC_DANG_KY.length && <div className="vneid-buoc-line" />}
                  </div>
                  <div className="vneid-buoc-right">
                    <div className="vneid-buoc-icon">{buoc.icon}</div>
                    <div>
                      <div className="vneid-buoc-title">{buoc.title}</div>
                      <div className="vneid-buoc-desc">{buoc.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="vneid-download-row">
              <a
                href="https://play.google.com/store/apps/details?id=com.vnpt.vneid"
                target="_blank"
                rel="noreferrer"
                className="vneid-dl-btn vneid-dl-android"
              >
                📲 Tải VNeID Android
              </a>
              <a
                href="https://apps.apple.com/vn/app/vneid/id1598814353"
                target="_blank"
                rel="noreferrer"
                className="vneid-dl-btn vneid-dl-ios"
              >
                🍎 Tải VNeID iPhone
              </a>
            </div>
          </div>
        )}

        {tab === 'kich-hoat' && (
          <div className="vneid-tab-content">
            <p className="vneid-tab-desc">Kích hoạt mức độ 2 để dùng đầy đủ tính năng của VNeID</p>
            <div className="vneid-kich-hoat-grid">
              {KICH_HOAT_MUC2.map((kh) => (
                <div className="vneid-kh-card" key={kh.id}>
                  <div className="vneid-kh-title" style={{ borderColor: kh.color }}>
                    <span className="vneid-kh-icon">{kh.icon}</span>
                    <div>
                      <div className="vneid-kh-name">
                        {kh.title}
                        {kh.tag && (
                          <span className="vneid-kh-tag" style={{ background: kh.color }}>{kh.tag}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="vneid-kh-body">
                    {kh.steps.map((step, i) => (
                      <div className="vneid-kh-step" key={i}>
                        <span className="vneid-kh-num" style={{ background: kh.color }}>{i + 1}</span>
                        <p>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="vneid-nfc-note">
              <span>📡</span>
              <p><strong>Điện thoại cần có NFC</strong> để tự kích hoạt qua app. Nếu không có NFC, bà con đến UBND xã Đăk Pxi để được hỗ trợ miễn phí.</p>
            </div>
          </div>
        )}

        {/* Video hướng dẫn */}
        <div className="vneid-video-section">
          <h2 className="vneid-video-title">
            {tab === 'dang-ky' ? '🎬 Video hướng dẫn đăng ký VNeID' : '🎬 Video hướng dẫn kích hoạt mức độ 2'}
          </h2>
          <video
            key={tab}
            className="vneid-video"
            controls
            playsInline
            preload="metadata"
          >
            <source
              src={tab === 'dang-ky' ? '/video/huongdan-vneid-dangky.mp4' : '/video/huongdan-vneid-kichhoat.mp4'}
              type="video/mp4"
            />
            Trinh duyet khong ho tro video.
          </video>
          <p className="vneid-video-note">Chưa có video? Bà con xem hướng dẫn chi tiết ở các bước phía trên nhé!</p>
        </div>
        <FAQChatBot type="vneid" />

        {/* Footer */}
        <div className="vneid-footer-tip">
          <span>🏛️</span>
          <div>
            <strong>Vẫn chưa đăng ký được?</strong>
            <p>Bà con đến trực tiếp <strong>UBND xã Đăk Pxi</strong> — cán bộ sẽ hỗ trợ đăng ký và kích hoạt VNeID miễn phí, không mất tiền!</p>
          </div>
        </div>

      </div>
    </div>
  );
}
