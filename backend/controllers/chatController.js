const Knowledge = require('../models/Knowledge');

exports.getChatResponse = async (req, res) => {
    try {
        const { message } = req.body;
        // Tìm kiếm dữ liệu khớp nhất với từ khóa người dùng
        const knowledge = await Knowledge.findOne({
            $or: [
                { title: { $regex: message, $options: 'i' } },
                { content: { $regex: message, $options: 'i' } }
            ]
        });

        if (knowledge) {
            res.status(200).json({ reply: knowledge.content });
        } else {
            res.status(200).json({ reply: "Xin lỗi, tôi chưa tìm thấy thông tin này. Bạn vui lòng liên hệ trực tiếp UBND xã để được hỗ trợ." });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};