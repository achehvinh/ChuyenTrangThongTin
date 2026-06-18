import { useState, useRef, useEffect } from 'react';
import './HuongDanBHXHPage.css';
import './TraCuuPage.css';
import FAQChatBot from '../components/FAQChatBot';

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
    subtitle: 'Bảo hiểm Xã hội Việt Nam',
    color: '#005bac',
    icon: '🔵',
    hinh: '/huong-dan/vssid.jpg',
    buoc: ['Tải app VssID', 'Nhập số CCCD', 'Chọn "Thẻ BHXH"'],
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
    buoc: ['Tải app Sức khỏe điện tử', 'Nhập SĐT + CCCD', 'Vào "Hồ sơ sức khỏe"'],
    btn: { label: '📲 Tải Sức khỏe điện tử', url: 'https://play.google.com/store/apps/details?id=vn.gov.moh.sk' },
    qr: 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://play.google.com/store/apps/details?id=vn.gov.moh.sk',
  },
  {
    id: 3,
    title: 'App VNeID',
    subtitle: 'Định danh điện tử quốc gia',
    color: '#7c3aed',
    icon: '🪪',
    hinh: '/huong-dan/vneid.jpg',
    buoc: ['Tải app VNeID', 'Đăng nhập + xác thực mặt', 'Vào "Giấy tờ" → BHXH'],
    btn: { label: '📲 Tải VNeID', url: 'https://play.google.com/store/apps/details?id=com.vnpt.vneid' },
    qr: 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://play.google.com/store/apps/details?id=com.vnpt.vneid',
  },
];

const HUONG_DAN_WEB = [
  {
    id: 1,
    title: 'baohiemxahoi.gov.vn',
    subtitle: 'Cổng BHXH Việt Nam',
    color: '#16a34a',
    icon: '🏛️',
    hinh: '/huong-dan/tracuubhyt.jpg',
    buoc: ['Vào baohiemxahoi.gov.vn', 'Chọn "Tra cứu"', 'Nhập CCCD → Tra cứu'],
    btn: { label: '🌐 Vào tra cứu ngay', url: 'https://baohiemxahoi.gov.vn/tracuu/Pages/tra-cuu-the-bao-hiem-y-te.aspx' },
    qr: 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://baohiemxahoi.gov.vn',
  },
  {
    id: 2,
    title: 'dichvucong.gov.vn',
    subtitle: 'Cổng dịch vụ công quốc gia',
    color: '#dc2626',
    icon: '🖥️',
    hinh: '/huong-dan/tracuubhxh.jpg',
    buoc: ['Vào dichvucong.gov.vn', 'Đăng nhập bằng VNeID', 'Tìm "Tra cứu thẻ BHXH"'],
    btn: { label: '🌐 Vào Cổng dịch vụ công', url: 'https://dichvucong.gov.vn' },
    qr: 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://dichvucong.gov.vn',
  },
  {
    id: 3,
    title: 'baohiemyte.vn',
    subtitle: 'Cổng Bảo hiểm Y tế',
    color: '#0369a1',
    icon: '💻',
    hinh: '/huong-dan/tracuubhxh.jpg',
    buoc: ['Vào baohiemyte.vn', 'Chọn "Tra cứu thông tin"', 'Nhập CCCD hoặc mã thẻ'],
    btn: { label: '🌐 Vào baohiemyte.vn', url: 'https://baohiemyte.vn' },
    qr: 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://baohiemyte.vn',
  },
];

export default function HuongDanBHXHPage() {
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
          <h1>Tra cứu thẻ BHXH tại nhà<br /><span>không cần lên xã!</span></h1>
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

              {/* Nhãn các bước */}
              <div className="hd-step-label-row" style={{ background: hd.color + 'dd' }}>
                {hd.buoc.map((b, i) => (
                  <div className="hd-step-label-item" key={i}>
                    <div className="hd-step-label-num">{i + 1}</div>
                    <div>{b}</div>
                  </div>
                ))}
              </div>

              {/* Ảnh full width */}
              <img
                src={hd.hinh}
                alt={hd.title}
                className="hd-img-full"
                onError={e => { e.target.style.display = 'none'; }}
              />

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
        <FAQChatBot type="bhxh" />

        {/* Footer */}
        <div className="tracuu-footer-tip">
          <span>🏛️</span>
          <div>
            <strong>Vẫn chưa tra cứu được?</strong>
            <p>Bà con đến trực tiếp <strong>UBND xã Đăk Pxi</strong> — cán bộ hỗ trợ miễn phí!</p>
          </div>
          
        </div>

      </div>
    </div>
  );
}