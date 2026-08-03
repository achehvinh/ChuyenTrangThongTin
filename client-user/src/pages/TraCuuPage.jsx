import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TraCuuPage.css';
import FAQChatBot from "../components/Faqchatbot";

const HUONG_DAN_APP = [
  {
    id: 1,
    title: 'App VssID',
    subtitle: 'BHXH Việt Nam',
    color: '#005bac',
    iconSvg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="3" ry="3"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    hinh: '/huong-dan/tracuuappbhyt.jpg',
    steps: [
      {
        num: 1,
        title: 'Bước 1: Tải ứng dụng VssID',
        desc: 'Mở CH Play (Android) hoặc App Store (iPhone), tìm "VssID" và cài đặt về máy.',
        img: '/huong-dan/vssid_step1.jpg',
        audioSrc: '/huong-dan/vssidweb_step1.mp3',
        placeholderName: 'vssid_step1.jpg',
        audioFile: 'vssidweb_step1.mp3'
      },
      {
        num: 2,
        title: 'Bước 2: Đăng nhập cá nhân',
        desc: 'Nhập Mã số BHXH (hoặc số CCCD 12 số) và mật khẩu cá nhân để đăng nhập.',
        img: '/huong-dan/vssid_step2.jpg',
        audioSrc: '/huong-dan/vssid_step2.mp3',
        placeholderName: 'vssid_step2.jpg',
        audioFile: 'vssid_step2.mp3'
      },
      {
        num: 3,
        title: 'Bước 3: Xem thẻ BHYT trực tuyến',
        desc: 'Nhấn chọn mục "Thẻ BHYT" để hiện ảnh thẻ và mã QR dùng khi đi khám chữa bệnh.',
        img: '/huong-dan/vssid_step3.jpg',
        audioSrc: '/huong-dan/vssid_step3.mp3',
        placeholderName: 'vssid_step3.jpg',
        audioFile: 'vssid_step3.mp3'
      }
    ],
    btn: { label: 'Tải VssID', url: 'https://play.google.com/store/apps/details?id=com.vssid' },
    qr: 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://play.google.com/store/apps/details?id=com.vssid',
  },
  {
    id: 2,
    title: 'App Sức khỏe điện tử',
    subtitle: 'Bộ Y tế Việt Nam',
    color: '#0891b2',
    iconSvg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    hinh: '/huong-dan/suckhoe.jpg',
    steps: [
      {
        num: 1,
        title: 'Bước 1: Tải ứng dụng về điện thoại',
        desc: 'Tải ứng dụng "Sức khỏe điện tử" từ CH Play hoặc App Store.',
        img: '/huong-dan/suckhoe_step1.jpg',
        audioSrc: '/huong-dan/suckhoe_step1.mp3',
        placeholderName: 'suckhoe_step1.jpg',
        audioFile: 'suckhoe_step1.mp3'
      },
      {
        num: 2,
        title: 'Bước 2: Đăng ký & Đồng bộ thông tin',
        desc: 'Nhập số điện thoại cá nhân và CCCD 12 số để đồng bộ dữ liệu y tế.',
        img: '/huong-dan/suckhoe_step2.jpg',
        audioSrc: '/huong-dan/suckhoe_step2.mp3',
        placeholderName: 'suckhoe_step2.jpg',
        audioFile: 'suckhoe_step2.mp3'
      },
      {
        num: 3,
        title: 'Bước 3: Tra cứu thông tin thẻ BHYT',
        desc: 'Vào phần "Hồ sơ sức khỏe" hoặc "Thẻ BHYT" để tra cứu giá trị sử dụng.',
        img: '/huong-dan/suckhoe_step3.jpg',
        audioSrc: '/huong-dan/suckhoe_step3.mp3',
        placeholderName: 'suckhoe_step3.jpg',
        audioFile: 'suckhoe_step3.mp3'
      }
    ],
    btn: { label: 'Tải Sức khỏe điện tử', url: 'https://play.google.com/store/apps/details?id=vn.gov.moh.sk' },
    qr: 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://play.google.com/store/apps/details?id=vn.gov.moh.sk',
  },
  {
    id: 3,
    title: 'App VNeID',
    subtitle: 'Định danh điện tử quốc gia',
    color: '#7c3aed',
    iconSvg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2"/>
        <circle cx="9" cy="10" r="2"/>
        <line x1="15" y1="8" x2="17" y2="8"/>
        <line x1="15" y1="12" x2="17" y2="12"/>
        <path d="M7 16c0-1.5 1.5-2 2-2s2 .5 2 2"/>
      </svg>
    ),
    hinh: '/huong-dan/tracuuvneid.jpg',
    steps: [
      {
        num: 1,
        title: 'Bước 1: Kích hoạt Định danh Mức 2',
        desc: 'Đảm bảo ứng dụng VNeID đã kích hoạt Mức độ 2 (làm tại Công an xã Đăk Pxi).',
        img: '/huong-dan/vneid_step1.jpg',
        audioSrc: '/huong-dan/vneid_step1.mp3',
        placeholderName: 'vneid_step1.jpg',
        audioFile: 'vneid_step1.mp3'
      },
      {
        num: 2,
        title: 'Bước 2: Mở Ví giấy tờ bảo mật',
        desc: 'Đăng nhập VNeID, chọn "Ví giấy tờ" và nhập Passcode cá nhân.',
        img: '/huong-dan/vneid_step2.jpg',
        audioSrc: '/huong-dan/vneid_step2.mp3',
        placeholderName: 'vneid_step2.jpg',
        audioFile: 'vneid_step2.mp3'
      },
      {
        num: 3,
        title: 'Bước 3: Hiển thị thẻ BHYT tích hợp',
        desc: 'Chọn thẻ "Bảo hiểm y tế" để hiện thời hạn dùng và mã QR khám bệnh.',
        img: '/huong-dan/vneid_step3.jpg',
        audioSrc: '/huong-dan/vneid_step3.mp3',
        placeholderName: 'vneid_step3.jpg',
        audioFile: 'vneid_step3.mp3'
      }
    ],
    btn: { label: 'Tải VNeID', url: 'https://play.google.com/store/apps/details?id=com.vnpt.vneid' },
    qr: 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://play.google.com/store/apps/details?id=com.vnpt.vneid',
  },
];

const HUONG_DAN_WEB = [
  {
    id: 101,
    title: 'dichvucong.gov.vn',
    subtitle: 'Cổng dịch vụ công quốc gia',
    color: '#dc2626',
    iconSvg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    hinh: '/huong-dan/tracuwdichvucong.jpg',
    steps: [
      {
        num: 1,
        title: 'Bước 1: Truy cập dichvucong.gov.vn',
        desc: 'Mở trình duyệt web truy cập địa chỉ website dichvucong.gov.vn.',
        img: '/huong-dan/dvc_step1.jpg',
        audioSrc: '/huong-dan/dvc_step1.mp3',
        placeholderName: 'dvc_step1.jpg',
        audioFile: 'dvc_step1.mp3'
      },
      {
        num: 2,
        title: 'Bước 2: Đăng nhập VNeID',
        desc: 'Nhấn Đăng nhập ở góc trên và lựa chọn đăng nhập bằng Tài khoản VNeID.',
        img: '/huong-dan/dvc_step2.jpg',
        audioSrc: '/huong-dan/dvc_step2.mp3',
        placeholderName: 'dvc_step2.jpg',
        audioFile: 'dvc_step2.mp3'
      },
      {
        num: 3,
        title: 'Bước 3: Tra cứu thẻ BHYT',
        desc: 'Tìm dịch vụ "Tra cứu thông tin thẻ BHYT" để xem chi tiết hạn dùng.',
        img: '/huong-dan/dvc_step3.jpg',
        audioSrc: '/huong-dan/dvc_step3.mp3',
        placeholderName: 'dvc_step3.jpg',
        audioFile: 'dvc_step3.mp3'
      }
    ],
    btn: { label: 'Vào Cổng Dịch vụ công', url: 'https://dichvucong.gov.vn' },
    qr: 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://dichvucong.gov.vn',
  },
  {
    id: 102,
    title: 'baohiemyte.vn',
    subtitle: 'Cổng Bảo hiểm Y tế Việt Nam',
    color: '#0284c7',
    iconSvg: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    hinh: '/huong-dan/tracuubhyt.jpg',
    steps: [
      {
        num: 1,
        title: 'Bước 1: Mở trang web baohiemyte.vn',
        desc: 'Truy cập địa chỉ trang web baohiemyte.vn trên điện thoại hoặc máy tính.',
        img: '/huong-dan/bhytweb_step1.jpg',
        audioSrc: '/huong-dan/bhytweb_step1.mp3',
        placeholderName: 'bhytweb_step1.jpg',
        audioFile: 'bhytweb_step1.mp3'
      },
      {
        num: 2,
        title: 'Bước 2: Nhập số CCCD/BHYT',
        desc: 'Điền Mã thẻ BHYT (hoặc số CCCD 12 số), họ tên và ngày tháng năm sinh.',
        img: '/huong-dan/bhytweb_step2.jpg',
        audioSrc: '/huong-dan/bhytweb_step2.mp3',
        placeholderName: 'bhytweb_step2.jpg',
        audioFile: 'bhytweb_step2.mp3'
      },
      {
        num: 3,
        title: 'Bước 3: Bấm Tra cứu',
        desc: 'Tích mã captcha "Tôi không phải là người máy" và bấm "Tra cứu" để xem.',
        img: '/huong-dan/bhytweb_step3.jpg',
        audioSrc: '/huong-dan/bhytweb_step3.mp3',
        placeholderName: 'bhytweb_step3.jpg',
        audioFile: 'bhytweb_step3.mp3'
      }
    ],
    btn: { label: 'Vào baohiemyte.vn', url: 'https://baohiemyte.vn' },
    qr: 'https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=https://baohiemyte.vn',
  },
];

export default function TraCuuPage() {
  const [speaking, setSpeaking] = useState(false);
  const [tab, setTab] = useState('app'); // 'app' | 'web'
  const [selectedAppId, setSelectedAppId] = useState(1);
  const [activeStepTab, setActiveStepTab] = useState(1); // 1 | 2 | 3 | 0 (0: Xem ca 3 buoc)
  const [anhPhongTo, setAnhPhongTo] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  
  const [completedSteps, setCompletedSteps] = useState({});
  const [playingStepAudio, setPlayingStepAudio] = useState(null);

  const audioRef = useRef(null);
  const stepAudioRef = useRef(null);

  const readText = `
    Hướng dẫn tra cứu thẻ Bảo hiểm Y tế tại nhà, không cần lên UBND xã.
    Bà con chỉ cần có thẻ căn cước công dân và điện thoại hoặc máy tính là tra cứu thành công ngay.
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
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; audioRef.current = null; }
      if (stepAudioRef.current) { stepAudioRef.current.pause(); stepAudioRef.current.currentTime = 0; stepAudioRef.current = null; }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeaking(false);
    };
  }, []);

  const danhSach = tab === 'app' ? HUONG_DAN_APP : HUONG_DAN_WEB;
  const currentApp = danhSach.find(a => a.id === selectedAppId) || danhSach[0];

  const countCompleted = currentApp.steps.filter(s => completedSteps[`${currentApp.id}_${s.num}`]).length;

  const handleTabChange = (newTab) => {
    setTab(newTab);
    const newList = newTab === 'app' ? HUONG_DAN_APP : HUONG_DAN_WEB;
    setSelectedAppId(newList[0].id);
    setActiveStepTab(1);
    stopStepAudio();
  };

  const toggleStepDone = (stepNum) => {
    const key = `${currentApp.id}_${stepNum}`;
    const nextState = !completedSteps[key];
    setCompletedSteps(prev => ({
      ...prev,
      [key]: nextState
    }));
    
    if (nextState && activeStepTab > 0 && activeStepTab < 3) {
      setActiveStepTab(activeStepTab + 1);
    }
  };

  const playStepAudio = (step) => {
    if (playingStepAudio === step.num) {
      stopStepAudio();
      return;
    }

    stopStepAudio();
    setPlayingStepAudio(step.num);

    // Sử dụng chung 1 file âm thanh mới /huong-dan/vssidweb_step1.mp3 cho cả 3 bước
    const sharedAudioSrc = '/huong-dan/vssidweb_step1.mp3';
    const audio = new Audio(sharedAudioSrc);
    stepAudioRef.current = audio;
    audio.play()
      .then(() => {
        audio.onended = () => setPlayingStepAudio(null);
      })
      .catch(() => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const textToRead = `${step.title}. ${step.desc}`;
          const u = new SpeechSynthesisUtterance(textToRead);
          u.lang = 'vi-VN';
          u.rate = 0.95;
          u.onend = () => setPlayingStepAudio(null);
          u.onerror = () => setPlayingStepAudio(null);
          window.speechSynthesis.speak(u);
        } else {
          setPlayingStepAudio(null);
        }
      });
  };

  const stopStepAudio = () => {
    if (stepAudioRef.current) {
      stepAudioRef.current.pause();
      stepAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingStepAudio(null);
  };

  const displayedSteps = activeStepTab === 0 
    ? currentApp.steps 
    : currentApp.steps.filter(s => s.num === activeStepTab);

  return (
    <div className="clean-tracuu-page">
      <div className="clean-tracuu-container">

        {/* ── 0. TOP NAVIGATION: BACK TO HOME ── */}
        <nav className="tracuu-back-nav" aria-label="Điều hướng quay lại">
          <Link to="/" className="back-home-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            <span>Quay lại Trang chủ</span>
          </Link>
        </nav>

        {/* ── 1. TOP HEADER & INLINE PREPARATION STEP BAR ── */}
        <header className="clean-top-header">
          <div className="clean-header-main">
            <div className="clean-title-group">
              <h1 className="clean-title">
                Tra cứu thẻ BHYT & BHXH tại nhà
              </h1>
              <div className="clean-subtitle">
                Không cần lên xã
              </div>
            </div>

            {/* PHƯƠNG THỨC TRA CỨU SEGMENT TABS */}
            <div className="clean-mode-tabs">
              <button
                type="button"
                className={`clean-mode-btn ${tab === 'app' ? 'active' : ''}`}
                onClick={() => handleTabChange('app')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="3" ry="3"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
                <span>Cách 1: Qua App di động</span>
              </button>
              <button
                type="button"
                className={`clean-mode-btn ${tab === 'web' ? 'active' : ''}`}
                onClick={() => handleTabChange('web')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span>Cách 2: Qua Website</span>
              </button>
            </div>
          </div>

          {/* CHUẨN BỊ 4 BƯỚC INLINE STEPPER */}
          <div className="clean-prep-inline">
            <div className="prep-chips">
              <div className="chip-step-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chip-svg">
                  <rect x="3" y="4" width="18" height="16" rx="3"/>
                  <circle cx="9" cy="10" r="2"/>
                  <line x1="14" y1="9" x2="17" y2="9"/>
                  <line x1="14" y1="13" x2="17" y2="13"/>
                  <path d="M6 16c0-1.5 1.5-2 3-2s3 .5 3 2"/>
                </svg>
                <span className="chip-text">Thẻ CCCD 12 số</span>
              </div>
              <span className="chip-arrow">→</span>

              <div className="chip-step-item">
                <span className="chip-num-box">2</span>
                <span className="chip-text">Điện thoại / Máy tính</span>
              </div>
              <span className="chip-arrow">→</span>

              <div className="chip-step-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="chip-svg">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <span className="chip-text">Kết nối Internet</span>
              </div>
              <span className="chip-arrow">→</span>

              <div className="chip-step-item chip-done">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="chip-svg">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span className="chip-text">Tra cứu thành công</span>
              </div>
            </div>

            {speaking && (
              <span className="clean-tts-badge">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
                <span>Đang phát thanh...</span>
              </span>
            )}
          </div>
        </header>

        {/* ── 2. 3-COLUMN MAIN DASHBOARD LAYOUT ── */}
        <div className="tracuu-3col-layout">
          
          {/* CỘT TRÁI: ỨNG DỤNG HỖ TRỢ */}
          <aside className="col-left-sidebar">
            <div className="sidebar-section-card">
              <div className="sidebar-card-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                <span>ỨNG DỤNG HỖ TRỢ</span>
              </div>

              <div className="app-list-menu">
                {danhSach.map((app) => {
                  const isActive = app.id === currentApp.id;
                  return (
                    <button
                      key={app.id}
                      type="button"
                      className={`app-menu-btn ${isActive ? 'active' : ''}`}
                      onClick={() => { setSelectedAppId(app.id); setActiveStepTab(1); stopStepAudio(); }}
                    >
                      <div className="app-btn-icon" style={{ background: app.color }}>
                        {app.iconSvg}
                      </div>
                      <div className="app-btn-info">
                        <div className="app-btn-name">{app.title}</div>
                        <div className="app-btn-sub">{app.subtitle}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CARD QUÉT MÃ TẢI ỨNG DỤNG */}
            <div className="sidebar-qr-card">
              <div className="qr-card-title">QUÉT MÃ TẢI ỨNG DỤNG</div>
              <div className="qr-card-sub">Quét mã QR để tải ứng dụng</div>

              <div className="qr-img-wrapper">
                <img
                  src={currentApp.qr}
                  alt="QR Download"
                  className="qr-img-code"
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>

              <div className="app-store-badges">
                <a
                  href={currentApp.btn.url}
                  target="_blank"
                  rel="noreferrer"
                  className="store-badge-btn"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" />
                </a>
                <a
                  href={currentApp.btn.url}
                  target="_blank"
                  rel="noreferrer"
                  className="store-badge-btn"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" />
                </a>
              </div>
            </div>
          </aside>

          {/* CỘT GIỮA: NỘI DUNG CHÍNH (APP BANNER + PROGRESS WIZARD + STEP SPLIT + 4 FEATURE CARDS) */}
          <main className="col-center-main">
            
            {/* APP BANNER STRIP CARD */}
            <section className="app-top-banner-card" style={{ background: currentApp.color }}>
              <div className="app-banner-left">
                <div className="app-banner-icon-bg">
                  {currentApp.iconSvg}
                </div>
                <div className="app-banner-texts">
                  <h2 className="app-banner-main-title">{currentApp.title}</h2>
                  <div className="app-banner-main-sub">{currentApp.subtitle}</div>
                </div>
              </div>

              <a
                href={currentApp.btn.url}
                target="_blank"
                rel="noreferrer"
                className="app-action-download-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <span>Tải VssID ngay</span>
                <span className="btn-chevron">›</span>
              </a>
            </section>

            {/* PROGRESS & STEP WIZARD BAR */}
            <div className="step-wizard-bar">
              <div className="progress-status-text">
                TIẾN ĐỘ: <strong>{countCompleted}/3 BƯỚC HOÀNH THÀNH</strong>
              </div>

              <div className="wizard-step-pills">
                <button
                  type="button"
                  className={`step-pill-btn ${activeStepTab === 1 ? 'active' : ''} ${completedSteps[`${currentApp.id}_1`] ? 'done' : ''}`}
                  onClick={() => { setActiveStepTab(1); stopStepAudio(); }}
                >
                  Bước 1
                </button>
                <button
                  type="button"
                  className={`step-pill-btn ${activeStepTab === 2 ? 'active' : ''} ${completedSteps[`${currentApp.id}_2`] ? 'done' : ''}`}
                  onClick={() => { setActiveStepTab(2); stopStepAudio(); }}
                >
                  Bước 2
                </button>
                <button
                  type="button"
                  className={`step-pill-btn ${activeStepTab === 3 ? 'active' : ''} ${completedSteps[`${currentApp.id}_3`] ? 'done' : ''}`}
                  onClick={() => { setActiveStepTab(3); stopStepAudio(); }}
                >
                  Bước 3
                </button>
                <button
                  type="button"
                  className={`step-pill-btn view-all-btn ${activeStepTab === 0 ? 'active' : ''}`}
                  onClick={() => { setActiveStepTab(0); stopStepAudio(); }}
                >
                  ☰ Xem cả 3 bước
                </button>
              </div>
            </div>

            {/* KHUNG HIỂN THỊ CÁC BƯỚC THỰC HIỆN CHUYÊN NGHIỆP */}
            <div className="steps-container-box">
              {displayedSteps.map((step) => {
                const isStepDone = completedSteps[`${currentApp.id}_${step.num}`];
                const isPlayingThis = playingStepAudio === step.num;

                return (
                  <article className="step-split-card" key={step.num}>
                    
                    {/* BÊN TRÁI: THÔNG TIN BƯỚC + CHECKLIST */}
                    <div className="step-left-info">
                      <h3 className="step-split-title">{step.title}</h3>
                      <p className="step-split-desc">{step.desc}</p>

                      <button
                        type="button"
                        className={`step-audio-listen-btn ${isPlayingThis ? 'playing' : ''}`}
                        onClick={() => playStepAudio(step)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                        </svg>
                        <span>{isPlayingThis ? '⏹ Dừng nghe đọc' : 'Nghe hướng dẫn bước ' + step.num}</span>
                      </button>



                      {/* Nút Hoàn thành bước */}
                      <button
                        type="button"
                        className={`step-toggle-done-btn ${isStepDone ? 'done' : ''}`}
                        onClick={() => toggleStepDone(step.num)}
                      >
                        {isStepDone ? '✓ Đã hoàn thành xong Bước ' + step.num : '👉 Bấm vào đây nếu đã xong Bước ' + step.num}
                      </button>
                    </div>

                    {/* BÊN PHẢI: HÌNH ẢNH MINH HỌA THỰC TẾ CỰC NÉT */}
                    <div className="step-right-photo" onClick={() => setAnhPhongTo(step.img || currentApp.hinh)}>
                      <img
                        src={step.img || currentApp.hinh}
                        alt={step.title}
                        className="photo-real-img"
                        onError={(e) => {
                          if (e.target.src !== new URL(currentApp.hinh, window.location.origin).href) {
                            e.target.src = currentApp.hinh;
                          }
                        }}
                      />
                      <div className="photo-zoom-overlay">
                        <span>🔍 Phóng to hình ảnh</span>
                      </div>
                    </div>

                  </article>
                );
              })}
            </div>

            {/* 4 FEATURE CARDS GRID (TIỆN LỢI, NHANH CHÓNG, CHÍNH XÁC, MIỄN PHÍ) */}
            <div className="four-features-grid">
              
              <div className="feature-card-item">
                <div className="feature-icon-box green">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="5" y="2" width="14" height="20" rx="3" ry="3"/>
                    <line x1="12" y1="18" x2="12.01" y2="18"/>
                  </svg>
                </div>
                <div className="feature-card-texts">
                  <h4 className="feature-title">Tiện lợi</h4>
                  <p className="feature-desc">Tra cứu mọi lúc, mọi nơi chỉ với điện thoại hoặc máy tính.</p>
                </div>
              </div>

              <div className="feature-card-item">
                <div className="feature-icon-box blue">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <div className="feature-card-texts">
                  <h4 className="feature-title">Nhanh chóng</h4>
                  <p className="feature-desc">Kết quả tra cứu được hiển thị ngay lập tức, chính xác và đầy đủ.</p>
                </div>
              </div>

              <div className="feature-card-item">
                <div className="feature-icon-box purple">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div className="feature-card-texts">
                  <h4 className="feature-title">Chính xác</h4>
                  <p className="feature-desc">Dữ liệu được cập nhật liên tục từ hệ thống của BHXH Việt Nam.</p>
                </div>
              </div>

              <div className="feature-card-item">
                <div className="feature-icon-box amber">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                </div>
                <div className="feature-card-texts">
                  <h4 className="feature-title">Miễn phí</h4>
                  <p className="feature-desc">Sử dụng hoàn toàn miễn phí khi tải ứng dụng và tra cứu thông tin.</p>
                </div>
              </div>

            </div>

          </main>

          {/* CỘT PHẢI: TIỆN ÍCH NHANH & HỖ TRỢ */}
          <aside className="col-right-sidebar">
            
            {/* CARD TIỆN ÍCH NHANH */}
            <div className="right-widget-card">
              <h3 className="widget-card-title">TIỆN ÍCH NHANH</h3>
              
              <div className="quick-links-list">
                <a href="#tracuu-bhyt" className="quick-link-item" onClick={(e) => { e.preventDefault(); handleTabChange('app'); }}>
                  <div className="link-item-left">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span>Tra cứu thẻ BHYT</span>
                  </div>
                  <span className="link-chevron">›</span>
                </a>

                <a href="#tracuu-bhxh" className="quick-link-item" onClick={(e) => { e.preventDefault(); handleTabChange('web'); }}>
                  <div className="link-item-left">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>Tra cứu quá trình tham gia BHXH</span>
                  </div>
                  <span className="link-chevron">›</span>
                </a>

                <a href="/huong-dan" className="quick-link-item">
                  <div className="link-item-left">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <span>Hướng dẫn sử dụng</span>
                  </div>
                  <span className="link-chevron">›</span>
                </a>

                <a href="/tro-giup" className="quick-link-item">
                  <div className="link-item-left">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <span>Câu hỏi thường gặp</span>
                  </div>
                  <span className="link-chevron">›</span>
                </a>
              </div>
            </div>

            {/* CARD HỖ TRỢ */}
            <div className="right-widget-card">
              <h3 className="widget-card-title">HỖ TRỢ</h3>

              <div className="support-methods-list">
                
                <a href="tel:19009068" className="support-method-item">
                  <div className="support-icon-circle blue">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div className="support-method-texts">
                    <div className="support-phone-number">Tổng đài 1900 90 68</div>
                    <div className="support-time">8:00 - 17:30 (Thứ 2 - Thứ 6)</div>
                  </div>
                </a>

                <div className="support-method-item" style={{ cursor: 'pointer' }}>
                  <div className="support-icon-circle blue">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div className="support-method-texts">
                    <div className="support-main-label">Hỗ trợ trực tuyến</div>
                    <div className="support-sub-label">Trò chuyện với tư vấn viên</div>
                  </div>
                </div>

                <a href="/lien-he" className="support-method-item">
                  <div className="support-icon-circle blue">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div className="support-method-texts">
                    <div className="support-main-label">Gửi yêu cầu hỗ trợ</div>
                    <div className="support-sub-label">Chúng tôi sẽ phản hồi sớm nhất</div>
                  </div>
                </a>

              </div>
            </div>

            {/* BANNER AN TOÀN & BẢO MẬT */}
            <div className="security-banner-card">
              <div className="security-banner-content">
                <div className="security-icon-circle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="security-banner-texts">
                  <h4 className="security-title">An toàn & bảo mật</h4>
                  <p className="security-desc">Thông tin của bạn được mã hóa và bảo mật theo tiêu chuẩn của BHXH Việt Nam.</p>
                </div>
              </div>
              <div className="security-lock-icon">🔒</div>
            </div>

          </aside>

        </div>

        {/* Video Hướng dẫn */}
        <div className="clean-video-card">
          <div className="video-header">
            {tab === 'app' ? '🎬 Video hướng dẫn tra cứu qua App di động' : '🎬 Video hướng dẫn tra cứu qua Website'}
          </div>
          <video key={tab} className="video-player" controls playsInline preload="metadata">
            <source src={tab === 'app' ? '/video/huongdan-bhyt.mp4' : '/video/huongdan-bhytweb.mp4'} type="video/mp4" />
          </video>
        </div>

        <FAQChatBot type="bhyt" />
        
        {/* Footer tip */}
        <div className="clean-footer-tip">
          <span className="footer-icon">🏛️</span>
          <div>
            <strong>Vẫn chưa thực hiện được tra cứu?</strong>
            <p>Bà con đến trực tiếp <strong>Bộ phận Một cửa — UBND xã Đăk Pxi</strong> để được cán bộ hỗ trợ miễn phí!</p>
          </div>
        </div>
      
      </div>

      {/* Lightbox phóng to ảnh */}
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
              maxWidth: '94vw', maxHeight: '88vh',
              borderRadius: '12px',
              boxShadow: '0 10px 50px rgba(0,0,0,0.6)',
              objectFit: 'contain',
            }}
            onClick={e => e.stopPropagation()}
          />
          <div style={{ display: 'flex', gap: '14px', marginTop: '16px' }}>
            <a
              href={anhPhongTo}
              download
              onClick={e => e.stopPropagation()}
              style={{
                padding: '10px 24px', background: '#005bac', color: 'white',
                borderRadius: '8px', fontWeight: '800', fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              💾 Lưu ảnh về máy
            </a>
            <button
              onClick={() => setAnhPhongTo(null)}
              style={{
                padding: '10px 24px', background: '#dc2626', color: 'white',
                border: 'none', borderRadius: '8px', fontWeight: '800',
                fontSize: '14px', cursor: 'pointer',
              }}
            >
              ✕ Đóng lại
            </button>
          </div>
        </div>
      )}
      {/* Modal QR Code */}
      {showQrModal && (
        <div
          onClick={() => setShowQrModal(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', padding: '24px', borderRadius: '16px',
              textAlign: 'center', maxWidth: '300px', width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
          >
            <h3 style={{ margin: '0 0 12px', color: '#0f172a', fontSize: '17px', fontWeight: '800' }}>Mã QR: {currentApp.title}</h3>
            <img src={currentApp.qr} alt="QR Code" style={{ width: '200px', height: '200px', borderRadius: '8px', margin: '0 auto' }} />
            <div style={{ margin: '10px 0', fontSize: '12px', color: '#475569' }}>Dùng camera điện thoại quét mã để truy cập ngay.</div>
            <button
              onClick={() => setShowQrModal(false)}
              style={{ padding: '8px 20px', background: '#005bac', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}