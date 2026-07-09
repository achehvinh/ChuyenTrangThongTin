const Knowledge = require('../models/Knowledge');

// Lấy tất cả kiến thức
exports.getAllKnowledge = async (req, res) => {
    try {
        const knowledgeList = await Knowledge.find().sort({ createdAt: -1 });
        res.status(200).json(knowledgeList);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu" });
    }
};

// Thêm kiến thức mới
exports.addKnowledge = async (req, res) => {
    try {
        const newKnowledge = new Knowledge(req.body);
        await newKnowledge.save();
        res.status(201).json(newKnowledge);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm dữ liệu" });
    }
};

// Xóa kiến thức
exports.deleteKnowledge = async (req, res) => {
    try {
        await Knowledge.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Đã xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa" });
    }
};