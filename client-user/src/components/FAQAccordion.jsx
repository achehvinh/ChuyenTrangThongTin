import { useState } from "react";
import "./FAQAccordion.css";

const SvgChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SvgChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const DEFAULT_FAQS = [
  {
    id: "faq-1",
    question: "Làm thế nào để tìm thủ tục hành chính?",
    answer:
      "Bà con truy cập vào mục 'Tra cứu thủ tục hành chính', sử dụng ô tìm kiếm trên cùng nhập từ khóa (ví dụ: 'khai sinh', 'sổ đỏ', 'hộ nghèo') hoặc nhấp vào các thẻ lĩnh vực (Tư pháp, Đất đai, Lao động - Xã hội) để lọc danh sách nhanh chóng."
  },
  {
    id: "faq-2",
    question: "Tôi có thể tra cứu BHYT bằng cách nào?",
    answer:
      "Bà con vào mục 'Hướng dẫn BHYT' hoặc 'Tra cứu', nhập số căn cước công dân (CCCD) hoặc mã số BHYT để kiểm tra hạn sử dụng thẻ, quyền lợi hưởng và nơi đăng ký khám chữa bệnh ban đầu."
  },
  {
    id: "faq-3",
    question: "Làm sao sử dụng Trợ lý AI?",
    answer:
      "Nhấp vào nút nổi 'Hỏi thủ tục AI' ở góc dưới bên phải màn hình. Bà con có thể gõ câu hỏi hoặc nhấp chọn các gợi ý sẵn có để nhận trợ giúp giải đáp tự động 24/7."
  },
  {
    id: "faq-4",
    question: "Website có miễn phí không?",
    answer:
      "Website Tra cứu & Tuyên truyền Cổng Thông tin điện tử UBND xã Đăk Pxi hoàn toàn miễn phí 100% phục vụ người dân và cử tri trên địa bàn."
  },
  {
    id: "faq-5",
    question: "Thông tin được cập nhật khi nào?",
    answer:
      "Thông tin thủ tục hành chính, giá nông sản, tin tức tuyên truyền và lịch họp được cán bộ Phòng Văn hóa - Xã hội UBND xã Đăk Pxi cập nhật hàng ngày."
  }
];

export default function FAQAccordion({ items = DEFAULT_FAQS }) {
  const [openId, setOpenId] = useState(null);

  const toggleItem = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="faq-accordion-list">
      {items.map((item, idx) => {
        const isOpen = openId === item.id;
        return (
          <details
            key={item.id}
            className={`faq-accordion-item ${isOpen ? "is-open" : ""}`}
            open={isOpen}
            onClick={(e) => {
              e.preventDefault();
              toggleItem(item.id);
            }}
          >
            <summary className="faq-summary">
              <span className="faq-num">Q{idx + 1}.</span>
              <span className="faq-question">{item.question}</span>
              <span className="faq-icon-toggle">
                {isOpen ? <SvgChevronUp /> : <SvgChevronDown />}
              </span>
            </summary>
            {isOpen && (
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            )}
          </details>
        );
      })}
    </div>
  );
}
