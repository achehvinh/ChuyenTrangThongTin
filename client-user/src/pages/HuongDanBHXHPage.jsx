import { useState, useRef, useEffect } from 'react';
import './HuongDanBHXHPage.css';

const DICH_VU = [
  {
    id: 'huu-tri',
    icon: '👴',
    label: 'Hưu trí',
    color: '#1d4ed8',
  },
  {
    id: 'thai-san',
    icon: '👶',
    label: 'Thai sản',
    color: '#0891b2',
  },
  {
    id: 'om-dau',
    icon: '🏥',
    label: 'Ốm đau',
    color: '#16a34a',
  },
  {
    id: 'tnld',
    icon: '⚠️',
    label: 'Tai nạn LĐ',
    color: '#d97706',
  },
  {
    id: 'that-nghiep',
    icon: '📋',
    label: 'Thất nghiệp',
    color: '#dc2626',
  },
  {
    id: 'tu-tuat',
    icon: '🕊️',
    label: 'Tử tuất',
    color: '#7c3aed',
  },
];

const HUONG_DAN_APP = [
  {
    id: 1,
    title: 'App VssID',
    subtitle: 'Ứng dụng chính thức của BHXH Việt Nam',
    steps: [
      'Tải app VssID trên CH Play (Android) hoặc App Store (iPhone)',
      'Đăng nhập bằng số CCCD 12 chữ số và mật khẩu',
      'Chọn mục "Quá trình tham gia BHXH" để tra cứu',
      'Xem đầy đủ số năm đóng, mức đóng và quyền lợi',
    ],
    btn: { label: '📲 Tải VssID', url: 'https://play.google.com/store/apps/details?id=com.vssid' },
    color: '#1d4ed8',
    icon: '🔵',
    tag: 'Khuyên dùng',
  },
  {
    id: 2,
    title: 'App VNeID',
    subtitle: 'Định danh điện tử quốc gia',
    steps: [
      'Tải app VNeID trên CH Play hoặc App Store',
      'Đăng nhập và xác thực khuôn mặt bằng CCCD gắn chip',
      'Chọn mục "Bảo hiểm xã hội" trong danh sách dịch vụ',
      'Xem thông tin quá trình tham gia BHXH',
    ],
    btn: { label: '📲 Tải VNeID', url: 'https://play.google.com/store/apps/details?id=com.vnpt.vneid' },
    color: '#7c3aed',
    icon: '🪪',
    tag: null,
  },
];

const HUONG_DAN_WEB = [
  {
    id: 1,
    title: 'Cổng thông tin BHXH Việt Nam',
    subtitle: 'baohiemxahoi.gov.vn',
    steps: [
      'Vào trang: baohiemxahoi.gov.vn',
      'Chọn mục "Tra cứu" trên thanh menu',
      'Chọn "Tra cứu quá trình đóng BHXH"',
      'Nhập số CCCD 12 chữ số và bấm tra cứu',
    ],
    btn: { label: '🌐 Tra cứu ngay', url: 'https://baohiemxahoi.gov.vn/tracuu/Pages/tra-cuu-qua-trinh-dong-bao-hiem-xa-hoi.aspx' },
    color: '#16a34a',
    icon: '🏛️',
    tag: 'Chính thức',
  },
  {
    id: 2,
    title: 'Cổng dịch vụ công quốc gia',
    subtitle: 'dichvucong.gov.vn',
    steps: [
      'Vào trang: dichvucong.gov.vn',
      'Đăng nhập bằng tài khoản VNeID hoặc số CCCD',
      'Tìm kiếm "Tra cứu BHXH" trong ô tìm kiếm',
      'Chọn dịch vụ và nhập thông tin để tra cứu',
    ],
    btn: { label: '🌐 Vào Cổng DVC', url: 'https://dichvucong.gov.vn' },
    color: '#dc2626',
    icon: '🖥️',
    tag: null,
  },
];

export default function HuongDanBHXHPage() {
  const [tab, setTab] = useState('app');
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);

  const readText = `
    Hướng dẫn tra cứu thông tin Bảo hiểm Xã hội tại nhà, không cần lên UBND xã.
    Bà con chỉ cần có số căn cước công dân mười hai chữ số là tra cứu được ngay.
    Cách thứ nhất: Dùng điện thoại qua app VssID hoặc VNeID.
    Cách thứ hai: Dùng máy tính hoặc điện thoại vào trang baohiemxahoi.gov.vn hoặc dichvucong.gov.vn.
    Nếu cần hỗ trợ, gọi tổng đài một chín không không, chín ba sáu, chín ba sáu. Miễn phí hai mươi bốn trên bảy.
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

  const danhSach = tab === 'app' ? HUONG_DAN_APP : HUONG_DAN_WEB;

  return (
    <div className="bhxh-page">
      <div className="bhxh-inner">

        {/* Header */}
        <header className="bhxh-header">
          <h1>HƯỚNG DẪN TRA CỨU THÔNG TIN BHXH TẠI NHÀ</h1>
          <p>Bà con không cần lên UBND xã, chỉ cần điện thoại hoặc máy tính là tra cứu được ngay!</p>
          {speaking && (
            <div className="bhxh-tts">🔊 Đang đọc hướng dẫn...</div>
          )}
        </header>

        {/* Banner khẩn cấp */}
        <div className="bhxh-emergency">
          <span>🚨</span>
          <div>
            <strong>Cần hỗ trợ ngay?</strong>
            <p>Gọi tổng đài BHXH miễn phí: <a href="tel:1900936936">1900 936 936</a> (24/7)</p>
          </div>
        </div>

        {/* Gợi ý nhanh */}
        <div className="bhxh-notice">
          <span>💡</span>
          <p>Bà con chỉ cần chuẩn bị <strong>số CCCD 12 chữ số</strong> là có thể tra cứu ngay tại nhà!</p>
        </div>

        {/* Các chế độ BHXH */}
        <div className="bhxh-dich-vu-section">
          <h2 className="bhxh-section-title">Các chế độ BHXH bà con có thể tra cứu</h2>
          <div className="bhxh-dich-vu-grid">
            {DICH_VU.map((dv) => (
              <div className="bhxh-dich-vu-item" key={dv.id} style={{ borderColor: dv.color }}>
                <span className="bhxh-dich-vu-icon">{dv.icon}</span>
                <span className="bhxh-dich-vu-label" style={{ color: dv.color }}>{dv.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab chọn cách tra cứu */}
        <div className="bhxh-tab-wrapper">
          <button
            className={'bhxh-tab-btn' + (tab === 'app' ? ' bhxh-tab-active' : '')}
            onClick={() => setTab('app')}
          >
            📱 Tra cứu qua App
          </button>
          <button
            className={'bhxh-tab-btn' + (tab === 'web' ? ' bhxh-tab-active' : '')}
            onClick={() => setTab('web')}
          >
            🌐 Tra cứu qua Website
          </button>
        </div>

        <div className="bhxh-tab-desc">
          {tab === 'app'
            ? 'Dùng điện thoại thông minh, tải 1 trong 2 app bên dưới để xem thông tin BHXH'
            : 'Dùng điện thoại hoặc máy tính vào 1 trong 2 trang web bên dưới để tra cứu'}
        </div>

        {/* Danh sách hướng dẫn */}
        <div className="bhxh-list">
          {danhSach.map((hd) => (
            <div className="bhxh-card" key={hd.id}>

              <div className="bhxh-card-title" style={{ borderColor: hd.color }}>
                <span className="bhxh-card-icon">{hd.icon}</span>
                <div>
                  <div className="bhxh-card-name">
                    {hd.title}
                    {hd.tag && (
                      <span className="bhxh-tag" style={{ background: hd.color }}>{hd.tag}</span>
                    )}
                  </div>
                  <span className="bhxh-card-subtitle">{hd.subtitle}</span>
                </div>
              </div>

              <div className="bhxh-card-body">
                <div className="bhxh-steps">
                  {hd.steps.map((step, i) => (
                    <div className="bhxh-step-item" key={i}>
                      <span className="bhxh-step-num" style={{ background: hd.color }}>{i + 1}</span>
                      <p>{step}</p>
                    </div>
                  ))}
                  <a
                    href={hd.btn.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bhxh-btn"
                    style={{ background: hd.color }}
                  >
                    {hd.btn.label}
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Video hướng dẫn */}
        <div className="bhxh-video-section">
          <h2 className="bhxh-video-title">
            {tab === 'app' ? '🎬 Video hướng dẫn tra cứu BHXH qua App' : '🎬 Video hướng dẫn tra cứu BHXH qua Website'}
          </h2>
          <video
            key={tab}
            className="bhxh-video"
            controls
            playsInline
            preload="metadata"
          >
            <source
              src={tab === 'app' ? '/video/huongdan-bhxh-app.mp4' : '/video/huongdan-bhxh-web.mp4'}
              type="video/mp4"
            />
            Trinh duyet khong ho tro video.
          </video>
          <p className="bhxh-video-note">Chưa có video? Bà con xem hướng dẫn chi tiết ở các bước phía trên nhé!</p>
        </div>

        {/* Footer gợi ý */}
        <div className="bhxh-footer-tip">
          <span>📞</span>
          <div>
            <strong>Vẫn chưa tra cứu được?</strong>
            <p>Bà con gọi tổng đài <a href="tel:1900936936">1900 936 936</a> miễn phí hoặc đến trực tiếp <strong>UBND xã Đăk Pxi</strong> để cán bộ hỗ trợ.</p>
          </div>
        </div>

      </div>
    </div>
  );
}