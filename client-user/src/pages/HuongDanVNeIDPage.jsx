import { useState, useRef, useEffect } from 'react';
import './HuongDanVNeIDPage.css';
import FAQChatBot from '../components/Faqchatbot';

const TINH_NANG = [
  { icon: '🪪', label: 'Căn Cước công dân số', desc: 'Thay thế thẻ CCCD vật lý trong hầu hết các giao dịch' },
  { icon: '🏥', label: 'Thẻ bảo hiểm y tế số', desc: 'Tích hợp thẻ BHYT trực tuyến để đi khám chữa bệnh' },
  { icon: '🚗', label: 'Giấy phép lái xe số', desc: 'Xuất trình nhanh chóng thông tin GPLX khi cần thiết' },
  { icon: '🏛️', label: 'Cổng dịch vụ công', desc: 'Tự thực hiện các thủ tục hành chính trực tuyến tại nhà' },
  { icon: '💰', label: 'Quản lý trợ cấp xã hội', desc: 'Theo dõi chi tiết chế độ hỗ trợ của Nhà nước tiện lợi' },
  { icon: '🔐', label: 'Ký số định danh điện tử', desc: 'Ký kết văn bản, giấy tờ điện tử pháp lý nhanh chóng' },
];

const BUOC_DANG_KY = [
  {
    id: 1,
    icon: '📲',
    title: 'Tải và mở ứng dụng VNeID',
    desc: 'Bà con tìm ứng dụng tên là "VNeID" trên CH Play (đối với điện thoại Samsung, Oppo, Xiaomi) hoặc App Store (đối với điện thoại iPhone) rồi cài đặt.',
    color: '#3b82f6',
  },
  {
    id: 2,
    icon: '📝',
    title: 'Đăng ký tài khoản ban đầu',
    desc: 'Mở ứng dụng lên, nhập chính xác 12 số Căn cước công dân gắn chíp của mình, điền Số điện thoại cá nhân và đặt mật khẩu bảo mật.',
    color: '#06b6d4',
  },
  {
    id: 3,
    icon: '📸',
    title: 'Quét mã QR trên thẻ CCCD',
    desc: 'Hướng camera điện thoại vào mã QR ở góc trên bên phải thẻ CCCD để ứng dụng tự động nhận diện và điền nhanh thông tin.',
    color: '#10b981',
  },
  {
    id: 4,
    icon: '🤳',
    title: 'Xác thực sinh trắc khuôn mặt',
    desc: 'Đưa điện thoại lên ngang tầm mắt, quay mặt sang trái, sang phải, nhìn thẳng theo hướng dẫn tự động của ứng dụng.',
    color: '#f59e0b',
  },
  {
    id: 5,
    icon: '✅',
    title: 'Nhập mã kích hoạt OTP',
    desc: 'Hệ thống sẽ gửi mã số OTP gồm 6 chữ số qua tin nhắn SMS điện thoại. Bà con nhập mã này vào để kích hoạt tài khoản thành công.',
    color: '#10b981',
  },
];

const KICH_HOAT_MUC2 = [
  {
    id: 1,
    title: 'Cách 1: Trực tiếp tại UBND hoặc Công an xã',
    steps: [
      'Bà con mang theo thẻ CCCD gắn chíp gốc đến Bộ phận Một cửa xã Đăk Pxi hoặc đồn Công an xã.',
      'Cán bộ chuyên môn dùng thiết bị đọc chíp đặc chủng để thu thập thông tin sinh trắc học (vân tay, mống mắt).',
      'Hệ thống gửi dữ liệu lên Bộ Công an duyệt. Sau đó tài khoản sẽ tự động nâng cấp lên Mức độ 2.',
      'Nhận tin nhắn thông báo tài khoản Mức độ 2 đã kích hoạt thành công trên điện thoại.'
    ],
    color: '#2563eb',
    icon: '🏛️',
    tag: 'Nhanh & Dễ nhất',
  },
  {
    id: 2,
    title: 'Cách 2: Tự kích hoạt tại nhà bằng NFC',
    steps: [
      'Mở ứng dụng VNeID, đăng nhập vào tài khoản và chọn chức năng "Kích hoạt tài khoản Mức độ 2".',
      'Áp mặt sau của thẻ CCCD gắn chíp vào vùng cảm biến NFC phía sau điện thoại di động.',
      'Giữ nguyên vị trí thẻ trong 5-10 giây để điện thoại đọc thông tin chíp điện tử tự động.',
      'Xác thực khuôn mặt trước camera điện thoại một lần nữa để hoàn tất yêu cầu nâng cấp.'
    ],
    color: '#8b5cf6',
    icon: '📱',
    tag: 'Tự thực hiện',
  },
];

export default function HuongDanVNeIDPage() {
  const [tab, setTab] = useState('dang-ky');
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);

  const readText = `
    Hướng dẫn đăng ký và kích hoạt tài khoản VNeID.
    VNeID là ứng dụng định danh điện tử quốc gia, giúp bà con tích hợp Căn cước công dân, thẻ Bảo hiểm y tế, và Giấy phép lái xe trực tuyến để làm thủ tục hành chính ngay tại nhà mà không cần mang giấy tờ giấy.
    Để đăng ký tài khoản ban đầu: Bà con tải app VNeID, nhập 12 số căn cước, quét mã QR trên thẻ và xác thực khuôn mặt.
    Để nâng cấp tài khoản lên mức độ hai: Bà con có thể mang căn cước công dân đến Ủy ban nhân dân xã Đăk Pxi hoặc đồn Công an xã để cán bộ hỗ trợ thu nhận vân tay trực tiếp. Hoặc có thể tự kích hoạt tại nhà qua chíp NFC trên điện thoại.
  `;

  useEffect(() => {
    // Tự động phát giọng đọc bằng FPT AI TTS
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
    }, 1200);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setSpeaking(false);
    };
  }, []);

  const toggleSpeech = async () => {
    if (speaking) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setSpeaking(false);
      return;
    }
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
  };

  return (
    <div className="vneid-page">
      <div className="vneid-inner">

        {/* ─── 1. Header ─── */}
        <header className="vneid-header">
          <div className="vneid-brand-row">
            <img
              src="https://image3.luatvietnam.vn/uploaded/images/original/2025/04/16/yeu-cau-100-ho-kinh-doanh-dang-ky-thanh-lap-tren-vneid_1604095754.png"
              alt="VNeID Logo"
              className="vneid-logo-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="vneid-brand-badge">🪪 ĐỊNH DANH ĐIỆN TỬ QUỐC GIA</div>
          </div>
          <h1>Hướng Dẫn Đăng Ký VNeID</h1>
          <p className="vneid-subtitle">Bà con dùng VNeID thay thế thẻ CCCD vật lý, tích hợp BHYT và làm dịch vụ công trực tuyến nhanh chóng ngay tại nhà!</p>
          
          <button className={`vneid-speech-btn ${speaking ? 'active' : ''}`} onClick={toggleSpeech}>
            {speaking ? '⏸️ Dừng đọc hướng dẫn' : '🔊 Nghe hướng dẫn bằng giọng nói'}
          </button>
        </header>

        {/* ─── 2. Hỗ trợ khẩn cấp ─── */}
        <div className="vneid-emergency-banner">
          <span className="emergency-icon">🚨</span>
          <div>
            <strong>Cần Công An xã hỗ trợ đăng ký VNeID?</strong>
            <p>Đến trực tiếp <strong>UBND xã Đăk Pxi</strong> (Công an xã) hoặc gọi Tổng đài hỗ trợ: <a href="tel:1800599996">1800 599 996</a> (miễn phí cước)</p>
          </div>
        </div>

        {/* ─── 3. Chuẩn bị giấy tờ trước khi làm ─── */}
        <div className="vneid-checklist-card">
          <h3 className="checklist-title">📋 Chuẩn bị trước khi thực hiện:</h3>
          <div className="checklist-grid">
            <div className="checklist-item">
              <span className="chk-icon">🪪</span>
              <span><strong>Thẻ CCCD gắn chíp</strong> gốc còn hiệu lực</span>
            </div>
            <div className="checklist-item">
              <span className="chk-icon">📱</span>
              <span><strong>Điện thoại thông minh</strong> (kết nối Wifi/4G)</span>
            </div>
            <div className="checklist-item">
              <span className="chk-icon">📶</span>
              <span><strong>Số điện thoại chính chủ</strong> nhận mã OTP</span>
            </div>
          </div>
        </div>

        {/* ─── 4. Lợi ích của VNeID ─── */}
        <section className="vneid-benefits">
          <h2 className="vneid-title">🌟 VNeID giúp ích gì cho bà con?</h2>
          <div className="vneid-benefits-grid">
            {TINH_NANG.map((tn, i) => (
              <div className="vneid-benefit-card" key={i}>
                <span className="benefit-icon">{tn.icon}</span>
                <div className="benefit-text">
                  <h4>{tn.label}</h4>
                  <p>{tn.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 5. Tabs điều hướng quy trình ─── */}
        <div className="vneid-tabs">
          <button
            className={`vneid-tab-trigger ${tab === 'dang-ky' ? 'active' : ''}`}
            onClick={() => setTab('dang-ky')}
          >
            📝 Cách Đăng Ký Tài Khoản (Mức 1)
          </button>
          <button
            className={`vneid-tab-trigger ${tab === 'kich-hoat' ? 'active' : ''}`}
            onClick={() => setTab('kich-hoat')}
          >
            🔐 Cách Kích Hoạt Lên Mức 2
          </button>
        </div>

        {/* ─── 6. Nội dung chi tiết các bước ─── */}
        <div className="vneid-tab-panel">
          {tab === 'dang-ky' ? (
            <div className="vneid-step-container">
              <p className="vneid-panel-intro">Bà con thực hiện tuần tự theo 5 bước dưới đây để tự tạo tài khoản mức 1 trên điện thoại:</p>
              
              <div className="vneid-step-flow">
                {BUOC_DANG_KY.map((buoc) => (
                  <div className="vneid-step-card-item" key={buoc.id}>
                    <div className="step-badge" style={{ background: buoc.color }}>
                      Bước {buoc.id}
                    </div>
                    <div className="step-card-header">
                      <span className="step-card-icon">{buoc.icon}</span>
                      <h4>{buoc.title}</h4>
                    </div>
                    <p className="step-card-desc">{buoc.desc}</p>
                  </div>
                ))}
              </div>

              {/* Nút tải ứng dụng */}
              <div className="vneid-downloads">
                <h4>📲 Nhấp vào nút dưới đây để tải VNeID về máy:</h4>
                <div className="downloads-row">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.vnpt.vneid"
                    target="_blank"
                    rel="noreferrer"
                    className="dl-btn dl-android"
                  >
                    <span>🤖 Tải cho điện thoại Android</span>
                    <small>(Samsung, Oppo, Xiaomi, Realme...)</small>
                  </a>
                  <a
                    href="https://apps.apple.com/vn/app/vneid/id1598814353"
                    target="_blank"
                    rel="noreferrer"
                    className="dl-btn dl-ios"
                  >
                    <span>🍎 Tải cho điện thoại iPhone</span>
                    <small>(Các dòng máy Apple iOS)</small>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="vneid-step-container">
              <p className="vneid-panel-intro">Tài khoản Mức độ 2 tích hợp các thông tin cốt lõi nhất. Chọn một trong hai cách dưới đây để thực hiện:</p>
              
              <div className="vneid-activation-grid">
                {KICH_HOAT_MUC2.map((kh) => (
                  <div className="activation-card" key={kh.id} style={{ borderTop: `5px solid ${kh.color}` }}>
                    <div className="activation-card-head">
                      <span className="act-icon">{kh.icon}</span>
                      <div>
                        <h3>{kh.title}</h3>
                        <span className="act-badge" style={{ background: kh.color }}>{kh.tag}</span>
                      </div>
                    </div>
                    <div className="activation-card-body">
                      {kh.steps.map((step, idx) => (
                        <div className="act-step-item" key={idx}>
                          <span className="act-step-idx" style={{ background: kh.color }}>{idx + 1}</span>
                          <p>{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="vneid-warning-box">
                <span className="warning-box-icon">📡</span>
                <p><strong>Lưu ý về NFC tự kích hoạt:</strong> Điện thoại của bà con phải hỗ trợ tính năng truyền dữ liệu gần NFC thì mới tự quét được chíp CCCD tại nhà. Nếu điện thoại không hỗ trợ, cách đơn giản nhất là mang thẻ CCCD lên <strong>Ủy ban nhân dân xã</strong> để Công an hỗ trợ trực tiếp.</p>
              </div>
            </div>
          )}
        </div>

        {/* ─── 7. Video hướng dẫn trực quan ─── */}
        <section className="vneid-video-section">
          <h2>🎬 Video hướng dẫn chi tiết</h2>
          <div className="video-card">
            <video
              key={tab}
              className="vneid-video-player"
              controls
              playsInline
              preload="metadata"
            >
              <source
                src={tab === 'dang-ky' ? '/video/huongdan-vneid-dangky.mp4' : '/video/huongdan-vneid-kichhoat.mp4'}
                type="video/mp4"
              />
              Trình duyệt của bạn không hỗ trợ định dạng video này.
            </video>
            <div className="video-caption">
              <strong>{tab === 'dang-ky' ? 'Hướng dẫn các bước tự đăng ký tài khoản VNeID' : 'Hướng dẫn thu nhận hồ sơ và kích hoạt tài khoản Mức độ 2'}</strong>
              <p>Bà con vừa xem vừa có thể dừng lại hoặc làm theo từng bước rất thuận tiện.</p>
            </div>
          </div>
        </section>

        {/* ─── 8. Bộ câu hỏi thường gặp FAQ Chatbot ─── */}
        <FAQChatBot type="vneid" />

        {/* ─── 9. Nút thoát quay lại Trang chủ ─── */}
        <div className="vneid-exit-row">
          <a href="/" className="vneid-exit-btn">
            🚪 THOÁT VÀ QUAY LẠI TRANG CHỦ
          </a>
        </div>

      </div>
    </div>
  );
}
