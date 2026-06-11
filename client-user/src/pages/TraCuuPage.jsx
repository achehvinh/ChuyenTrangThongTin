import { useState, useRef, useEffect } from 'react';
import './TraCuuPage.css';

const HUONG_DAN_APP = [
  {
    id: 1,
    title: 'App VssID',
    subtitle: 'Ứng dụng Bảo hiểm Xã hội Việt Nam',
    steps: [
      'Tải app VssID trên CH Play hoặc App Store',
      'Đăng nhập bằng số CCCD 12 chữ số',
      'Chọn mục "Thẻ BHYT" để xem thông tin thẻ',
    ],
    btn: {
      label: '📲 Tải VssID',
      url: 'https://play.google.com/store/apps/details?id=com.vssid',
    },
    color: '#005bac',
    icon: '🔵',
  },
  {
    id: 2,
    title: 'App Sức khỏe điện tử',
    subtitle: 'Ứng dụng của Bộ Y tế',
    steps: [
      'Tải app "Sức khỏe điện tử" trên CH Play hoặc App Store',
      'Đăng ký bằng số điện thoại và CCCD',
      'Chọn mục "Hồ sơ sức khỏe" rồi xem thông tin BHYT',
    ],
    btn: {
      label: '📲 Tải Sức khỏe điện tử',
      url: 'https://play.google.com/store/apps/details?id=vn.gov.moh.sk',
    },
    color: '#0891b2',
    icon: '🩺',
  },
  {
    id: 3,
    title: 'App VNeID',
    subtitle: 'Ứng dụng định danh điện tử quốc gia',
    steps: [
      'Tải app VNeID trên CH Play hoặc App Store',
      'Đăng nhập bằng số CCCD và xác thực khuôn mặt',
      'Chọn mục "Giấy tờ" rồi tìm "Thẻ BHYT điện tử"',
    ],
    btn: {
      label: '📲 Tải VNeID',
      url: 'https://play.google.com/store/apps/details?id=com.vnpt.vneid',
    },
    color: '#7c3aed',
    icon: '🪪',
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
      'Chọn "Tra cứu thông tin người tham gia BHYT"',
      'Nhập số CCCD 12 chữ số và bấm tra cứu',
    ],
    btn: {
      label: '🌐 Vào tra cứu ngay',
      url: 'https://baohiemxahoi.gov.vn/tracuu/Pages/tra-cuu-the-bao-hiem-y-te.aspx',
    },
    color: '#16a34a',
    icon: '🏛️',
  },
  {
    id: 2,
    title: 'Cổng dịch vụ công quốc gia',
    subtitle: 'dichvucong.gov.vn',
    steps: [
      'Vào trang: dichvucong.gov.vn',
      'Đăng nhập bằng tài khoản VNeID hoặc số CCCD',
      'Tìm kiếm "Tra cứu thẻ BHYT"',
      'Nhập thông tin và xem kết quả',
    ],
    btn: {
      label: '🌐 Vào Cổng dịch vụ công',
      url: 'https://dichvucong.gov.vn',
    },
    color: '#dc2626',
    icon: '🖥️',
  },
  {
    id: 3,
    title: 'Tra cứu trên Cổng BHYT',
    subtitle: 'baohiemyte.vn',
    steps: [
      'Vào trang: baohiemyte.vn',
      'Chọn mục "Tra cứu thông tin"',
      'Nhập số thẻ BHYT hoặc số CCCD',
      'Bấm "Tra cứu" để xem thông tin',
    ],
    btn: {
      label: '🌐 Vào baohiemyte.vn',
      url: 'https://baohiemyte.vn',
    },
    color: '#0369a1',
    icon: '💻',
  },
];

export default function TraCuuPage() {
  const [speaking, setSpeaking] = useState(false);
  const [tab, setTab] = useState('app');
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
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setSpeaking(false);
    };
  }, []);

  const danhSach = tab === 'app' ? HUONG_DAN_APP : HUONG_DAN_WEB;

  return (
    <div className="tracuu-page">
      <div className="tracuu-inner">

        <header className="tracuu-header">
          <h1>HƯỚNG DẪN TRA CỨU THẺ BHYT TẠI NHÀ</h1>
          <p>Bà con không cần lên UBND xã, chỉ cần điện thoại hoặc máy tính là tra cứu được ngay!</p>
          {speaking && (
            <div className="tts-indicator">
              🔊 Đang đọc hướng dẫn...
            </div>
          )}
        </header>

        <div className="tracuu-emergency">
          <span>🚨</span>
          <div>
            <strong>Cần hỗ trợ ngay?</strong>
            <p>Gọi tổng đài BHXH miễn phí: <a href="tel:1900936936">1900 936 936</a> (24/7)</p>
          </div>
        </div>

        <div className="tracuu-notice">
          <span>💡</span>
          <p>Bà con chỉ cần chuẩn bị <strong>số CCCD 12 chữ số</strong> là có thể tra cứu ngay tại nhà!</p>
        </div>

        <div className="tab-wrapper">
          <button
            className={'tab-btn' + (tab === 'app' ? ' tab-active' : '')}
            onClick={() => setTab('app')}
          >
            📱 Tra cứu qua App
          </button>
          <button
            className={'tab-btn' + (tab === 'web' ? ' tab-active' : '')}
            onClick={() => setTab('web')}
          >
            🌐 Tra cứu qua Website
          </button>
        </div>

        <div className="tab-desc">
          {tab === 'app' && (
            <p>Dùng điện thoại thông minh, tải 1 trong 3 app bên dưới để xem thông tin thẻ BHYT</p>
          )}
          {tab === 'web' && (
            <p>Dùng điện thoại hoặc máy tính vào 1 trong 3 trang web bên dưới để tra cứu</p>
          )}
        </div>

        <div className="huong-dan-list">
          {danhSach.map((hd) => (
            <div className="huong-dan-card" key={hd.id}>

              <div className="huong-dan-title" style={{ borderColor: hd.color }}>
                <span className="huong-dan-icon">{hd.icon}</span>
                <div>
                  <h2>{hd.title}</h2>
                  <span className="huong-dan-subtitle">{hd.subtitle}</span>
                </div>
              </div>

              <div className="huong-dan-body" style={{ gridTemplateColumns: '1fr' }}>
                <div className="huong-dan-steps">
                  {hd.steps.map((step, i) => (
                    <div className="step-item" key={i}>
                      <span className="step-num" style={{ background: hd.color }}>{i + 1}</span>
                      <p>{step}</p>
                    </div>
                  ))}
                  <a
                    href={hd.btn.url}
                    target="_blank"
                    rel="noreferrer"
                    className="huong-dan-btn"
                    style={{ background: hd.color }}
                  > 
                    {hd.btn.label}
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="video-section">
          <h2 className="video-title">
            {tab === 'app' ? '🎬 Video hướng dẫn tra cứu qua App' : '🎬 Video hướng dẫn tra cứu qua Website'}
          </h2>
          <video
            key={tab}
            className="video-main"
            controls
            playsInline
            preload="metadata"
          >
            <source
              src={tab === 'app' ? '/video/huongdan-bhyt.mp4' : '/video/huongdan-bhytweb.mp4'}
              type="video/mp4"
            />
            Trinh duyet khong ho tro video.
          </video>
        </div>

      </div>
    </div>
  );
}