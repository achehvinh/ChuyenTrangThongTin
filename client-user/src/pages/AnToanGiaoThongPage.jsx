import { useState, useEffect, useRef } from 'react';
import './AnToanGiaoThongPage.css';

// ── BỘ ICON VECTOR CHUẨN ĐỒNG BỘ ──
const SvgIcons = {
  ShieldCheck: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Traffic: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="10" height="20" x="7" y="2" rx="3" />
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
  ),
  VolumeUp: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  ),
  SquareStop: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  ),
  Megaphone: () => (
    <svg width="68" height="58" viewBox="0 0 68 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handle */}
      <path d="M22 36L25.5 48.5C25.8 49.5 27 50 28 49.7L30 49C31 48.7 31.5 47.5 31.2 46.5L28.5 36" stroke="#1D4ED8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="#1D4ED8" fillOpacity="0.12" />
      {/* Cone */}
      <path d="M14 22L37 12V36L14 26V22Z" stroke="#1D4ED8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="#1D4ED8" fillOpacity="0.08" />
      {/* Front Rim */}
      <ellipse cx="37" cy="24" rx="4" ry="12" stroke="#1D4ED8" strokeWidth="3.5" fill="#1D4ED8" fillOpacity="0.18" />
      {/* Back Base */}
      <rect x="7" y="19.5" width="7" height="9" rx="2" stroke="#1D4ED8" strokeWidth="3.5" fill="#1D4ED8" fillOpacity="0.18" />
      {/* Back Cap */}
      <path d="M7 21.5C5.2 21.5 4 22.8 4 24C4 25.2 5.2 26.5 7 26.5" stroke="#1D4ED8" strokeWidth="3.5" strokeLinecap="round" />
      {/* Radiating Sound Waves (4 lines) */}
      <path d="M46 11L50 7" stroke="#1D4ED8" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M48 18L54 15.5" stroke="#1D4ED8" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M49 25.5L56 25.5" stroke="#1D4ED8" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M48 33L54 35.5" stroke="#1D4ED8" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  ),
  PhoneAlert: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  BookOpen: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Users: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  UsersRound: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 21a8 8 0 0 0-12 0" />
      <circle cx="12" cy="10" r="5" />
    </svg>
  ),
  MessageSquare: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Helmet: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4a8 8 0 0 0-8 8v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3a8 8 0 0 0-8-8z" />
      <path d="M4 14h16" />
      <path d="M12 14v5" />
    </svg>
  ),
  NoBeer: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="2.5" />
      <path d="M17 11V6a2 2 0 0 0-2-2H9" />
      <path d="M5 6v9a5 5 0 0 0 5 5h4a5 5 0 0 0 4.9-4.1" />
    </svg>
  ),
  BikeWay: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
      <path d="m12 17.5 3.5-7 3 2.5" />
      <path d="M5.5 17.5 9 10.5h4" />
    </svg>
  ),
  NoPhone: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="2.5" />
      <rect x="7" y="4" width="10" height="16" rx="2" />
    </svg>
  ),
  Eye: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  WalkPedestrian: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="4.5" r="2.5" fill="currentColor" />
      <path d="M11 21v-4l-3-3 1.6-4.2a2 2 0 0 1 1.7-1.3l3.7-.5a2 2 0 0 1 1.7.9l2.8 4.2" />
      <path d="m7 12 3-1.5" />
    </svg>
  ),
  ChildNoDrive: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="3" />
      <path d="M6 21v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3" />
      <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  Globe: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Facebook: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.89h-2.34v6.99C18.34 21.12 22 16.99 22 12z" />
    </svg>
  ),
  ExternalLink: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  ArrowDown: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  ),
  CarBelt: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1h12" />
      <circle cx="7.5" cy="17.5" r="2.5" fill="currentColor" />
      <circle cx="16.5" cy="17.5" r="2.5" fill="currentColor" />
    </svg>
  ),
  VestReflective: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l2 5v13H4V8l2-5z" />
      <path d="m6 3 6 7 6-7" />
      <path d="M4 13h16" />
      <path d="M4 17h16" />
    </svg>
  ),
  WheelCheck: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="3" x2="12" y2="9" />
      <line x1="12" y1="15" x2="12" y2="21" />
      <line x1="3" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="21" y2="12" />
    </svg>
  ),
  Quote: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
  )
};

const DATA = {
  title: 'TUYÊN TRUYỀN AN TOÀN GIAO THÔNG',
  subtitle: 'Chung tay xây dựng văn hóa giao thông an toàn, văn minh trên địa bàn xã Đăk Pxi',
  content:
    'Xã Đăk Pxi có địa hình đường rừng, nhiều đèo dốc quanh co, sương mù và đường trơn trượt vào mùa mưa. Để bảo vệ tính mạng, tài sản của bản thân, gia đình và cộng đồng, mỗi người dân hãy nâng cao ý thức và tuân thủ pháp luật giao thông.',

  visualSteps: [
    {
      stt: '01',
      title: 'TUYÊN TRUYỀN, GIÁO DỤC VÀ NÂNG CAO Ý THỨC',
      tag: 'Tuyên truyền lưu động',
      img: '/huong-dan/atgt-1.png',
      badgeText: 'AN TOÀN GIAO THÔNG LÀ HẠNH PHÚC CỦA MỌI NHÀ',
      color: '#0B5ED7',
      highlights: [
        { icon: <SvgIcons.BookOpen />, text: 'Tuyên truyền pháp luật, phổ biến kiến thức về an toàn giao thông đến từng thôn, làng, từng hộ dân.' },
        { icon: <SvgIcons.Users />, text: 'Nâng cao ý thức tự giác chấp hành pháp luật, xây dựng văn hóa giao thông văn minh.' },
        { icon: <SvgIcons.ShieldCheck />, text: 'Mỗi người là một tuyên truyền viên, gương mẫu trong việc chấp hành luật giao thông.' }
      ]
    },
    {
      stt: '02',
      title: 'SINH HOẠT CỘNG ĐỒNG VÀ TUYÊN TRUYỀN TẠI NHÀ RÔNG',
      tag: 'Sinh hoạt cộng đồng',
      img: '/huong-dan/atgt-2.png',
      badgeText: 'AN TOÀN GIAO THÔNG - TRÁCH NHIỆM CỦA MỘI NGƯỜI',
      color: '#198754',
      highlights: [
        { icon: <SvgIcons.UsersRound />, text: 'Tổ chức sinh hoạt định kỳ tại nhà rông, chi hội đoàn thể, trường học để chia sẻ kiến thức, kinh nghiệm tham gia giao thông.' },
        { icon: <SvgIcons.Megaphone />, text: 'Lồng ghép giáo dục pháp luật cho thanh thiếu niên, học sinh và người dân.' },
        { icon: <SvgIcons.MessageSquare />, text: 'Thảo luận, giải đáp thắc mắc, nêu gương người tốt — việc tốt trong chấp hành giao thông.' }
      ]
    },
    {
      stt: '03',
      title: 'HƯỚNG DẪN THỰC QUY AN TOÀN VÀ KIẾN THỨC GIAO THÔNG BỔ ÍCH',
      tag: 'Phổ biến thực hành',
      img: '/huong-dan/atgt-3.png',
      badgeText: 'ĐÃ UỐNG RƯỢU BIA - KHÔNG LÁI XE',
      color: '#FD7E14',
      highlights: [
        { icon: <SvgIcons.Helmet />, text: 'Đội mũ bảo hiểm đúng quy cách; không chở quá số người quy định.' },
        { icon: <SvgIcons.NoBeer />, text: 'Tuyệt đối không uống rượu, bia khi điều khiển phương tiện giao thông.' },
        { icon: <SvgIcons.BikeWay />, text: 'Đi đúng phần đường, làn đường, bật xi nhan khi rẽ, giảm tốc độ khi qua đoạn nguy hiểm.' },
        { icon: <SvgIcons.NoPhone />, text: 'Tuyệt đối không sử dụng điện thoại di động khi đang lái xe.' }
      ]
    }
  ],

  rules: [
    {
      icon: <SvgIcons.NoBeer />,
      text: 'Tuyệt đối không điều khiển phương tiện sau khi đã sử dụng rượu, bia hoặc chất kích thích.',
      color: '#DC3545'
    },
    {
      icon: <SvgIcons.BikeWay />,
      text: 'Không phóng nhanh, vượt ẩu, lạng lách, đánh võng trên đường liên thôn, đèo dốc.',
      color: '#0B5ED7'
    },
    {
      icon: <SvgIcons.Eye />,
      text: 'Quan sát kỹ, giảm tốc độ ở nơi đông người, đường cong hẹp, dốc cao và ngầm tràn.',
      color: '#198754'
    },
    {
      icon: <SvgIcons.WalkPedestrian />,
      text: 'Nhường đường cho người đi bộ, người khuyết tật, xe ưu tiên theo quy định.',
      color: '#0D6EFD'
    },
    {
      icon: <SvgIcons.ChildNoDrive />,
      text: 'Trẻ em dưới 16 tuổi không điều khiển xe mô tô, xe gắn máy khi tham gia giao thông.',
      color: '#FD7E14'
    }
  ],

  preparednessItems: [
    {
      icon: <SvgIcons.Helmet />,
      title: 'Mũ bảo hiểm đạt chuẩn',
      desc: 'Có tem CR chất lượng, kính chắn gió chống bụi và quai cài chắc chắn khi đi xe máy, xe điện.'
    },
    {
      icon: <SvgIcons.CarBelt />,
      title: 'Dây an toàn trên ô tô',
      desc: 'Thắt dây an toàn đúng cách giúp bảo vệ tối đa tính mạng khi xe phanh gấp hoặc gặp sự cố.'
    },
    {
      icon: <SvgIcons.VestReflective />,
      title: 'Áo phản quang đêm',
      desc: 'Sử dụng trang phục nhận diện phản quang khi di chuyển ban đêm hoặc trời sương mù đèo dốc.'
    },
    {
      icon: <SvgIcons.WheelCheck />,
      title: 'Kiểm tra phanh & lốp xe',
      desc: 'Hệ thống phanh ăn nhạy, lốp đủ áp suất, đèn chiếu sáng tốt trước khi khởi hành.'
    }
  ],

  emergencyPhones: [
    { label: 'Cảnh sát giao thông (CSGT)', number: '113', color: '#DC3545' },
    { label: 'Cấp cứu y tế khẩn cấp', number: '115', color: '#DC3545' },
    { label: 'Công an xã Đăk Pxi', number: '02602 356 115', color: '#0B5ED7' },
    { label: 'Phòng Y tế xã Đăk Pxi', number: '02602 246 789', color: '#0B5ED7' }
  ]
};

export default function AnToanGiaoThongPage() {
  const audioRef = useRef(null);
  const [activeImg, setActiveImg] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // Tự động phát âm thanh khi vừa truy cập trang 🚦 TUYÊN TRUYỀN AN TOÀN GIAO THÔNG
  useEffect(() => {
    const timer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlayingAudio(true);
            setSpeaking(true);
          })
          .catch(() => {
            playTTS();
          });
      } else {
        playTTS();
      }
    }, 600);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function handleSpeak(customText) {
    if (isPlayingAudio || speaking) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      setSpeaking(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => {
          setIsPlayingAudio(true);
          setSpeaking(true);
        })
        .catch(() => {
          playTTS(customText);
        });
    } else {
      playTTS(customText);
    }
  }

  function playTTS(customText) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const textToRead = customText || (
      `Kính mời bà con xã Đăk Pxi lắng nghe thông báo tuyên truyền an toàn giao thông. ` +
      DATA.content +
      ` Các bước hướng dẫn an toàn giao thông theo từng bước. ` +
      DATA.visualSteps.map((s, idx) => `Bước ${idx + 1}: ${s.title}.`).join(' ')
    );

    const u = new SpeechSynthesisUtterance(textToRead);
    u.lang = 'vi-VN';
    u.rate = 0.92;
    u.onend = () => {
      setSpeaking(false);
      setIsPlayingAudio(false);
    };
    u.onerror = () => {
      setSpeaking(false);
      setIsPlayingAudio(false);
    };
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }

  return (
    <div className="atgt-page-poster">

      {/* Audio ngầm phát file giao-thong.mp3 */}
      <audio
        ref={audioRef}
        style={{ display: 'none' }}
        preload="auto"
        onPlay={() => {
          setIsPlayingAudio(true);
          setSpeaking(true);
        }}
        onPause={() => {
          setIsPlayingAudio(false);
          setSpeaking(false);
        }}
        onEnded={() => {
          setIsPlayingAudio(false);
          setSpeaking(false);
        }}
      >
        <source src="/video/giao-thong.mp3" type="audio/mpeg" />
        <source src="/audio/giao-thong.mp3" type="audio/mpeg" />
        <source src="/giao-thong.mp3" type="audio/mpeg" />
      </audio>

      {/* INFOGRAPHIC CONTAINER A4 PORTRAIT RATIO */}
      <div className="atgt-poster-container">

        {/* ════════════ 1. HEADER CHÍNH PHỦ ĐIỆN TỬ (SLANTED BANNER DẠNG ẢNH MẪU) ════════════ */}
        <header className="atgt-banner-header">

          {/* Cột trái chứa Hexagon Shield + Tiêu đề */}
          <div className="atgt-banner-left">
            <div className="atgt-shield-hexagon">
              <div className="atgt-shield-white">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <div className="atgt-banner-text">
              <h1 className="atgt-banner-title">
                <span className="title-top">TUYÊN TRUYỀN</span>
                <span className="title-bottom">AN TOÀN GIAO THÔNG</span>
              </h1>
              <p className="atgt-banner-sub">
                Chung tay xây dựng văn hóa giao thông an toàn, văn minh<br />
                <strong>trên địa bàn xã Đăk Pxi</strong>
              </p>
            </div>
          </div>

          {/* Đường chéo thủy tinh tạo điểm cắt */}
          <div className="atgt-banner-slanted-accent"></div>

          {/* Cột phải chứa hình ảnh nền + Thẻ nổi */}
          <div className="atgt-banner-right">
            <img src="/huong-dan/hinh-nen05.jpg" alt="Cổng UBND xã Đăk Pxi" className="atgt-banner-bg-img" />

            <div className="atgt-banner-pill-tag">
              <div className="pill-icon">
                <SvgIcons.Users />
              </div>
              <div className="pill-text">
                <strong>Nghĩ an toàn</strong>
                <span>Hành động văn minh</span>
              </div>
            </div>
          </div>

        </header>

        {/* ════════════ 2. KHỐI GIỚI THIỆU + CỘT PHẢI KHẨN CẤP ════════════ */}
        <div className="atgt-top-row">

          {/* KHỐI GIỚI THIỆU ngắn ~60 từ */}
          <div className="atgt-intro-box">
            <div className="atgt-intro-icon-bg">
              <SvgIcons.Megaphone />
            </div>
            <div className="atgt-intro-text">
              <p>{DATA.content}</p>
            </div>
          </div>

          {/* CỘT PHẢI - SỐ ĐIỆN THOẠI KHẨN CẤP */}
          <div className="atgt-emergency-card">
            <div className="atgt-emergency-head">
              <SvgIcons.PhoneAlert />
              <span>SỐ ĐIỆN THOẠI HỖ TRỢ KHẨN CẤP</span>
            </div>
            <div className="atgt-emergency-body">
              {DATA.emergencyPhones.map((p, i) => (
                <div key={i} className="atgt-em-item">
                  <span className="em-label">{p.label}</span>
                  <a href={`tel:${p.number.replace(/\s+/g, '')}`} className="em-num" style={{ color: p.color }}>
                    <SvgIcons.PhoneAlert />
                    <span>{p.number}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ════════════ 3. BỐ CỤC 2 CỘT CHÍNH (KHỐI LỚN HƯỚNG DẪN 3 BƯỚC + SIDEBAR) ════════════ */}
        <div className="atgt-main-grid">

          {/* CỘT TRÁI: HƯỚNG DẪN THEO TỪNG BƯỚC */}
          <div className="atgt-steps-column">

            {/* Thanh tiêu đề khối lớn */}
            <div className="atgt-section-header-bar">
              <span className="arr-left">»»</span>
              <h2>HƯỚNG DẪN AN TOÀN GIAO THÔNG THEO TỪNG BƯỚC</h2>
              <span className="arr-right">««</span>
            </div>

            <div className="atgt-steps-list">
              {DATA.visualSteps.map((step, i) => (
                <div key={i} className="atgt-step-wrapper">

                  {/* Step Card */}
                  <div className="atgt-step-card" style={{ borderColor: step.color }}>

                    {/* Header Bước */}
                    <div className="atgt-step-card-head">
                      <div className="atgt-step-badge" style={{ background: step.color }}>
                        <span>{step.stt}</span>
                      </div>
                      <h3 className="atgt-step-title">{step.title}</h3>
                    </div>

                    {/* Nội dung Bước 2 cột (Ảnh + 3/4 Nội dung có Icon) */}
                    <div className="atgt-step-card-body">

                      <div className="atgt-step-img-box" onClick={() => setActiveImg(step.img)}>
                        <img src={step.img} alt={step.title} className="atgt-step-img" />
                        <div className="atgt-step-img-banner">
                          <span>{step.badgeText}</span>
                        </div>
                      </div>

                      <div className="atgt-step-points-list">
                        {step.highlights.map((item, idx) => (
                          <div key={idx} className="atgt-point-item">
                            <span className="point-icon" style={{ color: step.color }}>
                              {item.icon}
                            </span>
                            <span className="point-text">{item.text}</span>
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>

                  {/* Mũi tên chỉ hướng giữa các bước */}
                  {i < DATA.visualSteps.length - 1 && (
                    <div className="atgt-step-connector">
                      <div className="connector-line"></div>
                      <div className="connector-arrow">
                        <SvgIcons.ArrowDown />
                      </div>
                      <div className="connector-line"></div>
                    </div>
                  )}

                </div>
              ))}
            </div>

            {/* KHỐI PHỤ: THIẾT BỊ AN TOÀN BẮT BUỘC KHl THAM GIA GIAO THÔNG */}
            <div className="atgt-prep-block">
              <div className="atgt-prep-block-title">
                <SvgIcons.ShieldCheck />
                <span>THIẾT BỊ AN TOÀN BẮT BUỘC KHl THAM GIA GIAO THÔNG</span>
              </div>
              <div className="atgt-prep-items-grid">
                {DATA.preparednessItems.map((item, i) => (
                  <div key={i} className="atgt-prep-box">
                    <div className="atgt-prep-box-icon">{item.icon}</div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* CỘT PHẢI SIDEBAR: QUY TẮC + PHÁP LUẬT + THÔNG ĐIỆP */}
          <aside className="atgt-sidebar-column">

            {/* CỘT PHẢI - QUY TẮC AN TOÀN GIAO THÔNG */}
            <div className="atgt-sidebar-box atgt-box-rules">
              <div className="atgt-sbox-head">
                <SvgIcons.Traffic />
                <span>QUY TẮC AN TOÀN GIAO THÔNG</span>
              </div>
              <div className="atgt-rules-list">
                {DATA.rules.map((rule, idx) => (
                  <div key={idx} className="atgt-rule-item">
                    <div className="rule-icon" style={{ color: rule.color, background: `${rule.color}15` }}>
                      {rule.icon}
                    </div>
                    <div className="rule-text">{rule.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CỘT PHẢI - CỔNG THÔNG TIN PHÁP LUẬT */}
            <div className="atgt-sidebar-box atgt-box-law">
              <div className="atgt-sbox-head">
                <SvgIcons.Globe />
                <span>CỔNG THÔNG TIN PHÁP LUẬT</span>
              </div>
              <p className="atgt-law-desc">Tra cứu văn bản pháp luật, thông tin tuyên truyền, tài liệu chính thức về ATGT:</p>

              <div className="atgt-law-buttons">
                <a
                  href="https://pbgdpl.moj.gov.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="atgt-law-btn blue"
                >
                  <SvgIcons.Globe />
                  <div className="btn-txt">
                    <strong>https://pbgdpl.moj.gov.vn</strong>
                    <span>Trang PBGDPL Quốc gia</span>
                  </div>
                  <SvgIcons.ExternalLink />
                </a>

                <a
                  href="https://phapluat.gov.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="atgt-law-btn navy"
                >
                  <SvgIcons.Facebook />
                  <div className="btn-txt">
                    <strong>Cổng Thông tin Pháp luật Quốc gia</strong>
                    <span>Kênh truyền thông chính thức</span>
                  </div>
                  <SvgIcons.ExternalLink />
                </a>

                <a
                  href="tel:1900636387"
                  className="atgt-law-btn yellow"
                >
                  <SvgIcons.PhoneAlert />
                  <div className="btn-txt">
                    <strong>Tổng đài pháp luật: 1900 63 63 87</strong>
                    <span>Tư vấn luật Giao thông 24/7</span>
                  </div>
                </a>
              </div>
            </div>

            {/* CỘT PHẢI - THÔNG ĐIỆP TUYÊN TRUYỀN */}
            <div className="atgt-sidebar-box atgt-box-slogan">
              <div className="atgt-slogan-icon">
                <SvgIcons.Quote />
              </div>
              <blockquote className="atgt-slogan-content">
                "An toàn giao thông là hạnh phúc của mọi nhà. Mỗi người dân Đăk Pxi hãy chấp hành nghiêm pháp luật giao thông."
              </blockquote>
              <div className="atgt-slogan-illustration">
                <img src="/huong-dan/atgt-1.png" alt="Gia đình tham gia giao thông an toàn" className="slogan-img" />
              </div>
            </div>

          </aside>

        </div>

        {/* ════════════ 4. FOOTER THỦ TƯỚNG / BỘ CÔNG AN BANNER ════════════ */}
        <footer className="atgt-poster-footer">
          <SvgIcons.ShieldCheck />
          <span>Chấp hành nghiêm luật giao thông là bảo vệ chính mình, gia đình và cộng đồng.</span>
        </footer>

      </div>

      {/* NÚT LOA PHÁT THANH CỐ ĐỊNH GÓC MÀN HÌNH (FLOATING AUDIO WIDGET - XUẤT HIỆN Ở BẤT KỲ ĐÂU KHI CUỘN) */}
      <div
        className={`atgt-floating-audio-widget ${speaking ? 'active-speaking' : ''}`}
        onClick={() => handleSpeak()}
        title={speaking ? 'Bấm để dừng phát thanh' : 'Bấm để nghe loa đọc tuyên truyền'}
      >
        <div className="widget-pulse-ring"></div>
        <div className="widget-icon-box">
          {speaking ? <SvgIcons.SquareStop /> : <SvgIcons.VolumeUp />}
        </div>
        <div className="widget-text-box">
          <span className="widget-label">{speaking ? 'ĐANG PHÁT THANH' : 'LOA PHÁT THANH'}</span>
          <span className="widget-sub">{speaking ? 'Bấm để tạm dừng' : 'Nghe loa phát thanh'}</span>
        </div>
        <div className="widget-equalizer-bars">
          <span className={`eq-bar ${speaking ? 'playing' : ''}`}></span>
          <span className={`eq-bar ${speaking ? 'playing' : ''}`}></span>
          <span className={`eq-bar ${speaking ? 'playing' : ''}`}></span>
          <span className={`eq-bar ${speaking ? 'playing' : ''}`}></span>
        </div>
      </div>

      {/* MODAL PHÓNG TO ẢNH */}
      {activeImg && (
        <div className="atgt-modal-overlay" onClick={() => setActiveImg(null)}>
          <div className="atgt-modal-content" onClick={e => e.stopPropagation()}>
            <button className="atgt-modal-close" onClick={() => setActiveImg(null)}>✕</button>
            <img src={activeImg} alt="Ảnh phóng to" className="atgt-modal-img" />
          </div>
        </div>
      )}

    </div>
  );
}
