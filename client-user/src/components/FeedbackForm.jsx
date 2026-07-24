import { useState } from "react";
import "./FeedbackForm.css";

const SvgCheckCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const SvgSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate clean submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ fullName: "", phone: "", email: "", content: "" });
    }, 600);
  };

  return (
    <section className="feedback-form-card">
      <div className="feedback-header">
        <h3>✉ Gửi ý kiến góp ý & Phản ánh của bà con</h3>
        <p>Ý kiến của bà con giúp UBND xã Đăk Pxi hoàn thiện và nâng cao chất lượng phục vụ nhân dân.</p>
      </div>

      {submitted ? (
        <div className="feedback-success-banner">
          <SvgCheckCircle />
          <div>
            <strong>Gửi góp ý thành công!</strong>
            <p>Cảm ơn bà con đã gửi ý kiến. Bộ phận tiếp dân UBND xã Đăk Pxi sẽ tiếp thu và phản hồi trong thời gian sớm nhất.</p>
          </div>
          <button type="button" className="btn-reset-feedback" onClick={() => setSubmitted(false)}>
            Gửi thêm ý kiến khác
          </button>
        </div>
      ) : (
        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="feedback-form-grid">
            <div className="feedback-field">
              <label htmlFor="fb-fullname">Họ và tên <span className="req">*</span></label>
              <input
                id="fb-fullname"
                type="text"
                required
                placeholder="Nhập họ và tên của bà con"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="feedback-field">
              <label htmlFor="fb-phone">Số điện thoại <span className="req">*</span></label>
              <input
                id="fb-phone"
                type="tel"
                required
                inputMode="tel"
                placeholder="Nhập số điện thoại liên hệ"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="feedback-field">
            <label htmlFor="fb-email">Địa chỉ Email (nếu có)</label>
            <input
              id="fb-email"
              type="email"
              placeholder="ví dụ: email@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="feedback-field">
            <label htmlFor="fb-content">Nội dung góp ý / Phản ánh <span className="req">*</span></label>
            <textarea
              id="fb-content"
              required
              rows={4}
              placeholder="Nhập chi tiết nội dung bà con muốn góp ý hoặc phản ánh tới UBND xã..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <button type="submit" className="feedback-submit-btn" disabled={submitting}>
            <SvgSend />
            <span>{submitting ? "Đang gửi ý kiến..." : "Gửi góp ý"}</span>
          </button>
        </form>
      )}
    </section>
  );
}
