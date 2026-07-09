import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatWindow.css';

const ChatWindow = () => {
    const [messages, setMessages] = useState([{ text: "Xin chào! Tôi là trợ lý AI của UBND xã Đăk Pxi, tôi có thể hỗ trợ gì cho bạn?", sender: 'ai' }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Gửi tới API của bạn
            const res = await axios.post('https://chuyen-trang-thong-tin-6os5.vercel.app/api/v1/chat', { message: input });
            setMessages(prev => [...prev, { text: res.data.reply, sender: 'ai' }]);
        } catch (err) {
            setMessages(prev => [...prev, { text: "Xin lỗi, hệ thống đang bận.", sender: 'ai' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-window">
            <div className="message-list">
                {messages.map((m, i) => (
                    <div key={i} className={`message-bubble ${m.sender}`}>{m.text}</div>
                ))}
                {loading && <div className="message-bubble ai">Đang suy nghĩ...</div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
                <button onClick={handleSend}>Gửi</button>
            </div>
        </div>
    );
};

export default ChatWindow;