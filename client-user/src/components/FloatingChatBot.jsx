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

      <button className="chatbot-trigger" onClick={() => { setIsOpen(!isOpen); if (!isOpen) setShowBubble(false); }}>
        <span className="chatbot-pulse-ring"></span>
        💬 Trợ lý AI
      </button>
    </div>
  );
};

export default FloatingChatBot;