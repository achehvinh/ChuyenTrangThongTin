import React, { useState } from 'react';
import { PaperPlaneTilt, Lightbulb, CheckCircle, X } from '../icons';
import { submitSuggestion } from '../../services/oneMinuteService';

export default function SuggestionBanner({ showToast }) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    await submitSuggestion(content, name, phone);
    setIsSubmitted(true);
    if (showToast) showToast('🎉 Cảm ơn ý kiến đóng góp quý báu của bà con!');
    setTimeout(() => {
      setIsOpenModal(false);
      setIsSubmitted(false);
      setContent('');
      setName('');
      setPhone('');
    }, 2000);
  };

  return (
    <div className="om-suggestion-banner-card">
      
      <div className="om-sugg-content">
        <div className="om-sugg-icon-wrapper">
          <Lightbulb size={32} weight="duotone" color="#d49f53" />
        </div>

        <div className="om-sugg-text">
          <h3 className="om-sugg-title">
            BẠN CÓ CHỦ ĐỀ MUỐN CHIA SẺ VỚI CỘNG ĐỒNG?
          </h3>
          <p className="om-sugg-sub">
            Gợi ý cho chúng tôi nội dung 1 phút hữu ích cho người dân xã Đăk Pxi.
          </p>
        </div>

        <button
          className="om-sugg-cta-btn"
          onClick={() => setIsOpenModal(true)}
          aria-label="Gửi gợi ý nội dung 1 phút"
        >
          <span>GỬI GỢI Ý</span>
          <PaperPlaneTilt size={20} weight="fill" className="om-paperplane-icon" />
        </button>
      </div>

      {/* SUGGESTION FORM MODAL */}
      {isOpenModal && (
        <div className="om-modal-overlay" onClick={() => setIsOpenModal(false)}>
          <div className="om-sugg-modal-card" onClick={(e) => e.stopPropagation()}>
            
            <div className="om-sugg-modal-header">
              <div className="om-sugg-modal-title">
                <PaperPlaneTilt size={22} color="#ffffff" />
                <span>GỬI GỢI Ý NỘI DUNG 1 PHÚT</span>
              </div>
              <button 
                className="om-sugg-modal-close" 
                onClick={() => setIsOpenModal(false)}
                aria-label="Đóng cửa sổ"
              >
                <X size={20} color="#ffffff" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="om-sugg-success-box">
                <CheckCircle size={48} weight="fill" color="#15803d" />
                <h4>Gửi gợi ý thành công!</h4>
                <p>Ban biên tập Chuyên trang Đăk Pxi đã ghi nhận ý kiến của bà con để biên soạn bài học tiếp theo.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="om-sugg-form">
                <div className="om-form-group">
                  <label>Nội dung chủ đề bà con muốn chia sẻ (*):</label>
                  <textarea
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="VD: Hướng dẫn kỹ thuật ủ phân vi sinh từ vỏ cà phê; Cách phòng tránh cúm mùa cho trẻ nhỏ..."
                    required
                  />
                </div>

                <div className="om-form-row">
                  <div className="om-form-group">
                    <label>Họ và tên (không bắt buộc):</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="VD: A Dơi, Y Bích..."
                    />
                  </div>

                  <div className="om-form-group">
                    <label>Số điện thoại liên hệ (nếu có):</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="VD: 0987..."
                    />
                  </div>
                </div>

                <div className="om-form-actions">
                  <button type="button" className="om-cancel-btn" onClick={() => setIsOpenModal(false)}>
                    Hủy bỏ
                  </button>
                  <button type="submit" className="om-submit-btn">
                    <PaperPlaneTilt size={18} weight="fill" /> Gửi tới Ban biên tập
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
