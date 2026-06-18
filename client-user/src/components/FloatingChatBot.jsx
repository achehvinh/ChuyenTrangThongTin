import { useState, useRef, useEffect } from 'react';
import './FloatingChatBot.css';

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

  general: `Bạn là trợ lý AI của UBND xã Đắk Pxi, Kon Tum. Phục vụ đồng bào dân tộc thiểu số Xơ Đăng.
Trả lời tiếng Việt đơn giản, câu ngắn, tối đa 4 câu.
Chủ đề: BHXH, BHYT, CCCD, VNeID, thủ tục hành chính, an toàn cộng đồng.
Không biết thì hướng gọi 0339 310 915.`,
};

const LOCAL_QA = [
  { keys: ['bhyt hết hạn', 'thẻ hết hạn', 'gia hạn thẻ'], ans: 'Thẻ BHYT hết hạn — bà con đến UBND xã Đắk Pxi mang theo CCCD để gia hạn. Có thể gia hạn online qua app VssID. Nên gia hạn trước 30 ngày! ✅' },
  { keys: ['mất cccd', 'mất căn cước'], ans: 'Khi mất CCCD: trình báo ngay công an xã, mang giấy khai sinh/sổ hộ khẩu, phí cấp lại 40.000–70.000đ. Trình báo sớm để tránh bị lợi dụng nhé! 🪪' },
  { keys: ['vneid mức 2', 'kích hoạt vneid'], ans: 'Kích hoạt VNeID mức 2: mang CCCD gắn chip đến công an xã hoặc bưu điện, quét chip + chụp khuôn mặt, xong trong 5 phút. Miễn phí! 🔐' },
  { keys: ['liên hệ', 'số điện thoại ubnd', 'hotline'], ans: 'UBND xã Đắk Pxi: ☎️ 0339 310 915 (T2–T6, 7:30–17:00). Ngoài giờ nhắn Zalo cùng số đó để được hỗ trợ nhanh!' },
];

const QUICK_CHIPS = ['Thẻ BHYT hết hạn?', 'Mất CCCD?', 'VNeID mức 2?'];

function getLocalAns(text) {
  const t = text.toLowerCase();
  for (const qa of LOCAL_QA) {
    if (qa.keys.some(k => t.includes(k))) return qa.ans;
  }
  return null;
}

export default function FloatingChatBot({ type = 'general' }) {
  const [open,     setOpen]     = useState(false);
  const [hasNew,   setHasNew]   = useState(true);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Xin chào bà con xã Đắk Pxi! Tôi hỗ trợ về BHYT, BHXH, CCCD và VNeID. Bà con cần hỏi gì? 🌿',
      chips: QUICK_CHIPS,
    },
  ]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);

  // ── Draggable position ──────────────────────────────
  const fabRef    = useRef(null);
  const panelRef  = useRef(null);
  const posRef = useRef({ right: 24, bottom: 220 }); // stored as right/bottom from viewport
  const dragState = useRef(null);
  const msgsEnd   = useRef(null);

  useEffect(() => {
    msgsEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Apply saved position to FAB
  const applyPos = (right, bottom) => {
    posRef.current = { right, bottom };
    const fab = fabRef.current;
    if (!fab) return;
    fab.style.right  = right  + 'px';
    fab.style.bottom = bottom + 'px';
    fab.style.left   = 'auto';
    fab.style.top    = 'auto';
    updatePanelPos(right, bottom);
  };

  const updatePanelPos = (right, bottom) => {
    const panel = panelRef.current;
    if (!panel || !open) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pw = 320, ph = 420;
    const fabL = vw - right - 60;
    const fabB = bottom;
    let pl = fabL - pw - 8;
    if (pl < 8) pl = fabL + 68;
    if (pl + pw > vw - 8) pl = vw - pw - 8;
    let pb = fabB;
    if (pb + ph > vh - 8) pb = vh - ph - 8;
    if (pb < 8) pb = 8;
    panel.style.left   = pl  + 'px';
    panel.style.bottom = pb  + 'px';
    panel.style.right  = 'auto';
    panel.style.top    = 'auto';
  };

  // Pointer drag handlers
  const onPointerDown = e => {
    const fab = fabRef.current;
    fab.setPointerCapture(e.pointerId);
    dragState.current = {
      startX:   e.clientX,
      startY:   e.clientY,
      startR:   posRef.current.right,
      startB:   posRef.current.bottom,
      dragged:  false,
    };
    e.preventDefault();
  };

  const onPointerMove = e => {
    const ds = dragState.current;
    if (!ds || !fabRef.current.hasPointerCapture(e.pointerId)) return;
    const dx = e.clientX - ds.startX;
    const dy = e.clientY - ds.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) ds.dragged = true;
    if (!ds.dragged) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let nr = ds.startR - dx;
    let nb = ds.startB - dy;
    nr = Math.max(8, Math.min(nr, vw - 66));
    nb = Math.max(8, Math.min(nb, vh - 66));
    applyPos(nr, nb);
  };

  const onPointerUp = e => {
    const ds = dragState.current;
    if (!ds) return;
    dragState.current = null;
    if (!ds.dragged) toggleOpen();
  };

  const toggleOpen = () => {
    setOpen(prev => {
      if (!prev) setHasNew(false);
      return !prev;
    });
  };

  useEffect(() => {
    if (open) {
      const { right, bottom } = posRef.current;
      updatePanelPos(right, bottom);
    }
  }, [open]);

  // ── Send message ────────────────────────────────────
  const sendMsg = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text: q }]);

    const local = getLocalAns(q);
    if (local) {
      await new Promise(r => setTimeout(r, 600));
      setMessages(m => [...m, { role: 'bot', text: local }]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPT[type] || SYSTEM_PROMPT.general,
          messages: [{ role: 'user', content: q }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text
        || 'Xin lỗi, tôi chưa hiểu câu hỏi. Bà con thử hỏi lại hoặc gọi 1900 936 936 nhé!';
      setMessages(m => [...m, { role: 'bot', text: reply }]);
    } catch {
      setMessages(m => [...m, {
        role: 'bot',
        text: 'Mạng đang yếu, bà con thử lại sau nhé! Hoặc gọi 0339 310 915 để được hỗ trợ trực tiếp. 📞',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Floating button ── */}
      <div className="fab-wrap">
        <div className={`fab-pulse ${open ? 'hidden' : ''}`} />
        <button
          ref={fabRef}
          className={`fab ${open ? 'open' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          aria-label="Mở trợ lý AI"
          style={{ right: 24, bottom: 220 }}
        >
          {open ? '✕' : '🤖'}
          {hasNew && !open && <span className="fab-badge">1</span>}
        </button>
      </div>

      {/* ── Chat panel ── */}
      {open && (
        <div ref={panelRef} className="chat-panel" style={{ right: 90, bottom: 22 }}>
          {/* Header */}
          <div className="cp-head">
            <div className="cp-ava">🤖</div>
            <div className="cp-info">
              <div className="cp-name">Trợ lý AI Đắk Pxi</div>
              <div className="cp-status"><span className="cp-dot" />Sẵn sàng hỗ trợ</div>
            </div>
            <button className="cp-close" onClick={() => setOpen(false)} aria-label="Đóng">✕</button>
          </div>

          {/* Messages */}
          <div className="cp-msgs">
            {messages.map((m, i) => (
              <div key={i} className={`msg-row ${m.role === 'user' ? 'user' : ''}`}>
                {m.role === 'bot' && <div className="msg-ava">🤖</div>}
                <div className="msg-col">
                  <div className={`bubble ${m.role}`}>{m.text}</div>
                  {m.chips && (
                    <div className="bubble-chips">
                      {m.chips.map(c => (
                        <button key={c} className="bubble-chip" onClick={() => sendMsg(c)}>{c}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="msg-row">
                <div className="msg-ava">🤖</div>
                <div className="bubble bot typing">
                  <span className="tdot" /><span className="tdot" /><span className="tdot" />
                </div>
              </div>
            )}
            <div ref={msgsEnd} />
          </div>

          {/* Input */}
          <div className="cp-inp-row">
            <input
              className="cp-input"
              value={input}
              placeholder="Hỏi gì cũng được..."
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
              disabled={loading}
            />
            <button
              className="cp-send"
              onClick={() => sendMsg()}
              disabled={!input.trim() || loading}
              aria-label="Gửi"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}