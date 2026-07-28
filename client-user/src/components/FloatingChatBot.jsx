import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ChatWindow from './ai/ChatWindow';
import './FloatingChatBot.css';

// Thông điệp gợi ý bong bóng nổi dựa trên trang hiện tại
const BUBBLE_MESSAGES = {
  '/phong-chong-lua-dao': '🛡️ Hỏi Trợ lý AI Phòng VH-XH về cách nhận biết & tố giác lừa đảo mạng? 💬',
  '/an-toan-giao-thong': '🚦 Hỏi Trợ lý AI Phòng VH-XH về luật an toàn giao thông & mức phạt? 💬',
  '/thien-tai': '🌧️ Hỏi Trợ lý AI Phòng VH-XH về kỹ năng ứng phó lũ quét & sạt lở? 💬',
  '/bau-cu': '🗳️ Hỏi Trợ lý AI Phòng VH-XH về địa điểm bỏ phiếu & quyền cử tri? 💬',
  '/huong-dan-vneid': '🆔 Hỏi Trợ lý AI Phòng VH-XH cách kích hoạt & dùng VNeID Mức 2? 💬',
  '/te-nan': '🛡️ Hỏi Trợ lý AI Phòng VH-XH cách phòng ngừa ma túy & tố giác tệ nạn? 💬',
  '/chay-rung': '🔥 Hỏi Trợ lý AI Phòng VH-XH quy định đốt rẫy & báo cháy rừng mùa khô? 💬',
  '/duoi-nuoc': '🏊 Hỏi Trợ lý AI Phòng VH-XH kỹ năng sơ cứu & phòng tránh đuối nước? 💬',
  '/thu-tuc-hanh-chinh': '📑 Hỏi Trợ lý AI Phòng VH-XH về giấy tờ khai sinh, kết hôn, đất đai? 💬',
  '/tra-cuu': '🏥 Hỏi Trợ lý AI Phòng VH-XH cách tra cứu thẻ BHYT & đóng BHXH? 💬',
};

const FloatingChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname;

  // Ẩn hoàn toàn Trợ lý AI dân sự công cộng khi cán bộ làm việc trong Dashboard nội bộ
  if (currentPath.includes('/truong-phong-dashboard') || currentPath.includes('/cuoc-hop-truc-tuyen')) {
    return null;
  }

  const bubbleText = BUBBLE_MESSAGES[currentPath] || '💬 Bà con cần hỗ trợ thủ tục hay thông tin gì? Hỏi Trợ lý AI Phòng Văn hóa - Xã hội ngay!';

  return (
    <div className="chatbot-wrapper">
      {isOpen && (
        <div className="chatbot-popup">
          <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          <ChatWindow />
        </div>
      )}
      
      {showBubble && !isOpen && (
        <div className="chatbot-greeting-bubble" onClick={() => { setIsOpen(true); setShowBubble(false); }}>
          <button 
            className="bubble-close-btn" 
            onClick={(e) => { 
              e.stopPropagation(); 
              setShowBubble(false); 
            }}
          >
            ×
          </button>
          <span>{bubbleText}</span>
        </div>
      )}

      <button className="chatbot-trigger" onClick={() => { setIsOpen(!isOpen); if (!isOpen) setShowBubble(false); }} title="Mở Trợ lý AI giải đáp">
        <span className="chatbot-pulse-ring"></span>
        <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="46" fill="#f3e8ff" />
          <circle cx="50" cy="50" r="38" fill="#e9d5ff" opacity="0.6" />
          <rect x="36" y="62" width="28" height="24" rx="10" fill="#ffffff" stroke="#c084fc" strokeWidth="2.5" />
          <circle cx="50" cy="74" r="6" fill="#2563eb" />
          <circle cx="50" cy="74" r="2.5" fill="#ffffff" />
          <rect x="26" y="28" width="48" height="34" rx="14" fill="#ffffff" stroke="#c084fc" strokeWidth="2.5" />
          <rect x="31" y="33" width="38" height="24" rx="10" fill="#7c3aed" />
          <circle cx="43" cy="45" r="3.5" fill="#ffffff" />
          <circle cx="57" cy="45" r="3.5" fill="#ffffff" />
          <circle cx="44" cy="44" r="1.2" fill="#000000" />
          <circle cx="58" cy="44" r="1.2" fill="#000000" />
          <line x1="50" y1="28" x2="50" y2="20" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="18" r="4" fill="#a855f7" />
          <rect x="22" y="38" width="5" height="14" rx="2.5" fill="#a855f7" />
          <rect x="73" y="38" width="5" height="14" rx="2.5" fill="#a855f7" />
        </svg>
      </button>
    </div>
  );
};

export default FloatingChatBot;