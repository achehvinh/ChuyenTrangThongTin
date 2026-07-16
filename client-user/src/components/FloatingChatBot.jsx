import React, { useState } from 'react';
import ChatWindow from './ai/ChatWindow'; // Đảm bảo đường dẫn này đúng tới file ChatWindow của bạn
import './FloatingChatBot.css'; // Chúng ta sẽ tạo file css này bên dưới

const FloatingChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

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
          <span>Bà con cần hỏi gì? Nhấn vào đây! 💬</span>
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