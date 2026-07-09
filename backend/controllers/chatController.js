exports.getChatResponse = async (req, res) => {
    try {
        const { message } = req.body;
        console.log("Người dùng vừa hỏi:", message); // <--- THÊM DÒNG NÀY

        const knowledge = await Knowledge.findOne({
            $or: [
                { title: { $regex: message, $options: 'i' } },
                { content: { $regex: message, $options: 'i' } }
            ]
        });

        console.log("Kết quả tìm thấy trong DB:", knowledge); // <--- THÊM DÒNG NÀY

        if (knowledge) {
            res.status(200).json({ reply: knowledge.content });
        } else {
            res.status(200).json({ reply: "Xin lỗi, tôi chưa có thông tin này." });
        }
    } catch (error) {
        console.error("Lỗi server:", error); // <--- XEM DÒNG NÀY TRONG TERMINAL
        res.status(500).json({ reply: "Hệ thống đang bận, vui lòng thử lại sau." });
    }
};