import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChatWindow.css';
import { useLang } from '../../LanguageContext';

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
    keywords: ['thủ tục', 'hành chính', 'khai sinh', 'khai tử', 'kết hôn', 'sổ đỏ', 'hộ nghèo', 'giấy tờ', 'chứng thực'],
    label: '📑 Thủ tục hành chính',
    path: '/Thu-tuc-hanh-chinh',
    desc: 'Tra cứu giấy tờ cần chuẩn bị',
  },
  {
    keywords: ['thông báo', 'tin tức', 'thông tin mới', 'thông tin xã'],
    label: '📢 Thông báo',
    path: '/thong-bao',
    desc: 'Xem thông báo mới nhất từ UBND xã',
  },
  {
    keywords: ['lịch họp', 'họp thôn', 'họp dân', 'lịch'],
    label: '📅 Lịch họp',
    path: '/lich-hop',
    desc: 'Xem lịch họp thôn bản',
  },
  {
    keywords: ['chuyển đổi số', 'dịch vụ công', 'trực tuyến', 'online', 'nộp hồ sơ'],
    label: '💻 Chuyển đổi số',
    path: '/chuyen-doi-so',
    desc: 'Hướng dẫn dịch vụ công trực tuyến',
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
  {
    keywords: ['pháp luật', 'luật', 'quy định', 'nghị định'],
    label: '⚖️ Góc pháp luật',
    path: '/phap-luat',
    desc: 'Phổ biến kiến thức pháp luật',
  },
  {
    keywords: ['góp ý', 'phản hồi', 'liên hệ', 'hỗ trợ'],
    label: '📞 Liên hệ & Góp ý',
    path: '/lien-he',
    desc: 'Gửi góp ý cho UBND xã',
  },
];

// ── Tìm gợi ý từ nội dung tin nhắn ──
function findSuggestions(text) {
  const lower = text.toLowerCase();
  return SUGGESTIONS_MAP.filter(s =>
    s.keywords.some(kw => lower.includes(kw))
  ).slice(0, 3);
}

// ── Gợi ý câu hỏi nhanh ban đầu ──
const QUICK_QUESTIONS_VI = [
  'Tra cứu thẻ BHYT bằng điện thoại như thế nào?',
  'Làm khai sinh cần giấy tờ gì?',
  'Đăng ký VNeID ở đâu?',
  'Hộ nghèo cần thủ tục gì?',
  'Lịch họp thôn gần nhất?',
];

const QUICK_QUESTIONS_EN = [
  'How to lookup Health Insurance card on phone?',
  'What documents are needed for birth registration?',
  'Where to register for VNeID?',
  'What is the procedure for poor households?',
  'When is the nearest village meeting?',
];

export default function ChatWindow() {
  const navigate = useNavigate();
  const { lang } = useLang();
  const isEn = lang === 'xd';

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('cw_chat_history');
      const defaultWelcome = document.cookie.includes('googtrans=/vi/en')
        ? 'Hello! 👋 I am the AI Assistant of Dak Pxi Commune. How can I help you?'
        : 'Xin chào bà con! 👋 Tôi là trợ lý AI của UBND xã Đăk Pxi. Bà con cần hỗ trợ gì?';

      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0 && parsed[0].sender === 'ai') {
          parsed[0].text = defaultWelcome;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Lỗi đọc lịch sử chat:', e);
    }
    return [
      {
        text: document.cookie.includes('googtrans=/vi/en')
          ? 'Hello! 👋 I am the AI Assistant of Dak Pxi Commune. How can I help you?'
          : 'Xin chào bà con! 👋 Tôi là trợ lý AI của UBND xã Đăk Pxi. Bà con cần hỗ trợ gì?',
        sender: 'ai',
        suggestions: [],
      },
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoRead, setAutoRead] = useState(() => localStorage.getItem('cw_auto_read') === 'true');
  const [isListening, setIsListening] = useState(false);
  const [activeSpeechIndex, setActiveSpeechIndex] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('cw_chat_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Lỗi đọc danh sách phiên chat:', e);
      return [];
    }
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return localStorage.getItem('cw_current_session_id') || Date.now().toString();
  });

  const endRef = useRef(null);
  const recognitionRef = useRef(null);
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  // Lắng nghe click bên ngoài để đóng menu tùy chọn
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

  // Lưu tin nhắn hiện tại và lưu vào lịch sử các phiên chat (sessions)
  useEffect(() => {
    localStorage.setItem('cw_chat_history', JSON.stringify(messages));

    if (messages.length > 1) {
      const firstUserMsg = messages.find(m => m.sender === 'user')?.text || '';
      const preview = firstUserMsg.length > 40 ? firstUserMsg.substring(0, 40) + '...' : firstUserMsg;

      setSessions(prevSessions => {
        const existingIdx = prevSessions.findIndex(s => s.id === currentSessionId);
        const nowStr = new Date().toLocaleString('vi-VN', {
          hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
        });

        const updatedSession = {
          id: currentSessionId,
          title: preview || (isEn ? 'Conversation' : 'Cuộc trò chuyện'),
          updatedAt: nowStr,
          timestamp: Date.now(),
          messages: messages
        };

        let nextSessions;
        if (existingIdx >= 0) {
          nextSessions = [...prevSessions];
          nextSessions[existingIdx] = updatedSession;
        } else {
          nextSessions = [updatedSession, ...prevSessions];
        }

        localStorage.setItem('cw_chat_sessions', JSON.stringify(nextSessions));
        return nextSessions;
      });
    }
  }, [messages, currentSessionId, isEn]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Đồng bộ cài đặt Tự động đọc vào localStorage
  useEffect(() => {
    localStorage.setItem('cw_auto_read', autoRead);
  }, [autoRead]);

  // Đăng ký sự kiện thay đổi danh sách giọng đọc của trình duyệt
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const handleVoicesChanged = () => {};
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  // Khởi tạo Speech Recognition (Nhận diện giọng nói)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'vi-VN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setInput(prev => (prev ? prev + ' ' + text : text));
      };

      recognition.onerror = (event) => {
        console.error('Lỗi nhận diện giọng nói:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Dọn dẹp tiến trình nói/nghe khi component bị hủy
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const speakText = (text, index) => {
    if (!window.speechSynthesis) {
      alert('Trình duyệt của bạn không hỗ trợ đọc văn bản.');
      return;
    }

    if (activeSpeechIndex === index) {
      stopSpeaking();
      return;
    }

    stopSpeaking();

    // Loại bỏ ký tự Markdown để giọng đọc tự nhiên hơn
    const cleanedText = text
      .replace(/[*#_`~]/g, '')
      .replace(/-\s+/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = 'vi-VN';

    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(voice => voice.lang.includes('vi') || voice.lang.includes('VI'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onend = () => {
      setActiveSpeechIndex(null);
    };

    utterance.onerror = () => {
      setActiveSpeechIndex(null);
    };

    setActiveSpeechIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setActiveSpeechIndex(null);
  };

  const handleNewChat = () => {
    stopSpeaking();
    const newId = Date.now().toString();
    const defaultMsg = [
      {
        text: isEn
          ? 'Hello! 👋 I am the AI Assistant of Dak Pxi Commune. How can I help you?'
          : 'Xin chào bà con! 👋 Tôi là trợ lý AI của UBND xã Đăk Pxi. Bà con cần hỗ trợ gì?',
        sender: 'ai',
        suggestions: [],
      },
    ];
    setMessages(defaultMsg);
    setCurrentSessionId(newId);
    localStorage.setItem('cw_current_session_id', newId);
    localStorage.setItem('cw_chat_history', JSON.stringify(defaultMsg));
    setShowMenu(false);
  };

  const handleSelectSession = (session) => {
    stopSpeaking();
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    localStorage.setItem('cw_current_session_id', session.id);
    localStorage.setItem('cw_chat_history', JSON.stringify(session.messages));
    setShowHistoryModal(false);
  };

  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    const filtered = sessions.filter(s => s.id !== sessionId);
    setSessions(filtered);
    localStorage.setItem('cw_chat_sessions', JSON.stringify(filtered));
    if (currentSessionId === sessionId) {
      handleNewChat();
    }
  };

  const handleClearAllSessions = () => {
    const confirmMsg = isEn
      ? 'Are you sure you want to delete all chat history?'
      : 'Bà con có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện không?';
    if (window.confirm(confirmMsg)) {
      setSessions([]);
      localStorage.removeItem('cw_chat_sessions');
      handleNewChat();
      setShowHistoryModal(false);
    }
  };

  const clearHistory = () => {
    const confirmMsg = isEn 
      ? 'Are you sure you want to clear the current chat history?' 
      : 'Bà con có chắc chắn muốn xóa trò chuyện hiện tại không?';
    if (window.confirm(confirmMsg)) {
      handleNewChat();
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(
        isEn
          ? 'Your browser does not support speech recognition. Please use Google Chrome or Microsoft Edge.'
          : 'Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Hãy dùng Google Chrome hoặc Microsoft Edge nhé!'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Không khởi động được micro:', err);
      }
    }
  };

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    stopSpeaking(); // Dừng phát âm thanh khi có câu hỏi mới

    // Thêm tin nhắn người dùng
    setMessages(prev => [...prev, { text: msg, sender: 'user', suggestions: [] }]);
    setLoading(true);

    try {
      const res = await axios.post(
        'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1/chat',
        { message: msg }
      );
      const reply = res.data.reply || (isEn ? 'Sorry, I did not understand that. Please try again.' : 'Xin lỗi, tôi chưa hiểu câu hỏi. Bà con thử hỏi lại nhé!');

      // Tìm gợi ý từ cả câu hỏi và câu trả lời
      const suggestions = findSuggestions(msg + ' ' + reply);

      setMessages(prev => {
        const newMsgs = [...prev, { text: reply, sender: 'ai', suggestions }];
        if (autoRead) {
          const newIndex = newMsgs.length - 1;
          setTimeout(() => {
            speakText(reply, newIndex);
          }, 100);
        }
        return newMsgs;
      });
    } catch {
      const suggestions = findSuggestions(msg);
      setMessages(prev => {
        const reply = isEn
          ? 'Sorry, the server is busy. Please try again later.'
          : 'Xin lỗi, hệ thống đang bận. Bà con thử lại sau hoặc xem trực tiếp nội dung bên dưới nhé!';
        const newMsgs = [...prev, {
          text: reply,
          sender: 'ai',
          suggestions,
        }];
        if (autoRead) {
          const newIndex = newMsgs.length - 1;
          setTimeout(() => {
            speakText(reply, newIndex);
          }, 100);
        }
        return newMsgs;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (path) => {
    stopSpeaking();
    navigate(path);
  };

  const quickQuestionsList = isEn ? QUICK_QUESTIONS_EN : QUICK_QUESTIONS_VI;

  return (
    <div className="cw-window">

      {/* ── Header ── */}
      <div className="cw-header">
        <div className="cw-header-left">
          <div className="cw-header-avatar">🤖</div>
          <div>
            <div className="cw-header-name">
              {isEn ? 'AI Assistant Dak Pxi' : 'Trợ lý AI UBND xã Đăk Pxi'}
            </div>
            <div className="cw-header-status">
              <span className="cw-status-dot" />
              {isEn ? 'Ready to assist' : 'Sẵn sàng hỗ trợ'}
            </div>
          </div>
        </div>
        <div className="cw-header-actions">
          <button
            ref={menuBtnRef}
            className={`cw-menu-btn ${showMenu ? 'active' : ''}`}
            onClick={() => setShowMenu(prev => !prev)}
            title={isEn ? 'Options' : 'Tùy chọn'}
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>

          {showMenu && (
            <div ref={menuRef} className="cw-dropdown-menu">
              {/* Item 1: Đọc tự động */}
              <div
                className="cw-dropdown-item cw-dropdown-toggle-item"
                onClick={() => setAutoRead(!autoRead)}
              >
                <div className="cw-dropdown-item-left">
                  <span className="cw-dropdown-icon">🔊</span>
                  <span>{isEn ? 'Auto Read' : 'Đọc tự động'}</span>
                </div>
                <label className="cw-toggle-label-mini" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={autoRead}
                    onChange={e => setAutoRead(e.target.checked)}
                    className="cw-toggle-checkbox"
                  />
                  <span className="cw-toggle-slider" />
                </label>
              </div>

              <div className="cw-dropdown-divider" />

              {/* Item 2: Lịch sử chat */}
              <div
                className="cw-dropdown-item"
                onClick={() => {
                  setShowMenu(false);
                  setShowHistoryModal(true);
                }}
              >
                <span className="cw-dropdown-icon">📜</span>
                <span>{isEn ? 'Chat History' : 'Lịch sử chat'}</span>
              </div>

              {/* Item 3: Cuộc trò chuyện mới */}
              <div
                className="cw-dropdown-item"
                onClick={handleNewChat}
              >
                <span className="cw-dropdown-icon">➕</span>
                <span>{isEn ? 'New Chat' : 'Cuộc trò chuyện mới'}</span>
              </div>

              {/* Item 4: Xóa trò chuyện hiện tại */}
              {messages.length > 1 && (
                <div
                  className="cw-dropdown-item cw-dropdown-danger"
                  onClick={() => {
                    setShowMenu(false);
                    clearHistory();
                  }}
                >
                  <span className="cw-dropdown-icon">🗑️</span>
                  <span>{isEn ? 'Clear Current Chat' : 'Xóa trò chuyện hiện tại'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Tin nhắn ── */}
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
                    title={activeSpeechIndex === i ? (isEn ? 'Stop speaking' : 'Dừng đọc') : (isEn ? 'Read response' : 'Đọc câu trả lời này')}
                  >
                    {activeSpeechIndex === i ? '⏸' : '🔊'}
                  </button>
                )}
              </div>

              {/* Gợi ý trang liên quan */}
              {m.sender === 'ai' && m.suggestions?.length > 0 && (
                <div className="cw-suggestions">
                  <div className="cw-suggestions-label">📌 {isEn ? 'Related Content:' : 'Nội dung liên quan:'}</div>
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

        {/* Typing indicator */}
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

      {/* ── Câu hỏi nhanh ── */}
      {messages.length <= 1 && (
        <div className="cw-quick">
          <div className="cw-quick-label">
            {isEn ? 'Frequently Asked Questions:' : 'Câu hỏi thường gặp:'}
          </div>
          <div className="cw-quick-list">
            {quickQuestionsList.map((q, i) => (
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

      {/* ── Input ── */}
      <div className="cw-input-container">
        {isListening && (
          <div className="cw-waveform">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        )}
        <div className="cw-input-area">
          <button
            className={`cw-mic-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            title={isListening ? (isEn ? 'Stop recording' : 'Dừng ghi âm') : (isEn ? 'Speak to ask' : 'Nói để nhập câu hỏi')}
            disabled={loading}
            type="button"
          >
            {isListening ? '🔴' : '🎤'}
          </button>
          <input
            className="cw-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={isListening ? (isEn ? 'Listening to you...' : 'Hệ thống đang lắng nghe bà con...') : (isEn ? 'Ask me anything...' : 'Bà con hỏi gì cứ nhập vào đây...')}
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

      {/* ── Modal Lịch Sử Chat ── */}
      {showHistoryModal && (
        <div className="cw-history-modal-overlay" onClick={() => setShowHistoryModal(false)}>
          <div className="cw-history-modal" onClick={e => e.stopPropagation()}>
            <div className="cw-history-header">
              <div className="cw-history-title">
                <span>📜</span> {isEn ? 'Chat History' : 'Lịch sử trò chuyện'}
              </div>
              <button className="cw-history-close-btn" onClick={() => setShowHistoryModal(false)}>×</button>
            </div>

            <div className="cw-history-body">
              <div className="cw-history-top-actions">
                <button className="cw-history-new-btn" onClick={handleNewChat}>
                  <span>➕</span> {isEn ? 'Start New Chat' : 'Cuộc trò chuyện mới'}
                </button>
                {sessions.length > 0 && (
                  <button className="cw-history-clear-all-btn" onClick={handleClearAllSessions}>
                    <span>🗑️</span> {isEn ? 'Clear All History' : 'Xóa tất cả'}
                  </button>
                )}
              </div>

              {sessions.length === 0 ? (
                <div className="cw-history-empty">
                  <span className="cw-history-empty-icon">💬</span>
                  <p>{isEn ? 'No previous chat history recorded.' : 'Chưa có lịch sử trò chuyện nào được ghi nhận.'}</p>
                </div>
              ) : (
                <div className="cw-history-list">
                  {sessions.map(s => (
                    <div
                      key={s.id}
                      className={`cw-history-card ${s.id === currentSessionId ? 'active' : ''}`}
                      onClick={() => handleSelectSession(s)}
                    >
                      <div className="cw-history-card-content">
                        <div className="cw-history-card-title">{s.title}</div>
                        <div className="cw-history-card-meta">
                          <span>🕒 {s.updatedAt}</span>
                          <span>• {s.messages ? s.messages.length : 0} {isEn ? 'messages' : 'tin nhắn'}</span>
                          {s.id === currentSessionId && (
                            <span className="cw-history-badge">{isEn ? 'Current' : 'Đang mở'}</span>
                          )}
                        </div>
                      </div>
                      <button
                        className="cw-history-delete-item-btn"
                        onClick={e => handleDeleteSession(s.id, e)}
                        title={isEn ? 'Delete conversation' : 'Xóa cuộc trò chuyện này'}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}