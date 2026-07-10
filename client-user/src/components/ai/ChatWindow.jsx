import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChatWindow.css';

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
const QUICK_QUESTIONS = [
  'Tra cứu thẻ BHYT bằng điện thoại như thế nào?',
  'Làm khai sinh cần giấy tờ gì?',
  'Đăng ký VNeID ở đâu?',
  'Hộ nghèo cần thủ tục gì?',
  'Lịch họp thôn gần nhất?',
];

export default function ChatWindow() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      text: 'Xin chào bà con! 👋 Tôi là trợ lý AI của UBND xã Đăk Pxi. Bà con cần hỗ trợ gì?',
      sender: 'ai',
      suggestions: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    // Thêm tin nhắn người dùng
    setMessages(prev => [...prev, { text: msg, sender: 'user', suggestions: [] }]);
    setLoading(true);

    try {
      const res = await axios.post(
        'https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1/chat',
        { message: msg }
      );
      const reply = res.data.reply || 'Xin lỗi, tôi chưa hiểu câu hỏi. Bà con thử hỏi lại nhé!';

      // Tìm gợi ý từ cả câu hỏi và câu trả lời
      const suggestions = findSuggestions(msg + ' ' + reply);

      setMessages(prev => [...prev, { text: reply, sender: 'ai', suggestions }]);
    } catch {
      const suggestions = findSuggestions(msg);
      setMessages(prev => [...prev, {
        text: 'Xin lỗi, hệ thống đang bận. Bà con thử lại sau hoặc xem trực tiếp nội dung bên dưới nhé!',
        sender: 'ai',
        suggestions,
      }]);
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
    navigate(path);
  };

  return (
    <div className="cw-window">

      {/* ── Header ── */}
      <div className="cw-header">
        <div className="cw-header-avatar">🤖</div>
        <div>
          <div className="cw-header-name">Trợ lý AI UBND xã Đăk Pxi</div>
          <div className="cw-header-status">
            <span className="cw-status-dot" />
            Sẵn sàng hỗ trợ
          </div>
        </div>
      </div>

      {/* ── Tin nhắn ── */}
      <div className="cw-messages">
        {messages.map((m, i) => (
          <div key={i} className={`cw-msg-group ${m.sender}`}>
            {m.sender === 'ai' && <div className="cw-avatar">🤖</div>}
            <div className="cw-msg-content">
              <div className={`cw-bubble cw-bubble--${m.sender}`}>
                {m.text}
              </div>

              {/* Gợi ý trang liên quan */}
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
          <div className="cw-quick-label">Câu hỏi thường gặp:</div>
          <div className="cw-quick-list">
            {QUICK_QUESTIONS.map((q, i) => (
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
      <div className="cw-input-area">
        <input
          className="cw-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Bà con hỏi gì cứ nhập vào đây..."
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
  );
}