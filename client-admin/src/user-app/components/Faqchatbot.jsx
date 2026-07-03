import { useState } from 'react';
import './Faqchatbot.css';

const FAQ_DATA = {
  vneid: [
    {
      q: 'VNeID là gì?',
      a: 'VNeID là ứng dụng định danh điện tử quốc gia của Việt Nam, giúp bà con làm thủ tục hành chính ngay tại nhà mà không cần mang giấy tờ.',
    },
    {
      q: 'Làm sao để tải VNeID?',
      a: 'Bà con có thể tải VNeID miễn phí trên Google Play (Android) hoặc App Store (iPhone).',
    },
    {
      q: 'VNeID có an toàn không?',
      a: 'Có, VNeID sử dụng công nghệ mã hóa cao nhất để bảo vệ thông tin cá nhân của bà con.',
    },
    {
      q: 'Mất bao lâu để kích hoạt VNeID?',
      a: 'Thường mất 24 giờ để xác nhận tài khoản mức độ 1. Mức độ 2 được kích hoạt ngay khi bà con hoàn thành xác thực.',
    },
    {
      q: 'Điều gì xảy ra nếu quên mật khẩu?',
      a: 'Bà con có thể nhấn "Quên mật khẩu" trên màn hình đăng nhập để đặt lại mật khẩu bằng số điện thoại.',
    },
  ],
  bhxh: [
    {
      q: 'Bảo hiểm xã hội là gì?',
      a: 'Bảo hiểm xã hội là chế độ bảo vệ xã hội của Nhà nước, giúp bà con và gia đình được hỗ trợ khi bị bệnh, thất nghiệp, hay khi về hưu.',
    },
    {
      q: 'Bà con cần có BHXH khi nào?',
      a: 'Người lao động nên đăng ký BHXH khi bắt đầu làm việc tại một cơ sở để được hưởng các quyền lợi.',
    },
    {
      q: 'Làm sao để tra cứu thông tin BHXH?',
      a: 'Bà con có thể tra cứu trên cổng BHXH Việt Nam hoặc sử dụng ứng dụng VNeID để kiểm tra lịch sử đóng BHXH.',
    },
    {
      q: 'Muốn hỗ trợ BHXH ở đâu?',
      a: 'Bà con có thể liên hệ với cơ quan bảo hiểm xã hội ở địa phương hoặc gọi tổng đài 1800599996 để được tư vấn miễn phí.',
    },
  ],
  bhyt: [
    {
      q: 'Thẻ BHYT là gì?',
      a: 'Thẻ BHYT (Bảo hiểm y tế) là giấy chứng nhận quyền được khám chữa bệnh và hưởng bảo hiểm y tế.',
    },
    {
      q: 'Bà con có thể xem thẻ BHYT ở đâu?',
      a: 'Bà con có thể xem thẻ BHYT điện tử trên ứng dụng VNeID hoặc tra cứu trên cổng BHYT Việt Nam.',
    },
    {
      q: 'Thẻ BHYT có hạn sử dụng không?',
      a: 'Có, thẻ BHYT thường có giá trị 1 năm và phải cập nhật hàng năm để tiếp tục hưởng bảo hiểm.',
    },
    {
      q: 'Mất thẻ BHYT làm sao?',
      a: 'Bà con vẫn có thể sử dụng thẻ BHYT điện tử trên VNeID. Nếu cần thẻ vật lý, liên hệ với cơ quan bảo hiểm y tế địa phương.',
    },
  ],
};

export default function FAQChatBot({ type = 'general' }) {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = FAQ_DATA[type] || [];

  if (!faqs.length) {
    return null;
  }

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-chatbot-container">
      <div className="faq-chatbot-header">
        <span className="faq-icon">💬</span>
        <h3>Câu hỏi thường gặp</h3>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button
              className={`faq-question ${openIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <span className="faq-q-icon">❓</span>
              <span className="faq-q-text">{faq.q}</span>
              <span className="faq-toggle-icon">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="faq-answer">
                <span className="faq-a-icon">💡</span>
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="faq-footer">
        <p>
          📞 Còn thắc mắc?{' '}
          <a href="tel:1800599996" className="faq-link">
            Gọi 1800 599 996
          </a>{' '}
          để được hỗ trợ!
        </p>
      </div>
    </div>
  );
}
