import { useState, useRef, useEffect } from 'react';
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
        audioSrc: '/huong-dan/vssid_step1.mp3',
        placeholderName: 'vssid_step1.jpg',
        audioFile: 'vssid_step1.mp3'
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
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      if (stepAudioRef.current) { stepAudioRef.current.pause(); stepAudioRef.current = null; }
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

    const audio = new Audio(step.audioSrc);
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

        {/* ── UNIFIED MINIMALIST HTML5 HEADER & PREP BAR ── */}
        <header className="clean-top-header">
          <div className="clean-header-main">
            <div className="clean-title-group">
              <h1 className="clean-title">
                Tra cứu thẻ BHYT & BHXH tại nhà — <span className="highlight">Không cần lên xã</span>
              </h1>
            </div>

            {/* PHƯƠNG THỨC TRA CỨU SEGMENT TABS */}
            <div className="clean-mode-tabs">
              <button
                className={`clean-mode-btn ${tab === 'app' ? 'active' : ''}`}
                onClick={() => handleTabChange('app')}
              >
                <span>📱 Cách 1: Qua App di động</span>
              </button>
              <button
                className={`clean-mode-btn ${tab === 'web' ? 'active' : ''}`}
                onClick={() => handleTabChange('web')}
              >
                <span>🌐 Cách 2: Qua Website</span>
              </button>
            </div>
          </div>

          {/* CHUẨN BỊ 4 BƯỚC INLINE COMPACT */}
          <div className="clean-prep-inline">
            <span className="prep-label">📋 Cần chuẩn bị:</span>
            <div className="prep-chips">
              <span className="chip-pill">🪪 Thẻ CCCD 12 số</span>
              <span className="chip-sep">→</span>
              <span className="chip-pill">📱 Điện thoại / Máy tính</span>
              <span className="chip-sep">→</span>
              <span className="chip-pill">📶 Kết nối Internet</span>
              <span className="chip-sep">→</span>
              <span className="chip-pill chip-done">✅ Tra cứu thành công</span>
            </div>
            {speaking && <span className="clean-tts-badge">🔊 Đang phát thanh...</span>}
          </div>
        </header>

        {/* ── GIAO DIỆN MASTER-DETAIL GỌN GÀNG ── */}
        <div className="clean-master-detail">
          
          {/* SIDEBAR DANH MỤC (BÊN TRÁI) */}
          <div className="clean-sidebar">
            <div className="sidebar-title">DANH MỤC {tab === 'app' ? 'ỨNG DỤNG' : 'TRANG WEB'}</div>

            <div className="sidebar-menu">
              {danhSach.map((app) => {
                const isActive = app.id === currentApp.id;
                return (
                  <button
                    key={app.id}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                    onClick={() => { setSelectedAppId(app.id); setActiveStepTab(1); stopStepAudio(); }}
                  >
                    <div className="app-icon-small" style={{ background: app.color }}>
                      {app.iconSvg}
                    </div>
                    <div className="app-meta">
                      <div className="app-name">{app.title}</div>
                      <div className="app-sub">{app.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* QR Code nhỏ gọn */}
            <div className="sidebar-qr-compact">
              <img src={currentApp.qr} alt="QR" className="qr-thumb" onError={e => { e.target.style.display = 'none'; }} />
              <button className="qr-btn" onClick={() => setShowQrModal(true)}>
                🔍 Phóng to QR
              </button>
            </div>
          </div>

          {/* CỘT CHI TIẾT MAIN (BÊN PHẢI) */}
          <div className="clean-main-content">
            
            {/* Banner Top App */}
            <div className="app-banner-strip" style={{ background: currentApp.color }}>
              <div className="app-banner-info">
                <div className="app-banner-icon">{currentApp.iconSvg}</div>
                <div>
                  <h2 className="app-banner-title">{currentApp.title}</h2>
                  <div className="app-banner-sub">{currentApp.subtitle}</div>
                </div>
              </div>

              <a
                href={currentApp.btn.url}
                target="_blank"
                rel="noreferrer"
                className="app-download-btn"
              >
                <span>{currentApp.btn.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>
            </div>

            {/* Progress & Wizard Bar */}
            <div className="clean-step-bar">
              <div className="progress-info">
                <span>TIẾN ĐỘ: <strong>{countCompleted}/3 BƯỚC HOÀN THÀNH</strong></span>
              </div>

              <div className="wizard-pills">
                <button
                  className={`wizard-btn ${activeStepTab === 1 ? 'active' : ''} ${completedSteps[`${currentApp.id}_1`] ? 'done' : ''}`}
                  onClick={() => { setActiveStepTab(1); stopStepAudio(); }}
                >
                  {completedSteps[`${currentApp.id}_1`] ? '✓' : '1'} Bước 1
                </button>
                <button
                  className={`wizard-btn ${activeStepTab === 2 ? 'active' : ''} ${completedSteps[`${currentApp.id}_2`] ? 'done' : ''}`}
                  onClick={() => { setActiveStepTab(2); stopStepAudio(); }}
                >
                  {completedSteps[`${currentApp.id}_2`] ? '✓' : '2'} Bước 2
                </button>
                <button
                  className={`wizard-btn ${activeStepTab === 3 ? 'active' : ''} ${completedSteps[`${currentApp.id}_3`] ? 'done' : ''}`}
                  onClick={() => { setActiveStepTab(3); stopStepAudio(); }}
                >
                  {completedSteps[`${currentApp.id}_3`] ? '✓' : '3'} Bước 3
                </button>
                <button
                  className={`wizard-btn ${activeStepTab === 0 ? 'active' : ''}`}
                  onClick={() => { setActiveStepTab(0); stopStepAudio(); }}
                >
                  🖼️ Xem cả 3 bước
                </button>
              </div>
            </div>

            {/* HIỂN THỊ CÁC BƯỚC HÌNH ẢNH SẮC NÉT CHỮ TO */}
            <div className={`steps-view ${activeStepTab === 0 ? 'grid-mode' : 'single-mode'}`}>
              {displayedSteps.map((step) => {
                const isStepDone = completedSteps[`${currentApp.id}_${step.num}`];
                const isPlayingThis = playingStepAudio === step.num;

                return (
                  <div className={`step-card-box ${isStepDone ? 'is-done' : ''}`} key={step.num}>
                    
                    {/* Header Bước */}
                    <div className="step-card-header">
                      <div className="step-tag-title">
                        <span className="step-badge" style={{ background: currentApp.color }}>
                          BƯỚC {step.num}
                        </span>
                        <h3 className="step-title-text">{step.title}</h3>
                      </div>

                      <button
                        type="button"
                        className={`step-audio-btn ${isPlayingThis ? 'playing' : ''}`}
                        onClick={() => playStepAudio(step)}
                      >
                        <span>{isPlayingThis ? '⏹ Dừng' : '🔊 Nghe đọc Bước ' + step.num}</span>
                      </button>
                    </div>

                    <p className="step-desc-text">{step.desc}</p>

                    {/* KHUNG HÌNH ẢNH CỰC LỚN DỄ NHÌN */}
                    <div className="step-img-container" onClick={() => setAnhPhongTo(step.img || currentApp.hinh)}>
                      <img
                        src={step.img}
                        alt={step.title}
                        className="step-img-real"
                        onError={(e) => {
                          if (e.target.src !== new URL(currentApp.hinh, window.location.origin).href) {
                            e.target.src = currentApp.hinh;
                          }
                        }}
                      />
                      <div className="step-img-overlay">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                        </svg>
                        <span>🔍 BẤM VÀO ĐÂY ĐỂ XEM HÌNH ẢNH TO PHÓNG LỚN</span>
                      </div>
                    </div>

                    {/* Nút Hoàn thành */}
                    <button
                      type="button"
                      className={`step-action-btn ${isStepDone ? 'done' : ''}`}
                      onClick={() => toggleStepDone(step.num)}
                    >
                      {isStepDone ? (
                        <span>✅ Đã hoàn thành xong Bước {step.num}</span>
                      ) : (
                        <span>👉 Bà con bấm vào đây nếu đã làm xong Bước {step.num} {activeStepTab > 0 && activeStepTab < 3 ? '→ Chuyển Bước ' + (step.num + 1) : ''}</span>
                      )}
                    </button>

                  </div>
                );
              })}
            </div>

            {/* Thông báo chúc mừng */}
            {countCompleted === 3 && (
              <div className="congrats-banner">
                <div style={{ fontSize: "28px" }}>🎉</div>
                <div>
                  <strong>CHÚC MỪNG BÀ CON ĐÃ HOÀN THÀNH TẤT CẢ 3 BƯỚC!</strong>
                  <p>Bà con đã có thể tự tra cứu thẻ BHYT và sử dụng khi đi khám chữa bệnh.</p>
                </div>
              </div>
            )}

          </div>

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
        
        {/* Footer */}
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