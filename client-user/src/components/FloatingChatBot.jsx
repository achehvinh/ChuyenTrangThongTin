import React, { useState } from 'react';
import ChatWindow from './ai/ChatWindow'; // Đảm bảo đường dẫn này đúng tới file ChatWindow của bạn
import './FloatingChatBot.css'; // Chúng ta sẽ tạo file css này bên dưới

const FloatingChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chatbot-wrapper">
      {isOpen && (
        <div className="chatbot-popup">
          <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          <ChatWindow />
        </div>
      )}
      <button className="chatbot-trigger" onClick={() => setIsOpen(!isOpen)}>
        💬 Trợ lý AI
      </button>
    </div>
  );
};

export default FloatingChatBot;