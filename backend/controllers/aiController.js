const { getAIResponse } = require('../services/openaiService');
const Conversation = require('../models/Conversation');

exports.chat = async (req, res) => {
    try {
        const { message, userId } = req.body;
        
        // 1. Gọi service để lấy câu trả lời từ AI
        const reply = await getAIResponse(message);

        // 2. Lưu vào database (MongoDB)
        await Conversation.create({
            userId,
            message,
            reply,
            timestamp: new Date()
        });

        res.status(200).json({ success: true, reply });
    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({ success: false, message: "Lỗi xử lý AI" });
    }
};

exports.getHistory = async (req, res) => {
    // Logic lấy lịch sử chat của user
    res.json({ message: "Lịch sử chat" });
};