import { useState } from 'react';
import './FeedbackPopup.css';

export default function FeedbackPopup() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!content.trim()) return;
    const mailto = `mailto:ubnd.dakpxi@gmail.com?subject=Góp ý từ người dân&body=${encodeURIComponent(content)}`;
    window.location.href = mailto;
    setSent(true);
    setContent('');
    setTimeout(() => {
      setSent(false);
      setOpen(false);
    }, 2000);
  };

  return (
    <>
      {/* Nút mở popup */}
      <button className="feedback-trigger" onClick={() => setOpen(true)}>
        💬 
      </button>

      {/* Overlay + Popup */}
      {open && (
        <div className="feedback-overlay" onClick={() => setOpen(false)}>
          <div className="feedback-popup" onClick={(e) => e.stopPropagation()}>

            <button className="feedback-close" onClick={() => setOpen(false)}>✕</button>

            <h3>📝 Góp ý kiến</h3>
            <p>Ý kiến của bà con sẽ được gửi đến UBND xã Đăk Pxi</p>

            {sent ? (
              <div className="feedback-success">✅ Cảm ơn bà con đã góp ý!</div>
            ) : (
              <>
                <textarea
                  className="feedback-textarea"
                  placeholder="Bà con muốn góp ý điều gì?..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                />
                <button
                  className="feedback-submit"
                  onClick={handleSend}
                  disabled={!content.trim()}
                >
                  Gửi góp ý ✉️
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}