import { useState, useRef, useEffect } from 'react';
import './FAQChatBot.css';

const FAQ_BHYT = [
  {
    q: 'Thẻ BHYT hết hạn thì phải làm sao?',
    a: 'Bà con đến UBND xã Đăk Pxi hoặc cơ quan BHXH huyện để gia hạn. Nhớ mang theo CCCD và sổ hộ khẩu. Có thể gia hạn trực tuyến qua app VssID nếu có điện thoại thông minh.',
  },
  {
    q: 'Mất CCCD có tra cứu BHYT được không?',
    a: 'Vẫn tra cứu được nếu nhớ số CCCD 12 chữ số. Nếu quên số thì đến UBND xã, cán bộ sẽ tra cứu giúp bằng họ tên và ngày sinh.',
  },
  {
    q: 'Trẻ em có thẻ BHYT riêng không?',
    a: 'Có. Trẻ em dưới 6 tuổi được cấp thẻ BHYT miễn phí. Trẻ từ 6 tuổi trở lên thuộc hộ nghèo, cận nghèo cũng được hỗ trợ. Bà con đến UBND xã để làm thủ tục.',
  },
  {
    q: 'Dùng thẻ BHYT khám ở đâu được?',
    a: 'Bà con dùng thẻ BHYT khám tại trạm y tế xã, bệnh viện huyện Kon Plông, hoặc các cơ sở y tế đăng ký ban đầu trên thẻ. Khám đúng tuyến sẽ được hưởng đầy đủ quyền lợi.',
  },
  {
    q: 'Thẻ BHYT có dùng được trên điện thoại không?',
    a: 'Có! Bà con tải app VssID hoặc VNeID, đăng nhập bằng số CCCD là có thẻ BHYT điện tử. Dùng được tại hầu hết cơ sở y tế, không cần mang thẻ giấy.',
  },
];

const FAQ_BHXH = [
  {
    q: 'Tôi đóng BHXH bao nhiêu năm thì được hưu?',
    a: 'Nam cần đủ 20 năm đóng BHXH và đủ 60 tuổi (lộ trình tăng dần đến 62 tuổi). Nữ cần đủ 20 năm và đủ 55 tuổi (tăng dần đến 60 tuổi). Tra cứu số năm đóng qua app VssID.',
  },
  {
    q: 'Nghỉ việc thì có rút BHXH một lần được không?',
    a: 'Được, nếu đã nghỉ việc 12 tháng liên tục và chưa đủ điều kiện hưởng lương hưu. Tuy nhiên rút một lần sẽ mất toàn bộ quá trình đóng — bà con cân nhắc kỹ trước khi quyết định.',
  },
  {
    q: 'Thai sản được hưởng bao nhiêu tháng?',
    a: 'Lao động nữ sinh con được nghỉ 6 tháng và hưởng 100% lương bình quân. Điều kiện: đóng BHXH đủ 6 tháng trong 12 tháng trước khi sinh.',
  },
  {
    q: 'Bị tai nạn lao động thì được hỗ trợ gì?',
    a: 'Được hưởng trợ cấp tai nạn lao động từ quỹ BHXH, bao gồm: chi phí y tế, trợ cấp một lần hoặc hàng tháng tùy mức suy giảm khả năng lao động. Báo ngay cho chủ sử dụng lao động và cơ quan BHXH.',
  },
  {
    q: 'Làm sao biết tôi đang đóng BHXH ở đâu?',
    a: 'Mở app VssID → chọn "Quá trình tham gia BHXH" → xem đơn vị đang đóng, mức lương đóng và số năm tích lũy. Hoặc vào baohiemxahoi.gov.vn tra cứu bằng số CCCD.',
  },
];

const FAQ_VNEID = [
  {
    q: 'VNeID khác VssID chỗ nào?',
    a: 'VNeID là app định danh quốc gia của Bộ Công an — dùng thay CCCD, xem nhiều giấy tờ. VssID là app của BHXH — chuyên xem thông tin BHYT và BHXH. Bà con nên có cả 2 app.',
  },
  {
    q: 'Không có NFC thì kích hoạt VNeID mức 2 bằng cách nào?',
    a: 'Đến trực tiếp UBND xã Đăk Pxi hoặc Công an xã — cán bộ có thiết bị đọc chip CCCD chuyên dụng, hỗ trợ kích hoạt miễn phí trong vài phút.',
  },
  {
    q: 'VNeID mức 1 và mức 2 khác nhau gì?',
    a: 'Mức 1: chỉ xem thông tin cơ bản, chưa xác thực đầy đủ. Mức 2: đã xác thực sinh trắc học, dùng được toàn bộ tính năng như ký số, nộp hồ sơ, thay thế CCCD vật lý.',
  },
  {
    q: 'Đăng ký VNeID có mất tiền không?',
    a: 'Hoàn toàn miễn phí. Tải app, đăng ký và kích hoạt đều không mất phí. Cán bộ UBND xã hỗ trợ miễn phí, không thu bất kỳ khoản nào.',
  },
  {
    q: 'VNeID có an toàn không, có bị lộ thông tin không?',
    a: 'VNeID do Bộ Công an phát triển và quản lý, bảo mật theo tiêu chuẩn quốc gia. Bà con chỉ cần giữ bí mật mật khẩu và không chia sẻ mã OTP cho người lạ.',
  },
];

const SYSTEM_PROMPT = {
  bhyt: `Bạn là trợ lý AI hỗ trợ bà con xã Đăk Pxi, Kon Tum tra cứu và hiểu về Bảo hiểm Y tế (BHYT). 
Trả lời ngắn gọn, dễ hiểu, thân thiện như đang nói chuyện với bà con nông thôn vùng cao.
Chỉ trả lời các câu hỏi liên quan đến BHYT, tra cứu thẻ, quyền lợi BHYT.
Nếu không biết, hướng dẫn đến UBND xã Đăk Pxi hoặc gọi 1900 936 936.
Trả lời bằng tiếng Việt, tối đa 3-4 câu.`,

  bhxh: `Bạn là trợ lý AI hỗ trợ bà con xã Đăk Pxi, Kon Tum về Bảo hiểm Xã hội (BHXH).
Trả lời ngắn gọn, dễ hiểu, thân thiện như đang nói chuyện với bà con nông thôn vùng cao.
Chỉ trả lời các câu hỏi liên quan đến BHXH: hưu trí, thai sản, ốm đau, tai nạn lao động, thất nghiệp.
Nếu không biết, hướng dẫn đến UBND xã Đăk Pxi hoặc gọi 1900 936 936.
Trả lời bằng tiếng Việt, tối đa 3-4 câu.`,

  vneid: `Bạn là trợ lý AI hỗ trợ bà con xã Đăk Pxi, Kon Tum về ứng dụng VNeID và định danh điện tử.
Trả lời ngắn gọn, dễ hiểu, thân thiện như đang nói chuyện với bà con nông thôn vùng cao.
Chỉ trả lời các câu hỏi liên quan đến VNeID, đăng ký, kích hoạt, sử dụng.
Nếu không biết, hướng dẫn đến UBND xã Đăk Pxi.
Trả lời bằng tiếng Việt, tối đa 3-4 câu.`,
};

export default function FAQChatBot({ type = 'bhyt' }) {
  const faqList = type === 'bhyt' ? FAQ_BHYT : type === 'bhxh' ? FAQ_BHXH : FAQ_VNEID;
  const label = type === 'bhyt' ? 'BHYT' : type === 'bhxh' ? 'BHXH' : 'VNeID';
  const color = type === 'bhyt' ? '#005bac' : type === 'bhxh' ? '#1d4ed8' : '#7c3aed';

  const [openFaq, setOpenFaq] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Xin chào bà con! Tôi là trợ lý AI hỗ trợ về ${label}. Bà con hỏi gì cứ tự nhiên nhé! 😊` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPT[type],
          messages: [
            ...messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0).map(m => ({
              role: m.role,
              content: m.text,
            })),
            { role: 'user', content: text },
          ],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || 'Xin lỗi, tôi chưa hiểu câu hỏi. Bà con thử hỏi lại hoặc gọi 1900 936 936 nhé!';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Mạng đang yếu, bà con thử lại sau nhé! Hoặc gọi 1900 936 936 để được hỗ trợ.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="faq-chatbot-section">

      {/* ── FAQ Accordion ── */}
      <div className="faq-section">
        <div className="faq-header">
          <div className="faq-header-icon" style={{ background: color + '18', color }}>❓</div>
          <div>
            <h2 className="faq-title">Hỏi đáp thường gặp về {label}</h2>
            <p className="faq-sub">Bà con bấm vào câu hỏi để xem câu trả lời</p>
          </div>
        </div>

        <div className="faq-list">
          {faqList.map((item, i) => (
            <div
              key={i}
              className={`faq-item ${openFaq === i ? 'open' : ''}`}
              style={{ borderLeftColor: openFaq === i ? color : 'transparent' }}
            >
              <button
                className="faq-question"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="faq-q-num" style={{ background: color }}>{i + 1}</span>
                <span className="faq-q-text">{item.q}</span>
                <span className="faq-arrow">{openFaq === i ? '▲' : '▼'}</span>
              </button>
              {openFaq === i && (
                <div className="faq-answer">
                  <span className="faq-a-icon">💬</span>
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Chatbot ── */}
      <div className="chatbot-section">
        <div className="chatbot-header" style={{ background: color }}>
          <div className="chatbot-header-left">
            <div className="chatbot-avatar">🤖</div>
            <div>
              <div className="chatbot-name">Trợ lý AI {label}</div>
              <div className="chatbot-status">
                <span className="chatbot-dot" />
                Sẵn sàng hỗ trợ bà con
              </div>
            </div>
          </div>
          <button
            className="chatbot-toggle"
            onClick={() => setShowChat(!showChat)}
          >
            {showChat ? '▲ Thu gọn' : '▼ Mở chat'}
          </button>
        </div>

        {showChat && (
          <>
            <div className="chatbot-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chat-msg chat-msg--${m.role}`}>
                  {m.role === 'assistant' && <div className="chat-avatar">🤖</div>}
                  <div className="chat-bubble" style={m.role === 'user' ? { background: color } : {}}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-msg chat-msg--assistant">
                  <div className="chat-avatar">🤖</div>
                  <div className="chat-bubble chat-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Gợi ý câu hỏi nhanh */}
            <div className="chat-suggestions">
              {faqList.slice(0, 3).map((item, i) => (
                <button
                  key={i}
                  className="chat-suggest-btn"
                  style={{ borderColor: color + '40', color }}
                  onClick={() => { setInput(item.q); }}
                >
                  {item.q}
                </button>
              ))}
            </div>

            <div className="chatbot-input-row">
              <input
                className="chatbot-input"
                type="text"
                placeholder="Bà con hỏi gì cứ nhập vào đây..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
              />
              <button
                className="chatbot-send"
                style={{ background: color }}
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                ➤
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}