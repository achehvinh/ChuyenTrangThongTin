import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Baucu.css';

// ── BỘ ICON SVG CHUẨN HTML5 ──
const SvgIcons = {
  Megaphone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  VoteUser: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M18 8l3-3" />
      <path d="M17 3l4 4" />
    </svg>
  ),
  VolumeUp: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  ),
  SquareStop: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  ),
  Globe: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Scale: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h18" />
    </svg>
  ),
  Eye: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Phone: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  Facebook: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Lightbulb: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  ShieldCheck: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Link: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  QrCode: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
};

export default function Baucu() {
  const navigate = useNavigate();
  const [speaking, setSpeaking] = useState(false);
  const [showInviteBanner, setShowInviteBanner] = useState(true);

  const [introAudio] = useState(() => new Audio('/video/dakpxi-baucu.mp3'));
  const [mainAudio] = useState(() => new Audio('/video/QUY TRINH BAU CU TRUONG THON-PXI.mp3'));
  const activeAudioRef = useRef(introAudio);

  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  function handleCopyLink() {
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy link:", err);
      });
  }

  const downloadQR = async () => {
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(currentUrl)}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'QR-Tuyen-Truyen-Bieu-Quyet-DakPxi.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download QR code:", err);
    }
  };

  function handleSpeak() {
    if (speaking) {
      activeAudioRef.current.pause();
      setSpeaking(false);
    } else {
      activeAudioRef.current.play()
        .then(() => {
          setSpeaking(true);
        })
        .catch((err) => {
          alert("Tính năng đọc giọng nói: Bà con vui lòng đặt tệp âm thanh 'dakpxi-baucu.mp3' và 'QUY TRINH BAU CU TRUONG THON-PXI.mp3' vào thư mục public/video/ để nghe giọng đọc nhé!");
          console.error("Audio play error:", err);
        });
    }
  }

  useEffect(() => {
    const handleIntroEnded = () => {
      activeAudioRef.current = mainAudio;
      mainAudio.play()
        .then(() => {
          setSpeaking(true);
        })
        .catch((err) => {
          console.error("Main audio play error:", err);
          setSpeaking(false);
        });
    };

    const handleMainEnded = () => {
      setSpeaking(false);
      activeAudioRef.current = introAudio;
      introAudio.currentTime = 0;
      mainAudio.currentTime = 0;
    };

    introAudio.addEventListener('ended', handleIntroEnded);
    mainAudio.addEventListener('ended', handleMainEnded);

    const autoPlayTimer = setTimeout(() => {
      introAudio.play()
        .then(() => {
          setSpeaking(true);
        })
        .catch((err) => {
          console.log("Trình duyệt chặn phát âm thanh tự động, cần tương tác trước.", err);
        });
    }, 600);

    return () => {
      clearTimeout(autoPlayTimer);
      introAudio.removeEventListener('ended', handleIntroEnded);
      mainAudio.removeEventListener('ended', handleMainEnded);
      introAudio.pause();
      mainAudio.pause();
    };
  }, [introAudio, mainAudio]);

  return (
    <div className="baucu-container">

      {/* Banner mời nghe tuyên truyền biểu quyết */}
      {showInviteBanner && (
        <div className={`baucu-invite-banner ${speaking ? 'playing' : ''}`}>
          <div className="banner-icon-pulse">
            <SvgIcons.Megaphone />
          </div>
          <div className="banner-text">
            <strong>Kính mời bà con lắng nghe hướng dẫn biểu quyết!</strong>
            <p>{speaking ? 'Hệ thống đang tự động phát thanh hướng dẫn...' : 'Bấm nút "Nghe hướng dẫn" bên dưới nếu loa chưa phát.'}</p>
          </div>
          {speaking && (
            <div className="sound-wave">
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
              <span className="wave-bar"></span>
            </div>
          )}
          <button className="banner-close-btn" onClick={() => setShowInviteBanner(false)}>✕</button>
        </div>
      )}

      {/* Nút quay lại */}
      <button className="baucu-back-btn" onClick={() => navigate('/chuyen-muc')}>
        <SvgIcons.ArrowLeft />
        <span>Quay lại Chuyên mục</span>
      </button>

      {/* Header Quốc kỳ & Huy hiệu */}
      <header className="baucu-header">
        <div className="baucu-header-logo">
          <SvgIcons.VoteUser />
        </div>
        <h1 className="baucu-main-title">
          HƯỚNG DẪN QUY TRÌNH BIỂU QUYẾT TẠI HỘI NGHỊ CỬ TRI
        </h1>
        <p className="baucu-subtitle">
          Các làng trên địa bàn xã Đăk Pxi - Nhiệm kỳ 2025 - 2030
        </p>
        <span className="baucu-gov-badge">ỦY BAN NHÂN DÂN XÃ ĐĂK PXI</span>

        {/* Nút nghe đọc giọng nói */}
        <button
          onClick={handleSpeak}
          className={`baucu-speak-btn ${speaking ? 'speaking' : ''}`}
        >
          {speaking ? <SvgIcons.SquareStop /> : <SvgIcons.VolumeUp />}
          <span>{speaking ? 'Dừng đọc hướng dẫn' : 'Nghe hướng dẫn bằng giọng nói'}</span>
        </button>
      </header>

      {/* Khung 4 nguyên tắc vàng */}
      <section className="baucu-principles">
        <h2 className="baucu-section-title">4 Nguyên Tắc Vàng Khi Biểu Quyết</h2>
        <div className="baucu-principles-grid">
          <div className="principle-card">
            <span className="principle-icon-svg"><SvgIcons.Globe /></span>
            <h3>Phổ thông</h3>
            <p>Mọi cử tri đại diện hộ gia đình đều có quyền tham gia biểu quyết.</p>
          </div>
          <div className="principle-card">
            <span className="principle-icon-svg"><SvgIcons.Scale /></span>
            <h3>Dân chủ</h3>
            <p>Mỗi cử tri đại diện hộ gia đình có một quyền biểu quyết ngang nhau.</p>
          </div>
          <div className="principle-card">
            <span className="principle-icon-svg"><SvgIcons.VoteUser /></span>
            <h3>Trực tiếp</h3>
            <p>Cử tri phải tự mình giơ tay biểu quyết trực tiếp tại hội nghị.</p>
          </div>
          <div className="principle-card">
            <span className="principle-icon-svg"><SvgIcons.Eye /></span>
            <h3>Công khai</h3>
            <p>Thực hiện biểu quyết công khai dưới sự chứng kiến của toàn thể hội nghị.</p>
          </div>
        </div>
      </section>

      {/* Các hình thức bỏ phiếu */}
      <section className="baucu-methods">
        <h2 className="baucu-section-title">Hình Thức Biểu Quyết Hợp Lệ</h2>
        <div className="baucu-methods-grid" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="method-card method-card--featured" style={{ maxWidth: '960px', width: '100%' }}>
            <div className="method-image-box">
              <img src="/huong-dan/hinh-thuc-2.png" alt="Biểu Quyết Giơ Tay" className="method-img" />
              <span className="method-badge success">HỘI NGHỊ THÔN</span>
            </div>
            <div className="method-content-wrap">
              <h3>Biểu Quyết Giơ Tay</h3>
              <p>
                Áp dụng trực tiếp tại <strong>Hội nghị cử tri của thôn</strong>. Cử tri thực hiện quyền biểu quyết đồng ý hoặc không đồng ý công khai bằng cách <strong>giơ tay biểu quyết trực tiếp</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hộp liên kết Facebook Tuyên truyền */}
      <section className="baucu-fb-link-section">
        <div className="fb-link-card">
          <div className="fb-link-icon-svg"><SvgIcons.Phone /></div>
          <div className="fb-link-content">
            <h3>Xem & Chia Sẻ Tuyên Truyền Biểu Quyết Trên Facebook Xã Đăk Pxi</h3>
            <p>
              Thông tin chính thức về hội nghị biểu quyết, nội dung chương trình và quy trình biểu quyết bằng hình thức giơ tay đã được đăng tải trên Trang cộng đồng của xã. Kính mời bà con truy cập Facebook để theo dõi, tương tác và chia sẻ thông tin đến mọi người dân trong thôn!
            </p>
            <a
              href="https://www.facebook.com/share/p/1DwY7F2kzy/"
              target="_blank"
              rel="noopener noreferrer"
              className="fb-link-btn"
            >
              <SvgIcons.Facebook />
              <span>Xem bài viết trên Facebook UBND xã Đăk Pxi</span>
            </a>
          </div>
        </div>
      </section>

      {/* Quy trình 4 bước với 4 hình ảnh minh họa */}
      <section className="baucu-steps">
        <h2 className="baucu-section-title">Quy Trình 4 Bước Biểu Quyết Đúng Quy Định</h2>

        <div className="baucu-steps-list">
          {/* Bước 1 */}
          <div className="baucu-step-row step-row-1">
            <div className="baucu-step-info">
              <span className="step-badge">BƯỚC 1</span>
              <h3>Ổn định tổ chức &amp; Kiểm tra tư cách cử tri</h3>
              <p>
                Bà con đến địa điểm tổ chức hội nghị tại nhà rông hoặc nhà văn hóa thôn mình đúng giờ để đăng ký tham dự, ổn định tổ chức và kiểm tra tư cách cử tri đại diện cho hộ gia đình tham gia biểu quyết.
              </p>
              <div className="step-alert">
                <SvgIcons.Lightbulb />
                <span>Lưu ý: Mang theo căn cước công dân hoặc giấy mời của Ủy ban nhân dân xã/thôn để đối chiếu.</span>
              </div>
            </div>
            <div className="baucu-step-image">
              <img
                src="/huong-dan/baucu-1.jpg"
                alt="Niêm yết danh sách cử tri và phát thẻ"
                onError={(e) => { e.target.src = 'https://picsum.photos/600/400?random=1'; }}
              />
              <span className="image-caption">Hình 1: Ban tổ chức đối chiếu danh sách cử tri tham gia hội nghị</span>
            </div>
          </div>

          {/* Bước 2 */}
          <div className="baucu-step-row reverse step-row-2">
            <div className="baucu-step-info">
              <span className="step-badge">BƯỚC 2</span>
              <h3>Lắng nghe báo cáo &amp; Đề cử nhân sự</h3>
              <p>
                Bà con lắng nghe kỹ báo cáo kết quả công tác nhiệm kỳ vừa qua của trưởng thôn cũ, đồng thời xem xét danh sách nhân sự đề cử trưởng thôn mới do chi bộ hoặc ban công tác mặt trận thôn giới thiệu trước hội nghị.
              </p>
              <div className="step-alert">
                <SvgIcons.Lightbulb />
                <span>Lưu ý: Tập trung thảo luận dân chủ, thẳng thắn về năng lực và đạo đức của người được giới thiệu.</span>
              </div>
            </div>
            <div className="baucu-step-image">
              <img
                src="/huong-dan/baucu-2.png"
                alt="Tìm hiểu tiểu sử ứng cử viên"
                onError={(e) => { e.target.src = 'https://picsum.photos/600/400?random=2'; }}
              />
              <span className="image-caption">Hình 2: Cử tri thảo luận và đề xuất ý kiến về nhân sự trưởng thôn mới</span>
            </div>
          </div>

          {/* Bước 3 */}
          <div className="baucu-step-row step-row-3">
            <div className="baucu-step-info">
              <span className="step-badge">BƯỚC 3</span>
              <h3>Thảo luận công khai &amp; Thống nhất phương án</h3>
              <p>
                Toàn thể hội nghị tiến hành thảo luận công khai các nội dung đề cử. Bà con có thể tự ứng cử hoặc đề cử thêm nhân sự khác có đủ tài đức ngoài danh sách dự kiến để đưa ra thống nhất trước khi tiến hành biểu quyết.
              </p>
              <div className="step-alert">
                <SvgIcons.Lightbulb />
                <span>Lưu ý: Phát huy tinh thần dân chủ, đoàn kết để chọn ra người có tài có đức gánh vác việc chung.</span>
              </div>
            </div>
            <div className="baucu-step-image">
              <img
                src="/huong-dan/baucu-3.png"
                alt="Cử tri nhận phiếu bầu"
                onError={(e) => { e.target.src = 'https://picsum.photos/600/400?random=3'; }}
              />
              <span className="image-caption">Hình 3: Cử tri thảo luận thống nhất danh sách nhân sự trước khi biểu quyết</span>
            </div>
          </div>

          {/* Bước 4 */}
          <div className="baucu-step-row reverse step-row-4">
            <div className="baucu-step-info">
              <span className="step-badge">BƯỚC 4</span>
              <h3>Tiến hành biểu quyết bằng giơ tay</h3>
              <p>
                Khi chủ trì hội nghị lấy ý kiến biểu quyết, bà con thực hiện quyền biểu quyết bằng cách giơ tay (Đồng ý, Không đồng ý hoặc có ý kiến khác). Ban thư ký hội nghị sẽ tiến hành quan sát, kiểm đếm và ghi biên bản chính xác kết quả.
              </p>
              <div className="step-alert warning">
                <SvgIcons.AlertTriangle />
                <span>Cực kỳ quan trọng: Mỗi hộ gia đình chỉ được biểu quyết đại diện một lần, tuyệt đối không biểu quyết hộ cho hộ gia đình khác.</span>
              </div>
            </div>
            <div className="baucu-step-image">
              <img
                src="/huong-dan/baucu-4.jpg"
                alt="Bỏ phiếu vào hòm phiếu"
                onError={(e) => { e.target.src = 'https://picsum.photos/600/400?random=4'; }}
              />
              <span className="image-caption">Hình 4: Cử tri biểu quyết thống nhất nhân sự trưởng thôn bằng hình thức giơ tay</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cảnh báo và Hướng dẫn cụ thể */}
      <section className="baucu-notices">
        <h2 className="baucu-section-title">Những Điều Cần Ghi Nhớ</h2>
        <div className="notices-content">
          <div className="notice-box danger">
            <h4>
              <SvgIcons.AlertTriangle />
              <span>Các hành vi bị CẤM nghiêm ngặt:</span>
            </h4>
            <ul>
              <li>Tuyệt đối không giơ tay biểu quyết hộ, biểu quyết thay cho hộ gia đình khác dưới mọi hình thức.</li>
              <li>Không gây mất trật tự, tranh cãi hoặc cản trở tiến trình tổ chức hội nghị biểu quyết.</li>
              <li>Nghiêm cấm mọi hành vi gian lận hoặc can thiệp sai lệch vào quá trình kiểm đếm số lượng giơ tay của thư ký hội nghị.</li>
            </ul>
          </div>
          <div className="notice-box info">
            <h4>
              <SvgIcons.ShieldCheck />
              <span>Thời gian và Địa điểm:</span>
            </h4>
            <ul>
              <li><strong>Thời gian tổ chức hội nghị:</strong> Bắt đầu từ lúc 07 giờ 30 phút, ngày 19 tháng 7 năm 2026.</li>
              <li><strong>Địa điểm tổ chức:</strong> Tại Nhà rông hoặc Nhà văn hóa các thôn trên địa bàn xã Đăk Pxi.</li>
              <li>Kính mời toàn thể cử tri đại diện cho các hộ gia đình sắp xếp công việc tham dự đầy đủ, đúng giờ để bảo đảm quyền dân chủ của mình.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Chia sẻ & Tạo mã QR */}
      <section className="baucu-share-section">
        <h2 className="baucu-section-title">Chia Sẻ & Tuyên Truyền Biểu Quyết</h2>
        <div className="share-container-card">
          <div className="share-info-col">
            <h3>
              <SvgIcons.Megaphone />
              <span>Gửi hướng dẫn đến người thân &amp; hàng xóm</span>
            </h3>
            <p>
              Bà con hãy chung tay tuyên truyền quy trình biểu quyết bằng cách chia sẻ đường liên kết hướng dẫn này đến các nhóm Zalo, Facebook của gia đình, dòng họ hoặc làng mình để mọi người cùng nắm vững quy trình và chủ động tham gia biểu quyết đúng quy định pháp luật.
            </p>
            <div className="share-actions-buttons">
              <button
                className={`share-btn copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopyLink}
              >
                <SvgIcons.Link />
                <span>{copied ? 'Đã sao chép liên kết!' : 'Sao chép liên kết chia sẻ'}</span>
              </button>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn facebook-btn"
              >
                <SvgIcons.Users />
                <span>Chia sẻ lên Facebook</span>
              </a>
              <a
                href={`https://sp.zalo.me/share_to_zalo?url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn zalo-btn"
              >
                <SvgIcons.Phone />
                <span>Chia sẻ qua Zalo</span>
              </a>
            </div>
          </div>

          <div className="share-qr-col">
            <h3>
              <SvgIcons.QrCode />
              <span>Quét mã QR truy cập nhanh</span>
            </h3>
            <p className="qr-sub">Dùng camera điện thoại hoặc Zalo quét mã dưới đây để xem hướng dẫn trực tiếp:</p>
            <div className="qr-code-box">
              {currentUrl && (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`}
                  alt="Mã QR Biểu quyết"
                  className="qr-code-img"
                />
              )}
            </div>
            <button className="download-qr-btn" onClick={downloadQR}>
              <SvgIcons.Download />
              <span>Tải ảnh mã QR về điện thoại / máy tính</span>
            </button>
          </div>
        </div>
      </section>

      {/* Cổng thông tin kiểm chứng chính thức */}
      <section className="baucu-source-verification">
        <div className="verification-card">
          <div className="verification-header-info">
            <span className="verification-badge-icon"><SvgIcons.ShieldCheck /></span>
            <h3>Xác Thực Thông Tin Chính Thống</h3>
          </div>
          <p className="verification-desc">
            Đây là thông tin tuyên truyền hướng dẫn quy trình biểu quyết tại hội nghị cử tri chính thức, đúng sự thật của Ủy ban nhân dân xã Đăk Pxi. Bà con có thể nhấn vào liên kết chính thức dưới đây để kiểm chứng và xem chi tiết bài đăng gốc trên Trang thông tin điện tử xã Đăk Pxi, tỉnh Quảng Ngãi:
          </p>
          <a
            href="https://dakpxi.quangngai.gov.vn/gioi-thieu/tin-chi-dao-dieu-hanh/dak-pxi-san-sang-cho-cuoc-bau-cu-truong-thon-nhiem-ky-2025-20302.html"
            target="_blank"
            rel="noopener noreferrer"
            className="verification-link-btn"
          >
            <SvgIcons.Globe />
            <span>Xem bài viết gốc tại dakpxi.quangngai.gov.vn</span>
          </a>
        </div>
      </section>

      {/* Khẩu hiệu tuyên truyền chân trang */}
      <footer className="baucu-footer">
        <p className="slogan">"TÍCH CỰC THAM GIA HỘI NGHỊ CỬ TRI – PHÁT HUY DÂN CHỦ TRONG BIỂU QUYẾT TRƯỜNG THÔN!"</p>
      </footer>
    </div>
  );
}
