import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ChatWindow.css';
import { useLang } from '../../LanguageContext';

// ── BỘ NGỮ CẢNH TRANG THÔNG MINH — TRỢ LÝ AI PHÒNG VĂN HÓA - XÃ HỘI ──
const PAGE_CONTEXTS = {
  '/phong-chong-lua-dao': {
    title: '🛡️ Phòng chống Lừa đảo Mạng',
    welcome: 'Xin chào bà con! 👋 Tôi là Trợ lý AI của Phòng Văn hóa - Xã hội. Tôi sẵn sàng hỗ trợ giải đáp tại chuyên mục **Phòng chống Lừa đảo Không gian mạng**. Bà con hãy hỏi tôi về số điện thoại lừa đảo, thủ đoạn giả danh hay cách bảo mật tài khoản!',
    quickQuestions: [
      '🛡️ Cách nhận biết số điện thoại giả danh Công an lừa đảo?',
      '💸 Lỡ chuyển tiền cho kẻ lừa đảo thì làm sao lấy lại?',
      '🔐 Hướng dẫn cài bảo mật 2 lớp cho Zalo & Facebook?',
      '📞 Số điện thoại Công an xã báo lừa đảo 24/7?'
    ]
  },
  '/an-toan-giao-thong': {
    title: '🚦 Tuyên truyền An toàn Giao thông',
    welcome: 'Xin chào bà con! 👋 Tôi là Trợ lý AI của Phòng Văn hóa - Xã hội. Tôi đang hỗ trợ giải đáp tại chuyên mục **Tuyên truyền An toàn Giao thông**. Bà con cần hỏi về quy định phạt hay an toàn khi đi đường đèo dốc?',
    quickQuestions: [
      '🚦 Mức phạt không đội mũ bảo hiểm theo Nghị định 100?',
      '🛵 Giới hạn tốc độ trên đường đèo dốc xã Đăk Pxi?',
      '🚸 Quy định an toàn giao thông khu vực cổng trường học?',
      '🌧️ Hướng dẫn qua ngầm tràn an toàn mùa mưa lũ?'
    ]
  },
  '/thien-tai': {
    title: '🌧️ Phòng chống Thiên tai & Bão lũ',
    welcome: 'Xin chào bà con! 👋 Trợ lý AI Phòng Văn hóa - Xã hội đang hỗ trợ chuyên mục **Phòng chống Thiên tai**. Bà con cần trợ giúp kỹ năng ứng phó sạt lở đá hay các điểm tránh trú khẩn cấp?',
    quickQuestions: [
      '🌧️ Kỹ năng an toàn khi có nguy cơ lũ quét, sạt lở đá?',
      '🌊 Tuyệt đối không qua ngầm tràn khi nước chảy xiết?',
      '🚨 Hotline cứu hộ khẩn cấp khi thiên tai?',
      '🎒 Bộ vật dụng khẩn cấp cần chuẩn bị khi di dời?'
    ]
  },
  '/bau-cu': {
    title: '🗳️ Tuyên truyền Bầu cử',
    welcome: 'Xin chào bà con! 👋 Trợ lý AI Phòng Văn hóa - Xã hội đang hỗ trợ chuyên mục **Tuyên truyền Bầu cử**. Bà con cần tra cứu quyền cử tri hay địa điểm bỏ phiếu?',
    quickQuestions: [
      '🗳️ Ai đủ điều kiện bầu cử Đại biểu Quốc hội & HĐND?',
      '📍 Địa điểm tổ chức bỏ phiếu bầu cử tại địa phương?',
      '📜 Quy trình và cách gạch tên trên phiếu bầu cử?',
      '❓ Quên mang thẻ cử tri thì có được bầu cử không?'
    ]
  },
  '/huong-dan-vneid': {
    title: '🆔 Hướng dẫn VNeID Mức 2',
    welcome: 'Xin chào bà con! 👋 Trợ lý AI Phòng Văn hóa - Xã hội hỗ trợ chuyên mục **Hướng dẫn VNeID**. Bà con cần hỏi cách kích hoạt mức 2 hay tích hợp BHYT, bằng lái xe?',
    quickQuestions: [
      '🆔 Cách kích hoạt tài khoản VNeID Mức 2 tại nhà?',
      '💳 Hướng dẫn tích hợp Thẻ BHYT & GPLX vào VNeID?',
      '🔐 Quên mật khẩu VNeID lấy lại như thế nào?',
      '🏛️ Địa điểm hỗ trợ kích hoạt VNeID?'
    ]
  },
  '/te-nan': {
    title: '🛡️ Phòng chống Tệ nạn Xã hội',
    welcome: 'Xin chào bà con! 👋 Trợ lý AI Phòng Văn hóa - Xã hội đang hỗ trợ chuyên mục **Phòng chống Tệ nạn Xã hội**. Bà con cần thông tin phòng ngừa ma túy hay hotline tố giác tệ nạn?',
    quickQuestions: [
      '🛡️ Cách nhận biết và phòng ngừa ma túy cho con em?',
      '🚨 Tố giác điểm cờ bạc, ma túy theo SĐT nào?',
      '📜 Mức xử phạt hành vi đánh bạc trực tuyến qua mạng?'
    ]
  },
  '/chay-rung': {
    title: '🔥 Phòng chống Cháy rừng',
    welcome: 'Xin chào bà con! 👋 Tôi là Trợ lý AI của Phòng Văn hóa - Xã hội. Tôi đang hỗ trợ chuyên mục **Phòng chống Cháy rừng**. Bà con cần hỏi về quy định đốt rẫy an toàn hay báo cháy rừng khẩn cấp?',
    quickQuestions: [
      '🔥 Quy định kỹ thuật đốt rẫy an toàn mùa khô?',
      '🚨 Hotline báo cháy rừng khẩn cấp cho Kiểm lâm?'
    ]
  },
  '/duoi-nuoc': {
    title: '🏊 Phòng chống Đuối nước',
    welcome: 'Xin chào bà con! 👋 Trợ lý AI Phòng Văn hóa - Xã hội đang hỗ trợ chuyên mục **Phòng chống Đuối nước**. Bà con cần tra cứu kỹ năng sơ cứu hay an toàn sông hồ?',
    quickQuestions: [
      '🏊 Kỹ năng sơ cứu khẩn cấp người bị đuối nước đúng cách?',
      '🚸 Hướng dẫn an toàn sông hồ cho học sinh mùa hè?'
    ]
  },
  '/thu-tuc-hanh-chinh': {
    title: '📑 Thủ tục Hành chính & Dịch vụ công',
    welcome: 'Xin chào bà con! 👋 Trợ lý AI Phòng Văn hóa - Xã hội hỗ trợ tra cứu **Thủ tục Hành chính & Dịch vụ công**. Bà con cần nộp hồ sơ khai sinh, kết hôn hay đất đai?',
    quickQuestions: [
      '📑 Hồ sơ thủ tục Đăng ký khai sinh gồm những gì?',
      '💍 Thủ tục Đăng ký kết hôn tại Bộ phận Một cửa?',
      '💻 Cách nộp hồ sơ trực tuyến qua Cổng Dịch vụ công?'
    ]
  },
  '/tra-cuu': {
    title: '🏥 Tra cứu BHYT & BHXH',
    welcome: 'Xin chào bà con! 👋 Trợ lý AI Phòng Văn hóa - Xã hội hỗ trợ tra cứu **Bảo hiểm Y tế & Bảo hiểm Xã hội**. Bà con cần hướng dẫn tra cứu giá trị sử dụng thẻ BHYT?',
    quickQuestions: [
      '🏥 Tra cứu giá trị sử dụng thẻ BHYT bằng điện thoại?',
      '📋 Cách kiểm tra thời gian đóng BHXH tự nguyện?'
    ]
  }
};

const DEFAULT_CONTEXT = {
  title: '📋 Trợ lý AI Phòng Văn hóa - Xã hội',
  welcome: 'Xin chào bà con! 👋 Tôi là Trợ lý AI của Phòng Văn hóa - Xã hội. Bà con cần tra cứu thông tin tuyên truyền, thủ tục hành chính, BHYT hay VNeID?',
  quickQuestions: [
    '🏥 Tra cứu thẻ BHYT bằng điện thoại như thế nào?',
    '📑 Làm thủ tục đăng ký khai sinh cần giấy tờ gì?',
    '🆔 Đăng ký VNeID Mức 2 ở đâu?',
    '📅 Lịch tiếp công dân và tư vấn BHYT?'
  ]
};

// ── Map từ khóa → trang ──
const SUGGESTIONS_MAP = [
  {
    keywords: ['bhyt', 'bảo hiểm y tế', 'thẻ bhyt', 'tra cứu thẻ', 'thẻ bảo hiểm'],
    label: '🏥 Tra cứu BHYT',
    path: '/tra-cuu',
    desc: 'Hướng dẫn tra cứu thẻ BHYT tại nhà',
  },
  {
    keywords: ['bhxh', 'bảo hiểm xã hội', 'hưu trí', 'thai sản', 'ốm đau', 'thất nghiệp'],
    label: '📋 Tra cứu BHXH',
    path: '/huong-dan-bhxh',
    desc: 'Hướng dẫn tra cứu quá trình đóng BHXH',
  },
  {
    keywords: ['vneid', 'vne id', 'định danh', 'căn cước', 'cccd', 'kích hoạt vneid', 'đăng ký vneid'],
    label: '🪪 Hướng dẫn VNeID',
    path: '/huong-dan-vneid',
    desc: 'Đăng ký và kích hoạt tài khoản VNeID',
  },
  {
    keywords: ['lừa đảo', 'giả danh', 'chuyển tiền', 'an ninh mạng', 'mã otp', 'tài khoản bị hack'],
    label: '🛡️ Phòng chống Lừa đảo Mạng',
    path: '/phong-chong-lua-dao',
    desc: 'Cảnh báo thủ đoạn lừa đảo qua mạng',
  },
  {
    keywords: ['giao thông', 'xe máy', 'mũ bảo hiểm', 'uống rượu bia', 'đèo dốc', 'nghị định 100'],
    label: '🚦 An toàn Giao thông',
    path: '/an-toan-giao-thong',
    desc: 'Quy định an toàn giao thông đường bộ',
  },
  {
    keywords: ['thủ tục', 'hành chính', 'khai sinh', 'khai tử', 'kết hôn', 'sổ đỏ', 'hộ nghèo', 'giấy tờ', 'chứng thực'],
    label: '📑 Thủ tục hành chính',
    path: '/Thu-tuc-hanh-chinh',
    desc: 'Tra cứu giấy tờ cần chuẩn bị',
  },
  {
    keywords: ['thông báo', 'tin tức', 'thông tin mới'],
    label: '📢 Thông báo',
    path: '/thong-bao',
    desc: 'Xem thông báo mới nhất',
  },
  {
    keywords: ['lịch họp', 'họp thôn', 'họp dân', 'lịch'],
    label: '📅 Lịch họp',
    path: '/lich-hop',
    desc: 'Xem lịch họp thôn bản',
  },
  {
    keywords: ['đuối nước', 'phòng chống đuối', 'an toàn nước'],
    label: '🌊 Phòng chống đuối nước',
    path: '/duoi-nuoc',
    desc: 'Kỹ năng phòng tránh đuối nước',
  },
  {
    keywords: ['cháy rừng', 'phòng cháy', 'chữa cháy rừng'],
    label: '🔥 Phòng chống cháy rừng',
    path: '/phong-chong-chay-rung',
    desc: 'Hướng dẫn bảo vệ rừng mùa khô',
  },
];

function findSuggestions(text) {
  const lower = text.toLowerCase();
  return SUGGESTIONS_MAP.filter(s =>
    s.keywords.some(kw => lower.includes(kw))
  ).slice(0, 3);
}

export default function ChatWindow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLang();

  // Nhận diện ngữ cảnh trang hiện tại
  const currentPath = location.pathname;
  const activeContext = PAGE_CONTEXTS[currentPath] || DEFAULT_CONTEXT;

  const [messages, setMessages] = useState([
    {
      text: activeContext.welcome,
      sender: 'ai',
      suggestions: [],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoRead, setAutoRead] = useState(() => localStorage.getItem('cw_auto_read') === 'true');
  const [isListening, setIsListening] = useState(false);
  const [activeSpeechIndex, setActiveSpeechIndex] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const endRef = useRef(null);
  const recognitionRef = useRef(null);
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  // TỰ ĐỘNG XÓA LỊCH SỬ CHAT CŨ TRONG BỘ NHỚ BÌNH THƯỜNG / CACHE BÀI CŨ
  useEffect(() => {
    try {
      localStorage.removeItem('cw_chat_history');
      localStorage.removeItem('cw_chat_sessions');
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Tự động cập nhật tin nhắn chào mới nhất khi đổi đường dẫn trang
  useEffect(() => {
    setMessages([
      {
        text: activeContext.welcome,
        sender: 'ai',
        suggestions: [],
      },
    ]);
  }, [currentPath]);

  // Lắng nghe click bên ngoài đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text, index) => {
    if (!window.speechSynthesis) return;

    if (activeSpeechIndex === index) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    const cleanedText = text
      .replace(/[*#_`~]/g, '')
      .replace(/-\s+/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = 'vi-VN';

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(voice => voice.lang.includes('vi') || voice.lang.includes('VI'));
    if (viVoice) utterance.voice = viVoice;

    utterance.onend = () => setActiveSpeechIndex(null);
    utterance.onerror = () => setActiveSpeechIndex(null);

    setActiveSpeechIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setActiveSpeechIndex(null);
  };

  const handleNewChat = () => {
    stopSpeaking();
    const defaultMsg = [
      {
        text: activeContext.welcome,
        sender: 'ai',
        suggestions: [],
      },
    ];
    setMessages(defaultMsg);
    setShowMenu(false);
  };

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Hãy dùng Google Chrome hoặc Microsoft Edge nhé!');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      stopSpeaking();
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'vi-VN';
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (e) => {
          const text = e.results[0][0].transcript;
          setInput(prev => (prev ? prev + ' ' + text : text));
        };
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    stopSpeaking();

    // Thêm tin nhắn người dùng
    setMessages(prev => [...prev, { text: msg, sender: 'user', suggestions: [] }]);
    setLoading(true);

    try {
      // Đính kèm ngữ cảnh Trợ lý AI Phòng Văn hóa - Xã hội
      const contextPrompt = `[Trợ lý AI Phòng Văn hóa - Xã hội | Đang xem: ${activeContext.title}] ${msg}`;
      const res = await axios.post(
        'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1/chat',
        { message: contextPrompt }
      );
      const reply = res.data.reply || 'Xin lỗi, tôi chưa hiểu câu hỏi. Bà con thử hỏi lại nhé!';
      const suggestions = findSuggestions(msg + ' ' + reply);

      setMessages(prev => {
        const newMsgs = [...prev, { text: reply, sender: 'ai', suggestions }];
        if (autoRead) {
          const newIndex = newMsgs.length - 1;
          setTimeout(() => speakText(reply, newIndex), 100);
        }
        return newMsgs;
      });
    } catch {
      const suggestions = findSuggestions(msg);
      setMessages(prev => {
        const reply = 'Xin lỗi, hệ thống đang bận. Bà con thử lại sau hoặc xem trực tiếp nội dung bên dưới nhé!';
        const newMsgs = [...prev, { text: reply, sender: 'ai', suggestions }];
        if (autoRead) {
          const newIndex = newMsgs.length - 1;
          setTimeout(() => speakText(reply, newIndex), 100);
        }
        return newMsgs;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="cw-container">
      
      {/* ── HEADER AI ASSISTANT — PHÒNG VĂN HÓA XÃ HỘI ── */}
      <div className="cw-header">
        <div className="cw-header-info">
          <div className="cw-header-avatar">🤖</div>
          <div className="cw-header-text">
            <div className="cw-title">{activeContext.title}</div>
            <div className="cw-subtitle">Phòng Văn hóa - Xã hội • Trực tuyến 24/7</div>
          </div>
        </div>

        <div className="cw-header-actions">
          <button
            ref={menuBtnRef}
            className="cw-icon-btn"
            onClick={() => setShowMenu(!showMenu)}
            title="Tùy chọn"
          >
            ⚙️
          </button>

          {showMenu && (
            <div ref={menuRef} className="cw-dropdown-menu">
              <div
                className="cw-dropdown-item cw-dropdown-toggle-item"
                onClick={() => setAutoRead(!autoRead)}
              >
                <div className="cw-dropdown-item-left">
                  <span className="cw-dropdown-icon">🔊</span>
                  <span>Đọc tự động</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoRead}
                  onChange={e => setAutoRead(e.target.checked)}
                />
              </div>

              <div className="cw-dropdown-item" onClick={handleNewChat}>
                <span className="cw-dropdown-icon">➕</span>
                <span>Cuộc trò chuyện mới</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MESSAGES CONTAINER ── */}
      <div className="cw-messages">
        {messages.map((m, i) => (
          <div key={i} className={`cw-msg-group ${m.sender}`}>
            {m.sender === 'ai' && <div className="cw-avatar">🤖</div>}
            <div className="cw-msg-content">
              <div className="cw-bubble-wrapper">
                <div className={`cw-bubble cw-bubble--${m.sender}`}>
                  {m.text}
                </div>
                {m.sender === 'ai' && (
                  <button
                    className={`cw-speaker-btn ${activeSpeechIndex === i ? 'speaking' : ''}`}
                    onClick={() => speakText(m.text, i)}
                    title={activeSpeechIndex === i ? 'Dừng đọc' : 'Đọc câu trả lời này'}
                  >
                    {activeSpeechIndex === i ? '⏸' : '🔊'}
                  </button>
                )}
              </div>

              {/* Gợi ý liên quan */}
              {m.sender === 'ai' && m.suggestions?.length > 0 && (
                <div className="cw-suggestions">
                  <div className="cw-suggestions-label">📌 Nội dung liên quan:</div>
                  {m.suggestions.map((s, j) => (
                    <button
                      key={j}
                      className="cw-suggestion-chip"
                      onClick={() => handleSuggestionClick(s.path)}
                    >
                      <span className="cw-chip-label">{s.label}</span>
                      <span className="cw-chip-desc">{s.desc}</span>
                      <span className="cw-chip-arrow">→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="cw-msg-group ai">
            <div className="cw-avatar">🤖</div>
            <div className="cw-bubble cw-bubble--ai cw-typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* ── CÂU HỎI NHANH CHUYÊN NGHIỆP DỰA THEO TRANG HIỆN TẠI ── */}
      {messages.length <= 2 && (
        <div className="cw-quick">
          <div className="cw-quick-label">
            💡 Gợi ý câu hỏi về <strong>{activeContext.title}</strong>:
          </div>
          <div className="cw-quick-list">
            {activeContext.quickQuestions.map((q, i) => (
              <button
                key={i}
                className="cw-quick-btn"
                onClick={() => sendMessage(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── INPUT AREA ── */}
      <div className="cw-input-container">
        <div className="cw-input-area">
          <button
            className={`cw-mic-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            title={isListening ? 'Dừng ghi âm' : 'Nói để hỏi Trợ lý AI'}
            type="button"
          >
            {isListening ? '🔴' : '🎤'}
          </button>
          <input
            className="cw-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={isListening ? 'Hệ thống đang lắng nghe...' : `Hỏi Trợ lý AI Phòng VH-XH...`}
            disabled={loading}
          />
          <button
            className="cw-send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            ➤
          </button>
        </div>
      </div>

    </div>
  );
}